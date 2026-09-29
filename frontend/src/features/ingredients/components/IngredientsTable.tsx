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
                <div className="flex min-h-72 items-center justify-center px-4 text-sm text-slate-500">
                    No ingredients found.
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
                                    <td className="whitespace-nowrap px-6 py-4 text-right text-slate-400">
                                        -
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
