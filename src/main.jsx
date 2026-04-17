/**
 * src/main.jsx
 * ─────────────────────────────────────────────────────────────
 * Application entry point.
 * Wraps the entire app in <ClerkProvider> so every child component
 * can access authentication state via Clerk's React hooks.
 */
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.jsx'

// Pulled from .env.local — fails loudly if the key is missing
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error(
    '[Aero-Sea Nexus] Missing VITE_CLERK_PUBLISHABLE_KEY.\n' +
    'Copy .env.local.example → .env.local and add your Clerk key.'
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/*
      ClerkProvider must wrap everything that uses Clerk hooks.
      afterSignOutUrl redirects to the login page on logout.
    */}
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl="/login"
    >
      <App />
    </ClerkProvider>
  </React.StrictMode>,
)
