import { useEffect, useState } from "react";

import AddIngredientModal from "../components/AddIngredientModal";
import { IngredientsToolbar } from "../components/IngredientsToolbar";
import { getIngredients } from "../services/ingredientService";
import IngredientsTable from "../components/IngredientsTable";

type Ingredient = {
  id: number;
  name: string;
  category: string;
  unit: string;
  current_stock: number;
  minimum_stock: number;
  supplier: string;
};

const IngredientsPage = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [creationSuccessMessage, setCreationSuccessMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const filteredIngredients = ingredients.filter((ingredient) =>
    ingredient.name.toLowerCase().includes(normalizedSearchQuery),
  );

  useEffect(() => {
    async function loadIngredients() {
      try {
        const data = await getIngredients();

        console.log("Ingredients:", data);

        setIngredients(data);
      } catch {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    }

    loadIngredients();
  }, [retryCount]);

  const handleRetry = () => {
    setIsLoading(true);
    setHasError(false);
    setRetryCount((currentCount) => currentCount + 1);
  };

  const handleIngredientCreated = () => {
    setCreationSuccessMessage("Ingredient created successfully.");
    setIsAddModalOpen(false);
    setIsLoading(true);
    setHasError(false);
    setRetryCount((currentCount) => currentCount + 1);
  };

  const handleOpenAddModal = () => {
    setCreationSuccessMessage("");
    setIsAddModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Ingredients
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage ingredient inventory, measurement units, and stock levels.
        </p>
      </div>

      <section
        aria-label="Ingredient management"
        className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <IngredientsToolbar
          onAddIngredient={handleOpenAddModal}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        {creationSuccessMessage && (
          <p
            role="status"
            className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800"
          >
            {creationSuccessMessage}
          </p>
        )}
        <div
          aria-label="Ingredients table area"
          className="mt-5 min-h-80 rounded-lg border border-slate-100 bg-slate-50/50"
          role="region"
        >
          {isLoading ? (
            <div
              aria-busy="true"
              aria-label="Loading ingredients"
              className="space-y-3 p-5"
            >
              <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
              <div className="h-12 animate-pulse rounded bg-slate-100" />
              <div className="h-12 animate-pulse rounded bg-slate-100" />
              <div className="h-12 animate-pulse rounded bg-slate-100" />
              <div className="h-12 animate-pulse rounded bg-slate-100" />
            </div>
          ) : hasError ? (
            <div
              role="alert"
              className="flex min-h-80 flex-col items-center justify-center gap-4 px-6 text-center"
            >
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Unable to load ingredients
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Please check your connection and try again.
                </p>
              </div>
              <button
                type="button"
                onClick={handleRetry}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
              >
                Retry
              </button>
            </div>
          ) : (
            <IngredientsTable
              ingredients={filteredIngredients}
              searchQuery={searchQuery}
            />
          )}
        </div>
      </section>

      {isAddModalOpen && (
        <AddIngredientModal
          onClose={() => setIsAddModalOpen(false)}
          onCreated={handleIngredientCreated}
        />
      )}
    </div>
  );
};


export default IngredientsPage;
