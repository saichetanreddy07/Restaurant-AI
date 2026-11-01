import type { Ingredient } from '../../ingredients/types'
import type { InventoryBatch } from '../types'

type InventoryBatchesTableProps = {
  batches: InventoryBatch[]
  ingredients: Ingredient[]
}

const getDaysUntilExpiry = (expiryDate: string) => {
  const [year, month, day] = expiryDate.split('-').map(Number)
  const expiryDay = Date.UTC(year, month - 1, day)
  const today = new Date()
  const todayDay = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())

  return Math.floor((expiryDay - todayDay) / 86_400_000)
}

const formatDate = (value: string) =>
  new Date(`${value}T00:00:00`).toLocaleDateString()

const BatchStatusBadge = ({ batch }: { batch: InventoryBatch }) => {
  const daysUntilExpiry = getDaysUntilExpiry(batch.expiry_date)
  const isDepleted = Number(batch.quantity) <= 0
  const label = isDepleted
    ? 'Depleted'
    : daysUntilExpiry < 0
      ? 'Expired'
      : daysUntilExpiry <= 7
        ? 'Expiring soon'
        : 'In date'
  const colorClasses = isDepleted || daysUntilExpiry < 0
    ? 'bg-red-100 text-red-700'
    : daysUntilExpiry <= 7
      ? 'bg-amber-100 text-amber-700'
      : 'bg-emerald-100 text-emerald-700'

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClasses}`}>
      {label}
    </span>
  )
}

const InventoryBatchesTable = ({ batches, ingredients }: InventoryBatchesTableProps) => {
  const ingredientNames = new Map(ingredients.map((ingredient) => [ingredient.id, ingredient]))

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      {batches.length === 0 ? (
        <div className="flex min-h-72 items-center justify-center px-6 py-12 text-center">
          <div className="max-w-sm">
            <h2 className="text-base font-semibold text-slate-900">No inventory batches found</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Received batches will appear here when they are added to inventory.
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left text-sm">
            <caption className="sr-only">Inventory batches, associated ingredients, quantities, and expiry status</caption>
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th scope="col" className="px-5 py-3.5">Batch</th>
                <th scope="col" className="px-5 py-3.5">Ingredient</th>
                <th scope="col" className="px-5 py-3.5">Status</th>
                <th scope="col" className="px-5 py-3.5">Received</th>
                <th scope="col" className="px-5 py-3.5">Expires</th>
                <th scope="col" className="px-5 py-3.5 text-right">Remaining</th>
                <th scope="col" className="px-5 py-3.5">Supplier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {batches.map((batch) => {
                const ingredient = ingredientNames.get(batch.ingredient_id)
                return (
                  <tr key={batch.id} className="transition-colors hover:bg-slate-50">
                    <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-900">{batch.batch_number}</td>
                    <td className="whitespace-nowrap px-5 py-4">
                      {ingredient?.name ?? `Ingredient #${batch.ingredient_id}`}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4"><BatchStatusBadge batch={batch} /></td>
                    <td className="whitespace-nowrap px-5 py-4">{formatDate(batch.received_date)}</td>
                    <td className="whitespace-nowrap px-5 py-4">{formatDate(batch.expiry_date)}</td>
                    <td className="whitespace-nowrap px-5 py-4 text-right tabular-nums">
                      {batch.quantity}{ingredient ? ` ${ingredient.unit}` : ''}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">{batch.supplier}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default InventoryBatchesTable
