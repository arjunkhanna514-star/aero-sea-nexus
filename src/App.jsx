/**
 * src/App.jsx
 * ─────────────────────────────────────────────────────────────
 * Pure routing hub. All business logic lives in child components.
 * Uses createBrowserRouter (React Router v6 data router API) for
 * future-proof loader / action support.
 */
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import Landing        from './pages/Landing.jsx'
import Login          from './pages/Login.jsx'
import Signup         from './pages/Signup.jsx'
import Dashboard      from './components/Dashboard.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

const router = createBrowserRouter([
  // Root domain serves the dashboard
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  // /dashboard also serves the dashboard
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  // Landing page moved to explicit route
  {
    path: '/landing',
    element: <Landing />,
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
  // Catch-all — send unknown routes to dashboard
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
