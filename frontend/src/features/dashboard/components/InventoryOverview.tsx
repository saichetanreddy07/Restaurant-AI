import type { InventoryOverviewData } from '../types/dashboard'

interface InventoryOverviewProps {
  data: InventoryOverviewData
}

const createDoughnutBackground = (data: InventoryOverviewData) => {
  let currentPercentage = 0

  const colorStops = data.categories.map((category) => {
    const startPercentage = currentPercentage
    currentPercentage += category.percentage

    return `${category.color} ${startPercentage}% ${currentPercentage}%`
  })

  return `conic-gradient(${colorStops.join(', ')})`
}

export const InventoryOverview = ({ data }: InventoryOverviewProps) => {
  const doughnutBackground = createDoughnutBackground(data)

  return (
    <section
      aria-labelledby="inventory-overview-title"
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md"
    >
      <div>
        <h2
          id="inventory-overview-title"
          className="text-base font-semibold text-slate-900"
        >
          Inventory Overview
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Ingredient distribution by category
        </p>
      </div>

      <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:items-center">
        <div
          aria-label={`Inventory category distribution for ${data.totalIngredients} ingredients`}
          className="relative flex size-44 shrink-0 items-center justify-center rounded-full"
          role="img"
          style={{ background: doughnutBackground }}
        >
          <div className="flex size-28 flex-col items-center justify-center rounded-full bg-white">
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              {data.totalIngredients}
            </span>
            <span className="text-xs font-medium text-slate-500">Ingredients</span>
          </div>
        </div>

        <ul className="grid w-full gap-3 sm:grid-cols-2">
          {data.categories.map((category) => (
            <li key={category.id} className="flex items-center justify-between gap-3 text-sm">
              <span className="flex items-center gap-2 text-slate-600">
                <span
                  aria-hidden="true"
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                {category.name}
              </span>
              <span className="font-semibold text-slate-900">
                {category.percentage}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default InventoryOverview
