/**
 * src/pages/Signup.jsx
 * ─────────────────────────────────────────────────────────────
 * Public sign-up page using Clerk's <SignUp /> component.
 * Identical dark cyberpunk appearance as Login.jsx.
 */
import { SignUp } from '@clerk/clerk-react'

/** Same Clerk appearance config as Login — centralise later into a shared theme file */
const darkCyberpunk = {
  variables: {
    colorBackground:      '#060F1E',
    colorPrimary:         '#00C8FF',
    colorText:            '#C8E4F4',
    colorTextSecondary:   '#3C6882',
    colorInputBackground: '#091828',
    colorInputText:       '#C8E4F4',
    colorDanger:          '#FF4566',
    colorSuccess:         '#00FF85',
    borderRadius:         '6px',
    fontFamily:           "'Rajdhani', sans-serif",
    fontFamilyButtons:    "'Rajdhani', sans-serif",
  },
  elements: {
    card: {
      background:  '#060F1E',
      border:      '1px solid rgba(0,190,255,0.2)',
      boxShadow:   '0 24px 80px rgba(0,0,0,0.85), 0 0 60px rgba(0,200,255,0.04)',
    },
    headerTitle:    { color: '#00C8FF', fontWeight: 700, letterSpacing: '0.06em' },
    headerSubtitle: { color: '#3C6882' },
    formButtonPrimary: {
      background:    'rgba(0,200,255,0.1)',
      border:        '1px solid rgba(0,200,255,0.4)',
      color:         '#00C8FF',
      fontWeight:    700,
      letterSpacing: '0.06em',
    },
    formFieldInput: {
      background:  '#091828',
      border:      '1px solid rgba(0,190,255,0.2)',
      color:       '#C8E4F4',
      fontFamily:  "'JetBrains Mono', monospace",
      fontSize:    '13px',
    },
    formFieldLabel:       { color: '#3C6882', fontSize: '11px' },
    footerActionLink:     { color: '#00C8FF' },
    footerActionText:     { color: '#3C6882' },
    dividerLine:          { background: 'rgba(0,190,255,0.12)' },
    dividerText:          { color: '#3C6882' },
    socialButtonsBlockButton: {
      background: 'rgba(0,200,255,0.04)',
      border:     '1px solid rgba(0,190,255,0.2)',
      color:      '#C8E4F4',
    },
    alert:    { background: 'rgba(255,69,102,0.08)', borderColor: 'rgba(255,69,102,0.3)' },
    alertText: { color: '#FF4566' },
  },
}

export default function Signup() {
  return (
    <div style={{
      display:         'flex',
      alignItems:      'center',
      justifyContent:  'center',
      minHeight:       '100vh',
      background:      '#020C18',
      backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,200,255,0.012) 3px,rgba(0,200,255,0.012) 4px)',
      fontFamily:      "'Rajdhani', sans-serif",
    }}>
      {/* Platform logo */}
      <div style={{ position: 'absolute', top: 28, left: 32 }}>
        <div style={{ fontWeight: 700, fontSize: 20, color: '#00C8FF', letterSpacing: '0.1em' }}>
          AERO-SEA NEXUS
        </div>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: '#3C6882', letterSpacing: '0.15em' }}>
          GLOBAL LOGISTICS INTELLIGENCE PLATFORM
        </div>
      </div>

      <SignUp
        routing="path"
        path="/signup"
        signInUrl="/login"
        afterSignUpUrl="/dashboard"
        appearance={darkCyberpunk}
      />
    </div>
  )
}
