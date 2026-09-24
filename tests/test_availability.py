"""Comprehensive tests for Module 6: Availability Engine."""

from datetime import date, timedelta
from decimal import Decimal
import pytest
from fastapi import HTTPException
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, func, select
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from backend.app.core.enums import MenuCategory, Unit
from backend.app.db.database import Base, get_db
from backend.app.main import app
from backend.app.models.ingredient import Ingredient
from backend.app.models.inventory_batch import InventoryBatch
from backend.app.models.inventory_transaction import InventoryTransaction
from backend.app.models.menu_item import MenuItem
from backend.app.models.recipe import Recipe
from backend.app.models.recipe_ingredient import RecipeIngredient
from backend.app.schemas.inventory_consumption import InventoryConsumeRequest
from backend.app.services.availability_service import AvailabilityService
from backend.app.services.inventory_batch_service import InventoryBatchService
from backend.app.services.inventory_consumption_service import (
    InventoryConsumptionService,
)


@pytest.fixture(name="db_session")
def fixture_db_session():
    """Create an isolated in-memory SQLite database session for testing."""
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(bind=engine)
    TestingSessionLocal = sessionmaker(
        autocommit=False, autoflush=False, bind=engine
    )
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(name="client")
def fixture_client(db_session: Session):
    """FastAPI TestClient configured with test database session override."""

    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


def create_sample_menu_item(db: Session, name: str = "Classic Burger") -> MenuItem:
    """Helper to create a test MenuItem."""
    menu_item = MenuItem(
        name=name,
        category=MenuCategory.BURGER,
        price=Decimal("9.99"),
    )
    db.add(menu_item)
    db.commit()
    db.refresh(menu_item)
    return menu_item


def create_sample_ingredient(
    db: Session,
    name: str,
    stock: float = 0.0,
    unit: Unit = Unit.PCS,
) -> Ingredient:
    """Helper to create a test Ingredient."""
    ingredient = Ingredient(
        name=name,
        category="General",
        unit=unit,
        current_stock=stock,
        minimum_stock=2.0,
        cost_per_unit=Decimal("1.50"),
    )
    db.add(ingredient)
    db.commit()
    db.refresh(ingredient)
    return ingredient


def create_sample_recipe(
    db: Session, menu_item_id: int, name: str = "Classic Burger Recipe"
) -> Recipe:
    """Helper to create a test Recipe."""
    recipe = Recipe(
        name=name,
        menu_item_id=menu_item_id,
    )
    db.add(recipe)
    db.commit()
    db.refresh(recipe)
    return recipe


def add_recipe_ingredient(
    db: Session, recipe_id: int, ingredient_id: int, quantity: Decimal
) -> RecipeIngredient:
    """Helper to link an ingredient to a recipe."""
    ri = RecipeIngredient(
        recipe_id=recipe_id,
        ingredient_id=ingredient_id,
        quantity=quantity,
    )
    db.add(ri)
    db.commit()
    db.refresh(ri)
    return ri


# ==============================================================================
# Unit & Service Layer Tests
# ==============================================================================


def test_recipe_not_found(db_session: Session):
    """Service rejects non-existent recipe with 404 Not Found."""
    service = AvailabilityService(db_session)
    with pytest.raises(HTTPException) as exc_info:
        service.check_recipe_availability(9999)
    assert exc_info.value.status_code == 404
    assert "not found" in exc_info.value.detail.lower()


def test_recipe_no_ingredients(db_session: Session):
    """Service rejects recipe with no ingredients with 400 Bad Request."""
    menu_item = create_sample_menu_item(db_session, "Empty Dish")
    recipe = create_sample_recipe(db_session, menu_item.id, "Empty Recipe")

    service = AvailabilityService(db_session)
    with pytest.raises(HTTPException) as exc_info:
        service.check_recipe_availability(recipe.id)
    assert exc_info.value.status_code == 400
    assert "no ingredients configured" in exc_info.value.detail.lower()


