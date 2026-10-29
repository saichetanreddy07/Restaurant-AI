export type MenuCategory =
  | 'burger'
  | 'pizza'
  | 'pasta'
  | 'sandwich'
  | 'wrap'
  | 'rice'
  | 'salad'
  | 'starter'
  | 'dessert'
  | 'beverage'
  | 'combo'
  | 'other'

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
