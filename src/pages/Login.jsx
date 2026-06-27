/**
 * src/pages/Login.jsx
 * ─────────────────────────────────────────────────────────────
 * Premium login page with animated particle background,
 * platform highlights, and Clerk SignIn integration.
 */
import { SignIn } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'
import { Globe, Cpu, Eye, Bot, Anchor, Shield, Zap } from 'lucide-react'

const C = {
  bg:'#020C18', surface:'#060F1E', card:'#091828', elevated:'#0C2038',
  border:'rgba(0,190,255,0.12)', borderHi:'rgba(0,205,255,0.35)',
  cyan:'#00C8FF', orange:'#FF7A2E', green:'#00FF85',
  yellow:'#FFD600', red:'#FF4566', purple:'#A855F7',
  textPrimary:'#C8E4F4', textSecondary:'#3C6882', textMuted:'#1A3550',
}
const raj  = { fontFamily: "'Rajdhani',sans-serif" }
const mono = { fontFamily: "'JetBrains Mono',monospace" }

const darkCyberpunk = {
  variables: {
    colorBackground: '#060F1E',
    colorPrimary: '#00C8FF',
    colorText: '#C8E4F4',
    colorTextSecondary: '#3C6882',
    colorInputBackground: '#091828',
    colorInputText: '#C8E4F4',
    colorDanger: '#FF4566',
    colorSuccess: '#00FF85',
    borderRadius: '8px',
    fontFamily: "'Rajdhani', sans-serif",
    fontFamilyButtons: "'Rajdhani', sans-serif",
  },
  elements: {
    card: {
      background: '#060F1E',
      border: '1px solid rgba(0,190,255,0.2)',
      boxShadow: '0 24px 80px rgba(0,0,0,0.85), 0 0 60px rgba(0,200,255,0.04)',
      backdropFilter: 'blur(12px)',
    },
    headerTitle: { color: '#00C8FF', fontWeight: 700, letterSpacing: '0.06em' },
    headerSubtitle: { color: '#3C6882' },
    formButtonPrimary: {
      background: 'linear-gradient(135deg, rgba(0,200,255,0.15), rgba(168,85,247,0.1))',
      border: '1px solid rgba(0,200,255,0.4)',
      color: '#00C8FF',
      fontWeight: 700,
      letterSpacing: '0.06em',
      transition: 'all 0.2s',
    },
    formFieldInput: {
      background: '#091828',
      border: '1px solid rgba(0,190,255,0.2)',
      color: '#C8E4F4',
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '13px',
    },
    formFieldLabel: { color: '#3C6882', fontSize: '11px' },
    footerActionLink: { color: '#00C8FF' },
    footerActionText: { color: '#3C6882' },
    dividerLine: { background: 'rgba(0,190,255,0.12)' },
    dividerText: { color: '#3C6882' },
    socialButtonsBlockButton: {
      background: 'rgba(0,200,255,0.04)',
      border: '1px solid rgba(0,190,255,0.2)',
      color: '#C8E4F4',
    },
    alert: { background: 'rgba(255,69,102,0.08)', borderColor: 'rgba(255,69,102,0.3)' },
    alertText: { color: '#FF4566' },
    badge: { background: 'rgba(0,200,255,0.1)', color: '#00C8FF' },
  },
}

const FEATURES = [
  { icon: Globe, label: 'Quantum Navigation', desc: 'GPS-independent, sub-8cm accuracy', color: C.cyan },
  { icon: Cpu,   label: 'Swarm Optimization', desc: '1M routes optimized simultaneously', color: C.green },
  { icon: Eye,   label: 'Eagle Eye Detection', desc: 'LiDAR + bioluminescence radar',     color: C.orange },
  { icon: Bot,   label: 'AI Agent',            desc: 'Groq-powered real-time intelligence', color: C.purple },
]

