type StockStatusBadgeProps = {
    currentStock: number;
    minimumStock: number;
};

const StockStatusBadge = ({ currentStock, minimumStock }: StockStatusBadgeProps) => {
    let label = "In Stock";
    let colorClasses = "bg-emerald-100 text-emerald-700";

    if (currentStock === 0) {
        label = "Out of Stock";
        colorClasses = "bg-red-100 text-red-700";
    } else if (currentStock <= minimumStock) {
        label = "Low Stock";
        colorClasses = "bg-amber-100 text-amber-700";
    }

    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClasses}`}
        >
            {label}
        </span>
    );
};

export default StockStatusBadge;
