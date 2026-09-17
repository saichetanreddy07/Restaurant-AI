from enum import Enum


class Unit(str, Enum):
    KG = "kg"
    G = "g"
    L = "l"
    ML = "ml"
    PCS = "pcs"


class MenuCategory(str, Enum):
    """Categories representing the types of products a restaurant can sell."""

    BURGER = "burger"
    PIZZA = "pizza"
    PASTA = "pasta"
    SANDWICH = "sandwich"
    WRAP = "wrap"
    RICE = "rice"
    SALAD = "salad"
    STARTER = "starter"
    DESSERT = "dessert"
    BEVERAGE = "beverage"
    COMBO = "combo"
    OTHER = "other"