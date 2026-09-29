import { useEffect, useState } from "react";

import { IngredientsToolbar } from "../components/IngredientsToolbar";
import { getIngredients } from "../services/ingredientService";
import IngredientsTable from "../components/IngredientsTable";

const IngredientsPage = () => {
  const [ingredients, setIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadIngredients() {
      try {
        const data = await getIngredients();

        console.log("Ingredients:", data);

        setIngredients(data);
      } catch (error) {
        console.error("Failed to fetch ingredients:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadIngredients();
  }, []);

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
        <IngredientsToolbar />
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
          ) : (
            <IngredientsTable ingredients={ingredients} />
          )}
        </div>
      </section>
    </div>
  );
};


export default IngredientsPage;
