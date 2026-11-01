import { Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from '../layouts/MainLayout'
import { DashboardPage } from '../pages/DashboardPage'
import IngredientsPage from "../features/ingredients/pages/IngredientsPage";
import MenuItemsPage from '../features/menu/pages/MenuItemsPage'
import RecipesPage from '../features/recipes/pages/RecipesPage'
import InventoryPage from '../features/inventory/pages/InventoryPage'
import { PlaceholderPage } from '../pages/PlaceholderPage'

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/ingredients" element={<IngredientsPage />} />
        <Route path="/menu" element={<MenuItemsPage />} />
        <Route path="/recipes" element={<RecipesPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route
          path="/availability"
          element={
            <PlaceholderPage
              title="Dish Availability"
              description="Real-time dish capacity engine and ingredient bottleneck inspection."
            />
          }
        />
        <Route
          path="/settings"
          element={
            <PlaceholderPage
              title="Settings"
              description="Application preferences and environment settings."
            />
          }
        />
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
