import apiClient from '../../../api/client'
import type {
  DeleteMenuItemResponse,
  MenuItem,
  MenuItemPayload,
  MenuItemUpdatePayload,
} from '../types'

export async function getMenuItems(skip = 0, limit = 100): Promise<MenuItem[]> {
  const response = await apiClient.get<MenuItem[]>('/menu-items/', {
    params: { skip, limit },
  })

  return response.data
}

export async function createMenuItem(
  menuItem: MenuItemPayload,
): Promise<MenuItem> {
  const response = await apiClient.post<MenuItem>('/menu-items/', menuItem)

  return response.data
}

export async function getMenuItem(menuItemId: number): Promise<MenuItem> {
  const response = await apiClient.get<MenuItem>(`/menu-items/${menuItemId}`)

  return response.data
}

export async function updateMenuItem(
  menuItemId: number,
  menuItem: MenuItemUpdatePayload,
): Promise<MenuItem> {
  const response = await apiClient.put<MenuItem>(
    `/menu-items/${menuItemId}`,
    menuItem,
  )

  return response.data
}

export async function deleteMenuItem(
  menuItemId: number,
): Promise<DeleteMenuItemResponse> {
  const response = await apiClient.delete<DeleteMenuItemResponse>(
    `/menu-items/${menuItemId}`,
  )

  return response.data
}
