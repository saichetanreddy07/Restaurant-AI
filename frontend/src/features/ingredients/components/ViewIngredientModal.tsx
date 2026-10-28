import { useEffect, useRef } from "react";
import { X } from "lucide-react";

import type { Ingredient } from "../types";

type ViewIngredientModalProps = {
  ingredient: Ingredient;
  onClose: () => void;
};

const formatDate = (value: string) => new Date(value).toLocaleString();

const ViewIngredientModal = ({
  ingredient,
  onClose,
}: ViewIngredientModalProps) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const details = [
    ["Ingredient ID", String(ingredient.id)],
    ["Ingredient Name", ingredient.name],
    ["Category", ingredient.category || "Not provided"],
    ["Unit", ingredient.unit],
    ["Current Stock", `${ingredient.current_stock} ${ingredient.unit}`],
    ["Minimum Stock", `${ingredient.minimum_stock} ${ingredient.unit}`],
    ["Cost per Unit", `${ingredient.cost_per_unit} / ${ingredient.unit}`],
    ["Supplier", ingredient.supplier || "Not provided"],
    ["Created", formatDate(ingredient.created_at)],
    ["Last Updated", formatDate(ingredient.updated_at)],
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/40 px-4 py-6"
      role="presentation"
    >
      <section
        aria-labelledby="view-ingredient-title"
        aria-modal="true"
        role="dialog"
        className="my-auto max-h-[calc(100vh-3rem)] w-full max-w-2xl overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 id="view-ingredient-title" className="text-lg font-semibold text-slate-900">
            Ingredient Details
          </h2>
          <button
            type="button"
            aria-label="Close ingredient details"
            ref={closeButtonRef}
            onClick={onClose}
            className="inline-flex size-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>

        <dl className="grid grid-cols-1 gap-x-6 gap-y-5 px-5 py-6 sm:grid-cols-2 sm:px-6">
          {details.map(([label, value]) => (
            <div key={label}>
              <dt className="text-sm font-medium text-slate-500">{label}</dt>
              <dd className="mt-1 break-words text-sm text-slate-900">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="flex justify-end border-t border-slate-200 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
          >
            Close
          </button>
        </div>
      </section>
    </div>
  );
};

export default ViewIngredientModal;
