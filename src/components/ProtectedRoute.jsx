/**
 * src/components/ProtectedRoute.jsx
 * ─────────────────────────────────────────────────────────────
 * Route guard using Clerk's useAuth() hook.
 * Premium loading screen with animated Aero-Sea Nexus logo,
 * progress stages, and particle effects.
 */
import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { Navigate } from 'react-router-dom'

const C = {
  bg:'#020C18', surface:'#060F1E', cyan:'#00C8FF', purple:'#A855F7',
  green:'#00FF85', textSecondary:'#3C6882', textMuted:'#1A3550',
}

const STAGES = [
  'Authenticating identity…',
  'Establishing secure connection…',
  'Loading intelligence feeds…',
  'Initializing AI agents…',
  'Preparing quantum navigation…',
  'Platform ready.',
]

function NexusLoader() {
  const [stage, setStage] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) return 100
        return p + Math.random() * 15 + 5
      })
    }, 300)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const stageInterval = setInterval(() => {
      setStage(s => Math.min(s + 1, STAGES.length - 1))
    }, 600)
    return () => clearInterval(stageInterval)
  }, [])

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', height: '100vh', background: C.bg,
      gap: 24, position: 'relative', overflow: 'hidden',
    }}>
      {/* Animated background particles */}
      <style>{`
        @keyframes loaderParticle {
          0%, 100% { transform: translate(0, 0); opacity: 0; }
          10% { opacity: 0.5; }
          90% { opacity: 0.3; }
        }
        @keyframes loaderRing {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes loaderPulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.3); opacity: 0.6; }
        }
        @keyframes loaderFadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes progressGlow {
          0%, 100% { box-shadow: 0 0 5px rgba(0,200,255,0.3); }
          50% { box-shadow: 0 0 20px rgba(0,200,255,0.5); }
        }
      `}</style>

      {/* Particle field */}
      {Array.from({length: 20}, (_, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: 2 + Math.random() * 3,
          height: 2 + Math.random() * 3,
          borderRadius: '50%',
          background: `rgba(0,200,255,${0.1 + Math.random() * 0.3})`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animation: `loaderParticle ${3 + Math.random() * 4}s ease-in-out ${Math.random() * 3}s infinite`,
        }}/>
      ))}

      {/* Animated logo */}
      <div style={{ position: 'relative', width: 80, height: 80 }}>
        {/* Outer ring */}
        <svg width="80" height="80" viewBox="0 0 80 80" style={{ position: 'absolute', animation: 'loaderRing 3s linear infinite' }}>
          <circle cx="40" cy="40" r="35" fill="none" stroke="rgba(0,200,255,0.15)" strokeWidth="1" />
          <circle cx="40" cy="40" r="35" fill="none" stroke={C.cyan} strokeWidth="1.5"
            strokeDasharray="40 180" strokeLinecap="round" />
        </svg>
        {/* Middle ring */}
        <svg width="80" height="80" viewBox="0 0 80 80" style={{ position: 'absolute', animation: 'loaderRing 2s linear infinite reverse' }}>
          <circle cx="40" cy="40" r="26" fill="none" stroke={C.purple} strokeWidth="1"
            strokeDasharray="20 144" strokeLinecap="round" opacity="0.6" />
        </svg>
        {/* Inner ring */}
        <svg width="80" height="80" viewBox="0 0 80 80" style={{ position: 'absolute', animation: 'loaderRing 1.5s linear infinite' }}>
          <circle cx="40" cy="40" r="17" fill="none" stroke={C.green} strokeWidth="0.8"
            strokeDasharray="12 95" strokeLinecap="round" opacity="0.5" />
        </svg>
        {/* Center dot */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 10, height: 10, borderRadius: '50%',
          background: C.cyan,
          animation: 'loaderPulse 1.5s ease-in-out infinite',
          boxShadow: '0 0 20px rgba(0,200,255,0.4)',
        }}/>
      </div>

      {/* Logo text */}
      <div style={{ textAlign: 'center', animation: 'loaderFadeUp 0.5s ease-out' }}>
        <div style={{
          fontFamily: "'Orbitron', 'Rajdhani', sans-serif",
          fontWeight: 700, fontSize: 22,
          background: 'linear-gradient(135deg, #00C8FF, #A855F7)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          letterSpacing: '0.15em',
        }}>
          AERO-SEA NEXUS
        </div>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 9, color: C.textMuted,
          letterSpacing: '0.2em', textTransform: 'uppercase',
          marginTop: 4,
        }}>
          GLOBAL INTELLIGENCE PLATFORM
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ width: 240 }}>
        <div style={{
          height: 2, background: 'rgba(0,200,255,0.1)',
          borderRadius: 2, overflow: 'hidden', marginBottom: 8,
        }}>
          <div style={{
            height: '100%',
            background: `linear-gradient(90deg, ${C.cyan}, ${C.purple})`,
            borderRadius: 2,
            width: `${Math.min(progress, 100)}%`,
            transition: 'width 0.3s ease',
            animation: 'progressGlow 1.5s ease-in-out infinite',
          }}/>
        </div>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10, color: C.textSecondary,
          textAlign: 'center',
          letterSpacing: '0.06em',
          minHeight: 16,
        }}>
          {STAGES[stage]}
        </div>
      </div>

      {/* Version */}
      <div style={{
        position: 'absolute', bottom: 24,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 9, color: C.textMuted,
        letterSpacing: '0.1em',
      }}>
        v4.0.0 · INITIALIZING…
      </div>
    </div>
  )
}

export default function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) return <NexusLoader />
  if (!isSignedIn) return <Navigate to="/login" replace />

  return children
}