def test_single_ingredient_sufficient_stock(db_session: Session):
    """Test availability and maximum servings with single ingredient."""
    menu_item = create_sample_menu_item(db_session, "French Fries")
    recipe = create_sample_recipe(db_session, menu_item.id, "Fries Recipe")
    potato = create_sample_ingredient(
        db_session, "Potato", stock=10.0, unit=Unit.KG
    )
    add_recipe_ingredient(db_session, recipe.id, potato.id, Decimal("2.00"))

    service = AvailabilityService(db_session)
    result = service.check_recipe_availability(recipe.id)

    assert result.recipe_id == recipe.id
    assert result.available is True
    assert result.maximum_servings == 5  # floor(10.0 / 2.0)
    assert len(result.ingredients) == 1
    assert result.ingredients[0].ingredient_name == "Potato"
    assert result.ingredients[0].has_sufficient_stock is True
    assert result.ingredients[0].has_shortage is False
    assert result.ingredients[0].maximum_servings == 5


def test_multiple_ingredients_bottleneck(db_session: Session):
    """Test that recipe maximum servings is constrained by the bottleneck ingredient."""
    menu_item = create_sample_menu_item(db_session, "Double Cheeseburger")
    recipe = create_sample_recipe(
        db_session, menu_item.id, "Cheeseburger Recipe"
    )

    bun = create_sample_ingredient(db_session, "Burger Bun", stock=20.0)
    patty = create_sample_ingredient(db_session, "Beef Patty", stock=7.0)
    cheese = create_sample_ingredient(db_session, "Cheese Slice", stock=15.0)

    # 1 bun per serving -> floor(20 / 1) = 20 servings
    add_recipe_ingredient(db_session, recipe.id, bun.id, Decimal("1.00"))
    # 2 patties per serving -> floor(7 / 2) = 3 servings (bottleneck!)
    add_recipe_ingredient(db_session, recipe.id, patty.id, Decimal("2.00"))
    # 2 cheese per serving -> floor(15 / 2) = 7 servings
    add_recipe_ingredient(db_session, recipe.id, cheese.id, Decimal("2.00"))

    service = AvailabilityService(db_session)
    result = service.check_recipe_availability(recipe.id)

    assert result.available is True
    assert result.maximum_servings == 3  # Bottleneck is patty (3 servings)


def test_zero_stock_ingredient_makes_recipe_unavailable(db_session: Session):
    """If any ingredient has zero stock, maximum servings = 0 and available = False."""
    menu_item = create_sample_menu_item(db_session, "Veggie Sandwich")
    recipe = create_sample_recipe(db_session, menu_item.id, "Sandwich Recipe")

    bread = create_sample_ingredient(db_session, "Bread Slices", stock=10.0)
    lettuce = create_sample_ingredient(db_session, "Lettuce", stock=0.0)

    add_recipe_ingredient(db_session, recipe.id, bread.id, Decimal("2.00"))
    add_recipe_ingredient(db_session, recipe.id, lettuce.id, Decimal("1.00"))

    service = AvailabilityService(db_session)
    result = service.check_recipe_availability(recipe.id)

    assert result.available is False
    assert result.maximum_servings == 0

    lettuce_info = next(
        i for i in result.ingredients if i.ingredient_name == "Lettuce"
    )
    assert lettuce_info.has_sufficient_stock is False
    assert lettuce_info.has_shortage is True
    assert lettuce_info.shortage_quantity == Decimal("1.00")
    assert lettuce_info.maximum_servings == 0


def test_partial_insufficient_stock(db_session: Session):
    """If stock is > 0 but less than single serving requirement, maximum servings = 0."""
    menu_item = create_sample_menu_item(db_session, "Steak Dinner")
    recipe = create_sample_recipe(db_session, menu_item.id, "Steak Recipe")

    steak = create_sample_ingredient(
        db_session, "Ribeye Steak", stock=0.8, unit=Unit.KG
    )
    add_recipe_ingredient(db_session, recipe.id, steak.id, Decimal("1.00"))

    service = AvailabilityService(db_session)
    result = service.check_recipe_availability(recipe.id)

    assert result.available is False
    assert result.maximum_servings == 0

    steak_info = result.ingredients[0]
    assert steak_info.has_sufficient_stock is False
    assert steak_info.has_shortage is True
    assert steak_info.shortage_quantity == Decimal("0.20")


