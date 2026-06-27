/**
 * src/pages/Signup.jsx
 * ─────────────────────────────────────────────────────────────
 * Premium sign-up page with animated background matching Login.
 */
import { SignUp } from '@clerk/clerk-react'
import { Anchor, Sparkles, Users, Database, Globe } from 'lucide-react'

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
    },
    headerTitle: { color: '#00C8FF', fontWeight: 700, letterSpacing: '0.06em' },
    headerSubtitle: { color: '#3C6882' },
    formButtonPrimary: {
      background: 'linear-gradient(135deg, rgba(0,200,255,0.15), rgba(168,85,247,0.1))',
      border: '1px solid rgba(0,200,255,0.4)',
      color: '#00C8FF',
      fontWeight: 700,
      letterSpacing: '0.06em',
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
  },
}

const PERKS = [
  { icon: Globe,    label: '47 Live Feeds', desc: 'Real-time global data streams', color: C.cyan },
  { icon: Database, label: '10,000+ Datasets', desc: 'Maritime & aviation archives', color: C.green },
  { icon: Sparkles, label: 'AI-Powered', desc: 'Groq LLM intelligence engine',     color: C.purple },
  { icon: Users,    label: '127+ Enterprises', desc: 'Trusted by industry leaders',   color: C.orange },
]

export default function Signup() {
  return (
    <div style={{
      display: 'flex', minHeight: '100vh', background: C.bg,
      backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,200,255,0.008) 3px,rgba(0,200,255,0.008) 4px)',
      ...raj,
    }}>
      <style>{`
        @keyframes signupFadeUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes signupGlow {
          0%, 100% { box-shadow: 0 0 40px rgba(168,85,247,0.08); }
          50% { box-shadow: 0 0 80px rgba(168,85,247,0.15), 0 0 120px rgba(0,200,255,0.05); }
        }
      `}</style>

      {/* Floating particles */}
      {Array.from({length: 20}, (_, i) => (
        <div key={i} style={{
          position: 'fixed',
          width: 2 + Math.random() * 3,
          height: 2 + Math.random() * 3,
          borderRadius: '50%',
          background: i % 2 === 0 ? 'rgba(0,200,255,0.2)' : 'rgba(168,85,247,0.25)',
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animation: `signupFadeUp ${5 + Math.random() * 5}s ease-in-out ${Math.random() * 4}s infinite alternate`,
          pointerEvents: 'none',
        }}/>
      ))}

      {/* Left — Clerk Sign Up */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 60px',
        borderRight: `1px solid ${C.border}`,
        background: 'rgba(6,15,30,0.5)',
        backdropFilter: 'blur(12px)',
        animation: 'signupFadeUp 0.4s ease-out',
      }}>
        <SignUp
          routing="path"
          path="/signup"
          signInUrl="/login"
          afterSignUpUrl="/dashboard"
          appearance={darkCyberpunk}
        />
      </div>

      {/* Right — Perks showcase */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '40px 60px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Glow orb */}
        <div style={{
          position: 'absolute', top: '40%', right: '15%',
          width: 350, height: 350, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)',
          animation: 'signupGlow 5s ease-in-out infinite',
          pointerEvents: 'none',
        }}/>

        {/* Logo */}
        <div style={{ marginBottom: 40, animation: 'signupFadeUp 0.5s ease-out 0.1s both', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 8,
              background: 'rgba(168,85,247,0.08)',
              border: '1px solid rgba(168,85,247,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Anchor size={20} color={C.purple}/>
            </div>
            <div>
              <div style={{
                fontFamily: "'Orbitron', 'Rajdhani', sans-serif",
                fontWeight: 700, fontSize: 26,
                background: 'linear-gradient(135deg, #A855F7, #00C8FF)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                letterSpacing: '0.1em',
              }}>
                JOIN THE NEXUS
              </div>
              <div style={{ ...mono, fontSize: 10, color: C.textMuted, letterSpacing: '0.12em' }}>
                CREATE YOUR INTELLIGENCE ACCOUNT
              </div>
            </div>
          </div>

          <p style={{
            ...raj, fontSize: 15, color: C.textSecondary, lineHeight: 1.7,
            maxWidth: 420, marginTop: 8,
          }}>
            Get instant access to the world's most advanced maritime and aviation
            intelligence platform. Start with a free Consumer tier or go Enterprise.
          </p>
        </div>

        {/* Perks grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, maxWidth: 460, position: 'relative' }}>
          {PERKS.map((p, i) => (
            <div key={p.label} style={{
              padding: '16px 18px', borderRadius: 8,
              background: 'rgba(9,24,40,0.5)',
              backdropFilter: 'blur(8px)',
              border: `1px solid ${C.border}`,
              animation: `signupFadeUp 0.5s ease-out ${0.3 + i * 0.1}s both`,
              transition: 'all 0.25s',
              cursor: 'default',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = p.color + '55'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; }}
            >
              <div style={{
                width: 32, height: 32, borderRadius: 6,
                background: `${p.color}12`,
                border: `1px solid ${p.color}25`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 10,
              }}>
                <p.icon size={16} color={p.color}/>
              </div>
              <div style={{ ...raj, fontWeight: 700, fontSize: 14, color: C.textPrimary, marginBottom: 2 }}>{p.label}</div>
              <div style={{ ...mono, fontSize: 10, color: C.textSecondary }}>{p.desc}</div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div style={{
          marginTop: 32, ...mono, fontSize: 10, color: C.textMuted,
          animation: 'signupFadeUp 0.5s ease-out 0.8s both',
        }}>
          Already have an account? <a href="/login" style={{ color: C.cyan, textDecoration: 'none' }}>Sign in →</a>
        </div>
      </div>
    </div>
  )
}
