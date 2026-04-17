/**
 * src/components/ProtectedRoute.jsx
 * ─────────────────────────────────────────────────────────────
 * Route guard using Clerk's useAuth() hook.
 * - While Clerk SDK is initializing (isLoaded=false) → show loading screen
 * - If user is not signed in → redirect to /login
 * - Otherwise → render children
 */
import { useAuth } from '@clerk/clerk-react'
import { Navigate } from 'react-router-dom'

// Minimal dark loading screen that matches the app aesthetic
function NexusLoader() {
  return (
    <div style={{
      display:         'flex',
      flexDirection:   'column',
      alignItems:      'center',
      justifyContent:  'center',
      height:          '100vh',
      background:      '#020C18',
      gap:             16,
    }}>
      {/* Pulsing logo mark */}
      <svg width="40" height="40" viewBox="0 0 40 40">
        <circle
          cx="20" cy="20" r="16"
          fill="none"
          stroke="rgba(0,200,255,0.25)"
          strokeWidth="1"
        />
        <circle
          cx="20" cy="20" r="10"
          fill="none"
          stroke="#00C8FF"
          strokeWidth="1.5"
          strokeDasharray="20 44"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 20 20"
            to="360 20 20"
            dur="1.4s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="20" cy="20" r="3" fill="#00C8FF" />
      </svg>

      <div style={{
        fontFamily:    "'JetBrains Mono', monospace",
        fontSize:      11,
        color:         '#3C6882',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
      }}>
        INITIALIZING NEXUS PLATFORM…
      </div>
    </div>
  )
}

export default function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useAuth()

  // Clerk SDK still bootstrapping — show loader, not login redirect
  if (!isLoaded) return <NexusLoader />

  // Not authenticated — hard redirect to login
  if (!isSignedIn) return <Navigate to="/login" replace />

  // Authenticated — render the protected content
  return children
}
