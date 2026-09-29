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
        <div className="overflow-x-auto">
            {ingredients.length === 0 ? (
                <div className="flex min-h-72 items-center justify-center px-4 text-sm text-slate-500">
                    No ingredients found.
                </div>
            ) : (
                <table className="min-w-full border-collapse text-left text-sm">
                    <thead className="border-y border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        <tr>
                            <th scope="col" className="px-4 py-3">Name</th>
                            <th scope="col" className="px-4 py-3">Category</th>
                            <th scope="col" className="px-4 py-3">Unit</th>
                            <th scope="col" className="px-4 py-3">Stock Available</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                        {ingredients.map((ingredient) => (
                            <tr key={ingredient.id} className="transition-colors hover:bg-slate-50">
                                <td className="px-4 py-3.5 font-medium text-slate-900">
                                    {ingredient.name}
                                </td>
                                <td className="px-4 py-3.5">{ingredient.category}</td>
                                <td className="px-4 py-3.5">{ingredient.unit}</td>
                                <td className="px-4 py-3.5">{ingredient.current_stock}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default IngredientsTable;
