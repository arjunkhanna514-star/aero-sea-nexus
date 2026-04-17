/**
 * src/pages/Login.jsx
 * ─────────────────────────────────────────────────────────────
 * Public login page using Clerk's <SignIn /> component.
 * The appearance prop injects custom CSS variables and element
 * overrides to match the dark cyberpunk (#060F1E / #00C8FF) theme.
 */
import { SignIn } from '@clerk/clerk-react'

// Google Fonts import for consistent typography
const fontLink = document.createElement('link')
fontLink.href = 'https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap'
fontLink.rel  = 'stylesheet'
document.head.appendChild(fontLink)

/** Clerk appearance config — maps to their theming API */
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
    // Outer card
    card: {
      background:  '#060F1E',
      border:      '1px solid rgba(0,190,255,0.2)',
      boxShadow:   '0 24px 80px rgba(0,0,0,0.85), 0 0 60px rgba(0,200,255,0.04)',
    },
    // Header
    headerTitle: {
      color:       '#00C8FF',
      fontWeight:  700,
      letterSpacing: '0.06em',
    },
    headerSubtitle: { color: '#3C6882' },
    // Primary action button
    formButtonPrimary: {
      background:    'rgba(0,200,255,0.1)',
      border:        '1px solid rgba(0,200,255,0.4)',
      color:         '#00C8FF',
      fontWeight:    700,
      letterSpacing: '0.06em',
      transition:    'all 0.15s',
    },
    // Form inputs
    formFieldInput: {
      background:   '#091828',
      border:       '1px solid rgba(0,190,255,0.2)',
      color:        '#C8E4F4',
      fontFamily:   "'JetBrains Mono', monospace",
      fontSize:     '13px',
    },
    formFieldLabel: { color: '#3C6882', fontSize: '11px' },
    // Footer links
    footerActionLink:    { color: '#00C8FF' },
    footerActionText:    { color: '#3C6882' },
    // Dividers & social buttons
    dividerLine:    { background: 'rgba(0,190,255,0.12)' },
    dividerText:    { color: '#3C6882' },
    socialButtonsBlockButton: {
      background: 'rgba(0,200,255,0.04)',
      border:     '1px solid rgba(0,190,255,0.2)',
      color:      '#C8E4F4',
    },
    // Alert / error box
    alert:          { background: 'rgba(255,69,102,0.08)', borderColor: 'rgba(255,69,102,0.3)' },
    alertText:      { color: '#FF4566' },
    // Internal badge Clerk renders
    badge:          { background: 'rgba(0,200,255,0.1)', color: '#00C8FF' },
  },
}

export default function Login() {
  return (
    <div style={{
      display:         'flex',
      alignItems:      'center',
      justifyContent:  'center',
      minHeight:       '100vh',
      background:      '#020C18',
      // Subtle scan-line texture
      backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,200,255,0.012) 3px,rgba(0,200,255,0.012) 4px)',
      fontFamily:      "'Rajdhani', sans-serif",
    }}>
      {/* Platform logo — top-left */}
      <div style={{ position: 'absolute', top: 28, left: 32 }}>
        <div style={{ fontWeight: 700, fontSize: 20, color: '#00C8FF', letterSpacing: '0.1em' }}>
          AERO-SEA NEXUS
        </div>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: '#3C6882', letterSpacing: '0.15em' }}>
          GLOBAL LOGISTICS INTELLIGENCE PLATFORM
        </div>
      </div>

      {/* Clerk handles all form logic, validation & OAuth */}
      <SignIn
        routing="path"
        path="/login"
        signUpUrl="/signup"
        afterSignInUrl="/dashboard"
        appearance={darkCyberpunk}
      />
    </div>
  )
}
