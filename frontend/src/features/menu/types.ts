export const menuCategories = [
  { value: 'burger', label: 'Burger' },
  { value: 'pizza', label: 'Pizza' },
  { value: 'pasta', label: 'Pasta' },
  { value: 'sandwich', label: 'Sandwich' },
  { value: 'wrap', label: 'Wrap' },
  { value: 'rice', label: 'Rice' },
  { value: 'salad', label: 'Salad' },
  { value: 'starter', label: 'Starter' },
  { value: 'dessert', label: 'Dessert' },
  { value: 'beverage', label: 'Beverage' },
  { value: 'combo', label: 'Combo' },
  { value: 'other', label: 'Other' },
] as const

export type MenuCategory = (typeof menuCategories)[number]['value']

export type MenuItemPayload = {
  name: string
  category: MenuCategory
  price: number | string
}

export type MenuItemUpdatePayload = Partial<MenuItemPayload>

export type MenuItem = MenuItemPayload & {
  id: number
  created_at: string
  updated_at: string
}

export type DeleteMenuItemResponse = {
  message: string
}
