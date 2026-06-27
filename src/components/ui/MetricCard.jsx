import React, { useEffect, useState, useRef } from 'react';

const C = {
  bg:'#020C18', surface:'#060F1E', card:'#091828', elevated:'#0C2038',
  border:'rgba(0,190,255,0.12)', borderHi:'rgba(0,205,255,0.35)',
  cyan:'#00C8FF', orange:'#FF7A2E', green:'#00FF85',
  yellow:'#FFD600', red:'#FF4566', purple:'#A855F7',
  textPrimary:'#C8E4F4', textSecondary:'#3C6882', textMuted:'#1A3550'
};
const raj = { fontFamily: "'Rajdhani',sans-serif" };
const mono = { fontFamily: "'JetBrains Mono',monospace" };

export default function MetricCard({ label, value, change, unit, icon: Icon, accentColor = C.cyan, sparklineData = [] }) {
  const [displayValue, setDisplayValue] = useState(0);
  const isPositive = change >= 0;

  const valStr = String(value);
  const prefix = valStr.match(/^[^0-9\.\-]+/) ? valStr.match(/^[^0-9\.\-]+/)[0] : '';
  let suffix = valStr.match(/[^0-9\.\-]+$/) ? valStr.match(/[^0-9\.\-]+$/)[0] : '';
  if (suffix === 'K' || suffix === 'M') {
      // keep it
  } else {
      suffix = ''; // fallback
  }
  const numeric = parseFloat(valStr.replace(/[^0-9\.\-]/g, '')) || 0;

  useEffect(() => {
    let startTime = null;
    const duration = 1000;
    const target = numeric;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // easeOutQuad
      const easeOut = progress * (2 - progress);
      setDisplayValue(target * easeOut);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(target);
      }
    };

    requestAnimationFrame(animate);
  }, [numeric]);

  return (
    <div className="card-hover glass" style={{
      padding: '16px',
      borderRadius: '8px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div style={{ ...mono, fontSize: '11px', color: C.textSecondary, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          {label}
        </div>
        {Icon && (
          <div style={{
            width: '28px', height: '28px', borderRadius: '6px',
            background: `${accentColor}15`, display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Icon size={14} color={accentColor} />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '16px' }}>
        <div style={{ ...raj, fontSize: '28px', fontWeight: 700, color: C.textPrimary }}>
          {prefix}{displayValue.toLocaleString(undefined, { maximumFractionDigits: 1 })}{suffix}
        </div>
        {unit && <div style={{ ...mono, fontSize: '12px', color: C.textSecondary }}>{unit}</div>}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '4px',
          ...mono, fontSize: '11px', color: isPositive ? C.green : C.red,
          background: `${isPositive ? C.green : C.red}10`,
          padding: '2px 6px', borderRadius: '4px'
        }}>
          <span>{isPositive ? '↑' : '↓'}</span>
          {Math.abs(change)}%
        </div>

        {sparklineData.length > 0 && (
          <svg width="60" height="20" viewBox="0 0 60 20" style={{ overflow: 'visible' }}>
            <polyline
              fill="none"
              stroke={accentColor}
              strokeWidth="1.5"
              points={sparklineData.map((d, i) => `${(i / (sparklineData.length - 1)) * 60},${20 - (d / Math.max(...sparklineData)) * 20}`).join(' ')}
              style={{ filter: `drop-shadow(0 2px 4px ${accentColor}40)` }}
            />
          </svg>
        )}
      </div>
    </div>
  );
}