export default function Login() {
  return (
    <div style={{
      display: 'flex', minHeight: '100vh', background: C.bg,
      backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,200,255,0.008) 3px,rgba(0,200,255,0.008) 4px)',
      ...raj,
    }}>
      <style>{`
        @keyframes loginParticle {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0; }
          10% { opacity: 0.4; }
          50% { transform: translate(${Math.random()*20-10}px, -30px) scale(1.2); opacity: 0.6; }
          90% { opacity: 0.2; }
        }
        @keyframes loginFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes loginGlow {
          0%, 100% { box-shadow: 0 0 30px rgba(0,200,255,0.1); }
          50% { box-shadow: 0 0 60px rgba(0,200,255,0.2), 0 0 120px rgba(0,200,255,0.05); }
        }
        @keyframes loginFadeUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Floating particles */}
      {Array.from({length: 25}, (_, i) => (
        <div key={i} style={{
          position: 'fixed',
          width: 2 + Math.random() * 4,
          height: 2 + Math.random() * 4,
          borderRadius: '50%',
          background: i % 3 === 0 ? 'rgba(168,85,247,0.3)' : 'rgba(0,200,255,0.25)',
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animation: `loginParticle ${4 + Math.random() * 6}s ease-in-out ${Math.random() * 5}s infinite`,
          pointerEvents: 'none',
        }}/>
      ))}

      {/* Left panel — Features showcase */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '40px 60px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Large glow orb */}
        <div style={{
          position: 'absolute', top: '30%', left: '20%',
          width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,200,255,0.06) 0%, transparent 70%)',
          animation: 'loginGlow 4s ease-in-out infinite',
          pointerEvents: 'none',
        }}/>

        {/* Logo */}
        <div style={{ marginBottom: 48, animation: 'loginFadeUp 0.6s ease-out', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 8,
              background: 'rgba(0,200,255,0.08)',
              border: `1px solid ${C.borderHi}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Anchor size={20} color={C.cyan}/>
            </div>
            <div>
              <div style={{
                fontFamily: "'Orbitron', 'Rajdhani', sans-serif",
                fontWeight: 700, fontSize: 28,
                background: 'linear-gradient(135deg, #00C8FF, #A855F7)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                letterSpacing: '0.1em',
              }}>
                AERO-SEA NEXUS
              </div>
              <div style={{ ...mono, fontSize: 10, color: C.textMuted, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                GLOBAL INTELLIGENCE PLATFORM
              </div>
            </div>
          </div>
        </div>

        {/* Feature highlights */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 400, position: 'relative' }}>
          {FEATURES.map((f, i) => (
            <div key={f.label} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 18px', borderRadius: 8,
              background: 'rgba(9,24,40,0.5)',
              backdropFilter: 'blur(8px)',
              border: `1px solid ${C.border}`,
              animation: `loginFadeUp 0.5s ease-out ${0.2 + i * 0.1}s both`,
              transition: 'all 0.25s',
              cursor: 'default',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = f.color + '55'; e.currentTarget.style.background = 'rgba(9,24,40,0.8)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = 'rgba(9,24,40,0.5)'; }}
            >
              <div style={{
                width: 38, height: 38, borderRadius: 8,
                background: `${f.color}12`,
                border: `1px solid ${f.color}33`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <f.icon size={18} color={f.color}/>
              </div>
              <div>
                <div style={{ ...raj, fontWeight: 700, fontSize: 14, color: C.textPrimary }}>{f.label}</div>
                <div style={{ ...mono, fontSize: 10, color: C.textSecondary }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom badges */}
        <div style={{
          marginTop: 40, display: 'flex', gap: 12, flexWrap: 'wrap',
          animation: 'loginFadeUp 0.5s ease-out 0.7s both',
        }}>
          {[
            { icon: Shield, label: 'Enterprise Security', color: C.green },
            { icon: Zap, label: 'Powered by Groq AI', color: C.cyan },
          ].map(b => (
            <div key={b.label} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              ...mono, fontSize: 9, color: b.color,
              background: `${b.color}0A`, border: `1px solid ${b.color}22`,
              padding: '5px 12px', borderRadius: 4,
            }}>
              <b.icon size={11} color={b.color}/> {b.label}
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — Clerk Sign In */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 60px',
        borderLeft: `1px solid ${C.border}`,
        background: 'rgba(6,15,30,0.5)',
        backdropFilter: 'blur(12px)',
        animation: 'loginFadeUp 0.4s ease-out',
      }}>
        <SignIn
          routing="path"
          path="/login"
          signUpUrl="/signup"
          afterSignInUrl="/dashboard"
          appearance={darkCyberpunk}
        />
      </div>
    </div>
  )
}
