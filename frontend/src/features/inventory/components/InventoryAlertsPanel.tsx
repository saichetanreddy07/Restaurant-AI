import type { ExpiredBatch, ExpiringBatch, LowStockIngredient } from '../types'

type InventoryAlertsPanelProps = {
  lowStock: LowStockIngredient[]
  expiring: ExpiringBatch[]
  expired: ExpiredBatch[]
}

const InventoryAlertsPanel = ({ lowStock, expiring, expired }: InventoryAlertsPanelProps) => (
  <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
    <section aria-labelledby="low-stock-title" className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-4 py-3">
        <h2 id="low-stock-title" className="text-sm font-semibold text-slate-900">Low Stock</h2>
      </div>
      {lowStock.length === 0 ? <p className="p-4 text-sm text-slate-500">No ingredients are at or below their minimum stock.</p> : (
        <ul className="divide-y divide-slate-100">
          {lowStock.map((item) => (
            <li key={item.ingredient_id} className="flex items-start justify-between gap-3 px-4 py-3">
              <span className="text-sm font-medium text-slate-800">{item.ingredient_name}</span>
              <span className="shrink-0 text-right text-xs text-slate-600">{item.current_stock} / {item.minimum_stock_level} {item.unit}</span>
            </li>
          ))}
        </ul>
      )}
    </section>

    <section aria-labelledby="expiring-title" className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-4 py-3">
        <h2 id="expiring-title" className="text-sm font-semibold text-slate-900">Expiring Soon <span className="font-normal text-slate-500">(next 7 days)</span></h2>
      </div>
      {expiring.length === 0 ? <p className="p-4 text-sm text-slate-500">No batches are expiring in the next 7 days.</p> : (
        <ul className="divide-y divide-slate-100">
          {expiring.map((batch) => (
            <li key={batch.batch_number} className="flex items-start justify-between gap-3 px-4 py-3">
              <span className="min-w-0 text-sm font-medium text-slate-800">{batch.ingredient_name}<span className="mt-0.5 block truncate text-xs font-normal text-slate-500">{batch.batch_number}</span></span>
              <span className="shrink-0 text-right text-xs text-amber-700">{batch.days_until_expiry === 0 ? 'Today' : `${batch.days_until_expiry} days`}</span>
            </li>
          ))}
        </ul>
      )}
    </section>

    <section aria-labelledby="expired-title" className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-4 py-3">
        <h2 id="expired-title" className="text-sm font-semibold text-slate-900">Expired Stock</h2>
      </div>
      {expired.length === 0 ? <p className="p-4 text-sm text-slate-500">No expired batches have remaining stock.</p> : (
        <ul className="divide-y divide-slate-100">
          {expired.map((batch) => (
            <li key={batch.batch_number} className="flex items-start justify-between gap-3 px-4 py-3">
              <span className="min-w-0 text-sm font-medium text-slate-800">{batch.ingredient_name}<span className="mt-0.5 block truncate text-xs font-normal text-slate-500">{batch.batch_number} · expired {new Date(`${batch.expiry_date}T00:00:00`).toLocaleDateString()}</span></span>
              <span className="shrink-0 text-right text-xs text-red-700">{batch.quantity_remaining}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  </div>
)

export default InventoryAlertsPanel
