import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { menuCategories, type MenuItem } from '../../menu/types'
import type { AvailabilityResult } from '../types'

type ViewRecipeAvailabilityModalProps = {
  result: AvailabilityResult
  menuItem?: MenuItem
  onClose: () => void
}

const ViewRecipeAvailabilityModal = ({ result, menuItem, onClose }: ViewRecipeAvailabilityModalProps) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLElement>(null)
  const isMenuItemResult = 'menu_item_name' in result
  const dishName = isMenuItemResult ? result.menu_item_name : result.recipe_name
  const recipeName = result.recipe_name
  const limitingIngredients = result.ingredients.filter(
    (ingredient) => ingredient.maximum_servings === result.maximum_servings,
  )
  const shortageIngredients = result.ingredients.filter((ingredient) => ingredient.has_shortage)
  const categoryLabel = menuCategories.find((category) => category.value === menuItem?.category)?.label ?? menuItem?.category ?? 'Not available'

  useEffect(() => {
    const previouslyFocusedElement = document.activeElement
    closeButtonRef.current?.focus()
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key !== 'Tab') return

      const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      if (!focusableElements?.length) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      if (previouslyFocusedElement instanceof HTMLElement) previouslyFocusedElement.focus()
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/40 px-4 py-6" role="presentation">
      <section ref={dialogRef} aria-labelledby="recipe-availability-title" aria-modal="true" role="dialog" className="my-auto max-h-[calc(100vh-3rem)] w-full max-w-3xl overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 id="recipe-availability-title" className="text-lg font-semibold text-slate-900">Availability Details</h2>
            <p className="mt-1 text-sm text-slate-500">{dishName}</p>
          </div>
          <button type="button" aria-label="Close availability details" ref={closeButtonRef} onClick={onClose} className="inline-flex size-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600">
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>

        <div className="space-y-6 px-5 py-6">
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <dt className="text-sm font-medium text-slate-500">Menu Item</dt>
              <dd className="mt-1 text-sm text-slate-900">{menuItem?.name ?? `Menu item #${result.menu_item_id}`}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">{isMenuItemResult ? 'Recipe' : 'Type'}</dt>
              <dd className="mt-1 text-sm text-slate-900">{isMenuItemResult ? recipeName ?? 'No recipe configured' : categoryLabel}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">Current Capacity</dt>
              <dd className="mt-1 text-sm font-semibold text-slate-900">{result.maximum_servings} servings</dd>
            </div>
          </dl>

          {(limitingIngredients.length > 0 || shortageIngredients.length > 0) && (
            <section aria-labelledby="availability-limit-title" className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <h3 id="availability-limit-title" className="text-sm font-semibold text-amber-900">
                {result.available ? 'Capacity limiting ingredients' : 'Ingredient shortage details'}
              </h3>
              {limitingIngredients.length > 0 && (
                <p className="mt-1 text-sm text-amber-800">
                  {limitingIngredients.map((ingredient) => ingredient.ingredient_name).join(', ')}
                  {limitingIngredients.length === 1 ? ' limits' : ' limit'} this dish to {result.maximum_servings} servings.
                </p>
              )}
              {shortageIngredients.length > 0 && (
                <ul className="mt-2 space-y-1 text-sm text-amber-900">
                  {shortageIngredients.map((ingredient) => (
                    <li key={ingredient.ingredient_id}>
                      {ingredient.ingredient_name}: short by {ingredient.shortage_quantity} {ingredient.unit} for one serving.
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          <section aria-labelledby="ingredient-capacity-title">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 id="ingredient-capacity-title" className="text-sm font-semibold text-slate-900">Ingredient requirements and stock</h3>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${result.available ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {result.available ? 'Can be prepared' : 'Unavailable'}
              </span>
            </div>
            {result.ingredients.length === 0 ? (
              <p className="mt-2 text-sm text-slate-500">
                {isMenuItemResult && result.recipe_id === null
                  ? 'This menu item does not have a recipe configured.'
                  : 'No ingredient availability details were returned.'}
              </p>
            ) : (
              <div className="mt-3 overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full min-w-[680px] border-collapse text-left text-sm">
                  <caption className="sr-only">Per-ingredient stock requirements and capacity</caption>
                  <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <tr>
                      <th scope="col" className="px-4 py-3">Ingredient</th>
                      <th scope="col" className="px-4 py-3 text-right">Required per serving</th>
                      <th scope="col" className="px-4 py-3 text-right">Available stock</th>
                      <th scope="col" className="px-4 py-3 text-right">Max servings</th>
                      <th scope="col" className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {result.ingredients.map((ingredient) => (
                      <tr key={ingredient.ingredient_id}>
                        <td className="px-4 py-3 font-medium text-slate-900">{ingredient.ingredient_name}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums">{ingredient.required_quantity} {ingredient.unit}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums">{ingredient.available_stock} {ingredient.unit}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums">{ingredient.maximum_servings}</td>
                        <td className="px-4 py-3">
                          {ingredient.maximum_servings === result.maximum_servings && (
                            <span className="mr-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">Limiting</span>
                          )}
                          {ingredient.has_shortage
                            ? `Short ${ingredient.shortage_quantity} ${ingredient.unit} for one serving`
                            : ingredient.has_sufficient_stock ? 'Sufficient' : 'Not sufficient for one serving'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>

        <div className="flex justify-end border-t border-slate-200 px-5 py-4">
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600">Close</button>
        </div>
      </section>
    </div>
  )
}

export default ViewRecipeAvailabilityModal
