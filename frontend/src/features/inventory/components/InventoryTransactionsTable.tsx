import type { Ingredient } from '../../ingredients/types'
import type { InventoryBatch, InventoryTransaction } from '../types'

type InventoryTransactionsTableProps = {
  transactions: InventoryTransaction[]
  batches: InventoryBatch[]
  ingredients: Ingredient[]
}

const InventoryTransactionsTable = ({
  transactions,
  batches,
  ingredients,
}: InventoryTransactionsTableProps) => {
  const batchById = new Map(batches.map((batch) => [batch.id, batch]))
  const ingredientById = new Map(ingredients.map((ingredient) => [ingredient.id, ingredient]))

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      {transactions.length === 0 ? (
        <div className="flex min-h-64 items-center justify-center px-6 py-12 text-center">
          <div className="max-w-sm">
            <h2 className="text-base font-semibold text-slate-900">No inventory transactions found</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">Stock movements will appear here as they are recorded.</p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] border-collapse text-left text-sm">
            <caption className="sr-only">Read-only inventory transaction history</caption>
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th scope="col" className="px-5 py-3.5">Recorded</th>
                <th scope="col" className="px-5 py-3.5">Type</th>
                <th scope="col" className="px-5 py-3.5">Ingredient</th>
                <th scope="col" className="px-5 py-3.5">Batch</th>
                <th scope="col" className="px-5 py-3.5 text-right">Quantity</th>
                <th scope="col" className="px-5 py-3.5">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {transactions.map((transaction) => {
                const batch = batchById.get(transaction.inventory_batch_id)
                const ingredient = batch ? ingredientById.get(batch.ingredient_id) : undefined
                const typeLabel = transaction.transaction_type.toLowerCase().replace('_', ' ')
                return (
                  <tr key={transaction.id} className="transition-colors hover:bg-slate-50">
                    <td className="whitespace-nowrap px-5 py-4">{new Date(transaction.created_at).toLocaleString()}</td>
                    <td className="whitespace-nowrap px-5 py-4 capitalize">{typeLabel}</td>
                    <td className="whitespace-nowrap px-5 py-4">{ingredient?.name ?? (batch ? `Ingredient #${batch.ingredient_id}` : `Batch #${transaction.inventory_batch_id}`)}</td>
                    <td className="whitespace-nowrap px-5 py-4">{batch?.batch_number ?? `Batch #${transaction.inventory_batch_id}`}</td>
                    <td className="whitespace-nowrap px-5 py-4 text-right tabular-nums">{transaction.quantity}{ingredient ? ` ${ingredient.unit}` : ''}</td>
                    <td className="max-w-xs px-5 py-4">{transaction.notes || '—'}</td>
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

export default InventoryTransactionsTable