def test_read_only_guarantee(db_session: Session):
    """Availability calculations must be strictly read-only and never mutate DB state."""
    menu_item = create_sample_menu_item(db_session, "Pizza")
    recipe = create_sample_recipe(db_session, menu_item.id, "Pizza Recipe")
    dough = create_sample_ingredient(db_session, "Pizza Dough", stock=5.0)
    add_recipe_ingredient(db_session, recipe.id, dough.id, Decimal("1.00"))

    # Record initial counts
    initial_ingredients_count = db_session.scalar(
        select(func.count(Ingredient.id))
    )
    initial_recipes_count = db_session.scalar(select(func.count(Recipe.id)))
    initial_ri_count = db_session.scalar(
        select(func.count(RecipeIngredient.id))
    )
    initial_batches_count = db_session.scalar(
        select(func.count(InventoryBatch.id))
    )
    initial_tx_count = db_session.scalar(
        select(func.count(InventoryTransaction.id))
    )

    service = AvailabilityService(db_session)
    for _ in range(5):
        service.check_recipe_availability(recipe.id)
        service.get_all_recipes_availability()
        service.check_menu_item_availability(menu_item.id)
        service.get_all_menu_items_availability()

    # Verify counts remain identical
    assert (
        db_session.scalar(select(func.count(Ingredient.id)))
        == initial_ingredients_count
    )
    assert (
        db_session.scalar(select(func.count(Recipe.id)))
        == initial_recipes_count
    )
    assert (
        db_session.scalar(select(func.count(RecipeIngredient.id)))
        == initial_ri_count
    )
    assert (
        db_session.scalar(select(func.count(InventoryBatch.id)))
        == initial_batches_count
    )
    assert (
        db_session.scalar(select(func.count(InventoryTransaction.id)))
        == initial_tx_count
    )


def test_menu_item_availability(db_session: Session):
    """Test menu item availability lookup and validation."""
    menu_item = create_sample_menu_item(db_session, "Hot Dog")
    service = AvailabilityService(db_session)

    # Menu item with no recipe raises 404
    with pytest.raises(HTTPException) as exc_404:
        service.check_menu_item_availability(menu_item.id)
    assert exc_404.value.status_code == 404

    # Menu item with recipe but no ingredients raises 400
    recipe = create_sample_recipe(db_session, menu_item.id, "Hot Dog Recipe")
    with pytest.raises(HTTPException) as exc_400:
        service.check_menu_item_availability(menu_item.id)
    assert exc_400.value.status_code == 400

    # Add ingredients
    sausage = create_sample_ingredient(db_session, "Sausage", stock=10.0)
    add_recipe_ingredient(db_session, recipe.id, sausage.id, Decimal("1.00"))

    result = service.check_menu_item_availability(menu_item.id)
    assert result.menu_item_id == menu_item.id
    assert result.recipe_id == recipe.id
    assert result.available is True
    assert result.maximum_servings == 10


def test_dynamic_availability_with_inventory_sync(db_session: Session):
    """Test dynamic availability changes when inventory is added and consumed."""
    menu_item = create_sample_menu_item(db_session, "Pancakes")
    recipe = create_sample_recipe(db_session, menu_item.id, "Pancakes Recipe")
    flour = create_sample_ingredient(
        db_session, "Flour", stock=0.0, unit=Unit.KG
    )
    add_recipe_ingredient(db_session, recipe.id, flour.id, Decimal("1.00"))

    service = AvailabilityService(db_session)

    # Initial state: 0 stock -> 0 servings
    avail_0 = service.check_recipe_availability(recipe.id)
    assert avail_0.available is False
    assert avail_0.maximum_servings == 0

    # Intake a batch of 10.0 KG via batch service
    batch_service = InventoryBatchService(db_session)
    batch = InventoryBatch(
        ingredient_id=flour.id,
        batch_number="FLOUR-001",
        quantity=Decimal("10.00"),
        unit_cost=Decimal("2.00"),
        supplier="Bakery Wholesale",
        received_date=date.today(),
        expiry_date=date.today() + timedelta(days=30),
    )
    db_session.add(batch)
    db_session.commit()
    batch_service.sync_ingredient_stock(flour.id)

    # After batch intake: 10 servings available
    avail_1 = service.check_recipe_availability(recipe.id)
    assert avail_1.available is True
    assert avail_1.maximum_servings == 10

    # Consume 6 servings via consumption engine
    consume_service = InventoryConsumptionService(db_session)
    consume_service.consume_recipe_inventory(
        InventoryConsumeRequest(recipe_id=recipe.id, servings=6)
    )

    # Dynamic check: 10 - 6 = 4 servings remaining
    avail_2 = service.check_recipe_availability(recipe.id)
    assert avail_2.available is True
    assert avail_2.maximum_servings == 4


