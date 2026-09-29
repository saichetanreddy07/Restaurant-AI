import { Eye, Pencil, Trash2 } from "lucide-react";

import StockStatusBadge from "./StockStatusBadge";

type Ingredient = {
    id: number;
    name: string;
    category: string;
    unit: string;
    current_stock: number;
    minimum_stock: number;
    supplier: string;
};

type IngredientsTableProps = {
    ingredients: Ingredient[];
};

const IngredientsTable = ({ ingredients }: IngredientsTableProps) => {
    return (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            {ingredients.length === 0 ? (
                <div className="flex min-h-72 items-center justify-center px-6 py-12 text-center">
                    <div className="max-w-sm">
                        <h2 className="text-base font-semibold text-slate-900">
                            No ingredients found
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Create your first ingredient to start managing inventory.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-[1050px] w-full border-collapse text-left text-sm">
                        <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            <tr>
                                <th scope="col" className="px-6 py-3.5">Ingredient</th>
                                <th scope="col" className="px-6 py-3.5">Category</th>
                                <th scope="col" className="px-6 py-3.5">Unit</th>
                                <th scope="col" className="px-6 py-3.5 text-right">Current Stock</th>
                                <th scope="col" className="px-6 py-3.5 text-right">Minimum Stock</th>
                                <th scope="col" className="px-6 py-3.5">Supplier</th>
                                <th scope="col" className="px-6 py-3.5">Status</th>
                                <th scope="col" className="px-6 py-3.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 text-slate-700">
                            {ingredients.map((ingredient) => (
                                <tr key={ingredient.id} className="transition-colors hover:bg-slate-50">
                                    <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-900">
                                        {ingredient.name}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">{ingredient.category}</td>
                                    <td className="whitespace-nowrap px-6 py-4">{ingredient.unit}</td>
                                    <td className="whitespace-nowrap px-6 py-4 text-right tabular-nums text-slate-900">
                                        {ingredient.current_stock}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-right tabular-nums text-slate-900">
                                        {ingredient.minimum_stock}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">{ingredient.supplier}</td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <StockStatusBadge
                                            currentStock={ingredient.current_stock}
                                            minimumStock={ingredient.minimum_stock}
                                        />
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                type="button"
                                                aria-label={`View ${ingredient.name}`}
                                                title="View ingredient"
                                                className="inline-flex size-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                                            >
                                                <Eye aria-hidden="true" className="size-4" />
                                            </button>
                                            <button
                                                type="button"
                                                aria-label={`Edit ${ingredient.name}`}
                                                title="Edit ingredient"
                                                className="inline-flex size-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                                            >
                                                <Pencil aria-hidden="true" className="size-4" />
                                            </button>
                                            <button
                                                type="button"
                                                aria-label={`Delete ${ingredient.name}`}
                                                title="Delete ingredient"
                                                className="inline-flex size-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                                            >
                                                <Trash2 aria-hidden="true" className="size-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default IngredientsTable;
