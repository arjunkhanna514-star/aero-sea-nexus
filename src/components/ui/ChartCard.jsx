import React from 'react';

const C = {
  bg:'#020C18', surface:'#060F1E', card:'#091828', elevated:'#0C2038',
  border:'rgba(0,190,255,0.12)', borderHi:'rgba(0,205,255,0.35)',
  cyan:'#00C8FF', orange:'#FF7A2E', green:'#00FF85',
  yellow:'#FFD600', red:'#FF4566', purple:'#A855F7',
  textPrimary:'#C8E4F4', textSecondary:'#3C6882', textMuted:'#1A3550'
};
const raj = { fontFamily: "'Rajdhani',sans-serif" };
const mono = { fontFamily: "'JetBrains Mono',monospace" };

export default function ChartCard({ title, subtitle, children, loading, timeRanges = ['1H', '24H', '7D', '30D'], activeRange, onRangeChange }) {
  return (
    <div className="glass-elevated" style={{
      borderRadius: '8px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      position: 'relative'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <h3 style={{ ...raj, fontSize: '18px', fontWeight: 600, color: C.textPrimary, margin: 0 }}>{title}</h3>
          {subtitle && <p style={{ ...mono, fontSize: '11px', color: C.textSecondary, marginTop: '4px' }}>{subtitle}</p>}
        </div>
        
        {timeRanges.length > 0 && (
          <div style={{ display: 'flex', gap: '4px', background: 'rgba(0,0,0,0.2)', padding: '2px', borderRadius: '6px' }}>
            {timeRanges.map(range => (
              <button
                key={range}
                onClick={() => onRangeChange && onRangeChange(range)}
                className="tab-btn"
                style={{
                  background: activeRange === range ? 'rgba(0,200,255,0.15)' : 'transparent',
                  color: activeRange === range ? C.cyan : C.textSecondary,
                }}
              >
                {range}
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={{ flex: 1, position: 'relative', minHeight: '200px' }}>
        {loading ? (
          <div className="skeleton" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}></div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
