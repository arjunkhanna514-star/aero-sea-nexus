import React from 'react';

const C = {
  bg:'#020C18', surface:'#060F1E', card:'#091828', elevated:'#0C2038',
  border:'rgba(0,190,255,0.12)', borderHi:'rgba(0,205,255,0.35)',
  cyan:'#00C8FF', orange:'#FF7A2E', green:'#00FF85',
  yellow:'#FFD600', red:'#FF4566', purple:'#A855F7',
  textPrimary:'#C8E4F4', textSecondary:'#3C6882', textMuted:'#1A3550'
};
const mono = { fontFamily: "'JetBrains Mono',monospace" };

export default function StatusBadge({ status, label, size = 'md' }) {
  const styles = {
    live: { color: C.green, bg: `${C.green}15`, border: `${C.green}30`, dotClass: 'live' },
    warning: { color: C.yellow, bg: `${C.yellow}15`, border: `${C.yellow}30`, dotClass: 'warning' },
    error: { color: C.red, bg: `${C.red}15`, border: `${C.red}30`, dotClass: 'error' },
    offline: { color: C.textSecondary, bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)', dotClass: 'offline' },
    connecting: { color: C.orange, bg: `${C.orange}15`, border: `${C.orange}30`, dotClass: 'warning' },
  };

  const currentStyle = styles[status] || styles.offline;
  
  const sizeStyles = {
    sm: { padding: '2px 6px', fontSize: '9px', dotSize: '5px' },
    md: { padding: '4px 10px', fontSize: '11px', dotSize: '7px' },
    lg: { padding: '6px 14px', fontSize: '13px', dotSize: '9px' }
  };
  
  const s = sizeStyles[size] || sizeStyles.md;

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      background: currentStyle.bg,
      border: `1px solid ${currentStyle.border}`,
      borderRadius: '4px',
      padding: s.padding,
      ...mono, fontSize: s.fontSize, color: currentStyle.color,
      textTransform: 'uppercase', letterSpacing: '0.05em'
    }}>
      <span className={`status-dot ${currentStyle.dotClass}`} style={{ width: s.dotSize, height: s.dotSize }}></span>
      {label}
    </div>
  );
}
