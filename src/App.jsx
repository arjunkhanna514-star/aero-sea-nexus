/**
 * src/App.jsx
 * ─────────────────────────────────────────────────────────────
 * Pure routing hub. All business logic lives in child components.
 * Uses createBrowserRouter (React Router v6 data router API) for
 * future-proof loader / action support.
 */
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import Login          from './pages/Login.jsx'
import Signup         from './pages/Signup.jsx'
import Dashboard      from './components/Dashboard.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

const router = createBrowserRouter([
  // Root → redirect to dashboard (ProtectedRoute will gate it)
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  // Public auth pages
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  // Protected main application
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  // Catch-all — send unknown routes to dashboard (gate handles auth)
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