# ==============================================================================
# API Endpoint Integration Tests
# ==============================================================================


def test_api_check_recipe_availability(client: TestClient, db_session: Session):
    """Test GET /availability/recipes/{recipe_id} endpoint."""
    menu_item = create_sample_menu_item(db_session, "Soup")
    recipe = create_sample_recipe(db_session, menu_item.id, "Soup Recipe")
    broth = create_sample_ingredient(
        db_session, "Broth", stock=6.0, unit=Unit.L
    )
    add_recipe_ingredient(db_session, recipe.id, broth.id, Decimal("2.00"))

    response = client.get(f"/availability/recipes/{recipe.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["recipe_id"] == recipe.id
    assert data["available"] is True
    assert data["maximum_servings"] == 3
    assert len(data["ingredients"]) == 1
    assert data["ingredients"][0]["ingredient_name"] == "Broth"
    assert data["ingredients"][0]["has_sufficient_stock"] is True


def test_api_check_recipe_availability_404(client: TestClient):
    """Test GET /availability/recipes/{recipe_id} for non-existent recipe."""
    response = client.get("/availability/recipes/9999")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_api_check_recipe_availability_400(
    client: TestClient, db_session: Session
):
    """Test GET /availability/recipes/{recipe_id} for recipe with no ingredients."""
    menu_item = create_sample_menu_item(db_session, "Cake")
    recipe = create_sample_recipe(db_session, menu_item.id, "Cake Recipe")

    response = client.get(f"/availability/recipes/{recipe.id}")
    assert response.status_code == 400
    assert "no ingredients configured" in response.json()["detail"].lower()


def test_api_get_all_recipes_availability(
    client: TestClient, db_session: Session
):
    """Test GET /availability/recipes list endpoint."""
    menu_item = create_sample_menu_item(db_session, "Pasta")
    recipe = create_sample_recipe(db_session, menu_item.id, "Pasta Recipe")
    noodles = create_sample_ingredient(
        db_session, "Noodles", stock=8.0, unit=Unit.KG
    )
    add_recipe_ingredient(db_session, recipe.id, noodles.id, Decimal("2.00"))

    response = client.get("/availability/recipes")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    pasta_entry = next((r for r in data if r["recipe_id"] == recipe.id), None)
    assert pasta_entry is not None
    assert pasta_entry["available"] is True
    assert pasta_entry["maximum_servings"] == 4


def test_api_check_menu_item_availability(
    client: TestClient, db_session: Session
):
    """Test GET /availability/menu-items/{menu_item_id} endpoint."""
    menu_item = create_sample_menu_item(db_session, "Espresso")
    recipe = create_sample_recipe(db_session, menu_item.id, "Espresso Recipe")
    beans = create_sample_ingredient(
        db_session, "Coffee Beans", stock=1.0, unit=Unit.KG
    )
    add_recipe_ingredient(db_session, recipe.id, beans.id, Decimal("0.05"))

    response = client.get(f"/availability/menu-items/{menu_item.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["menu_item_id"] == menu_item.id
    assert data["recipe_id"] == recipe.id
    assert data["available"] is True
    assert data["maximum_servings"] == 20  # floor(1.0 / 0.05)


def test_api_get_all_menu_items_availability(
    client: TestClient, db_session: Session
):
    """Test GET /availability/menu-items list endpoint."""
    # Item with recipe and ingredients
    item1 = create_sample_menu_item(db_session, "Item 1")
    recipe1 = create_sample_recipe(db_session, item1.id, "Recipe 1")
    ing1 = create_sample_ingredient(db_session, "Ing 1", stock=5.0)
    add_recipe_ingredient(db_session, recipe1.id, ing1.id, Decimal("1.00"))

    # Item without recipe
    item2 = create_sample_menu_item(db_session, "Item 2 Without Recipe")

    response = client.get("/availability/menu-items")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

    entry1 = next((i for i in data if i["menu_item_id"] == item1.id), None)
    entry2 = next((i for i in data if i["menu_item_id"] == item2.id), None)

    assert entry1 is not None
    assert entry1["available"] is True
    assert entry1["maximum_servings"] == 5

    assert entry2 is not None
    assert entry2["available"] is False
    assert entry2["maximum_servings"] == 0
    assert entry2["recipe_id"] is None
