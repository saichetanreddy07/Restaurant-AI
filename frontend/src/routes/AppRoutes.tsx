import { Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from '../layouts/MainLayout'
import { PlaceholderPage } from '../pages/PlaceholderPage'

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route
          path="/"
          element={
            <PlaceholderPage
              title="Operations Dashboard"
              description="System overview, live operational metrics, and stock alerts."
            />
          }
        />
        <Route
          path="/ingredients"
          element={
            <PlaceholderPage
              title="Ingredients"
              description="Manage raw materials, measurement units, reorder points, and costs."
            />
          }
        />
        <Route
          path="/menu"
          element={
            <PlaceholderPage
              title="Menu Items"
              description="Configure commercial menu items, categories, and selling prices."
            />
          }
        />
        <Route
          path="/recipes"
          element={
            <PlaceholderPage
              title="Recipes"
              description="Formulate kitchen recipes and associate ingredient requirements."
            />
          }
        />
        <Route
          path="/inventory"
          element={
            <PlaceholderPage
              title="Inventory Lots & Transactions"
              description="Track intake batches, expiration dates, and immutable transaction logs."
            />
          }
        />
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
