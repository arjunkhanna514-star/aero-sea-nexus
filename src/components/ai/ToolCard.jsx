import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Zap } from 'lucide-react';

const C = {
  bg:'#020C18', surface:'#060F1E', card:'#091828', elevated:'#0C2038',
  border:'rgba(0,190,255,0.12)', borderHi:'rgba(0,205,255,0.35)',
  cyan:'#00C8FF', orange:'#FF7A2E', green:'#00FF85',
  yellow:'#FFD600', red:'#FF4566', purple:'#A855F7',
  textPrimary:'#C8E4F4', textSecondary:'#3C6882', textMuted:'#1A3550'
};
const raj = { fontFamily: "'Rajdhani',sans-serif" };
const mono = { fontFamily: "'JetBrains Mono',monospace" };

export default function ToolCard({ toolName, params, result, loading }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{
      margin: '8px 0',
      borderRadius: '8px',
      border: `1px solid ${C.purple}40`,
      background: 'rgba(168,85,247,0.05)',
      overflow: 'hidden'
    }}>
      <div 
        onClick={() => !loading && setExpanded(!expanded)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 14px', cursor: loading ? 'default' : 'pointer',
          borderBottom: expanded ? `1px solid ${C.purple}20` : 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={14} color={C.purple} />
          <div style={{ ...mono, fontSize: '11px', color: C.purple, fontWeight: 600 }}>
            {toolName} {params && <span style={{ color: C.textSecondary, fontWeight: 400 }}>{params}</span>}
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {loading ? (
            <div style={{ display: 'flex', gap: '4px' }}>
              <span className="typing-dot" style={{ background: C.purple }}></span>
              <span className="typing-dot" style={{ background: C.purple, animationDelay: '0.2s' }}></span>
              <span className="typing-dot" style={{ background: C.purple, animationDelay: '0.4s' }}></span>
            </div>
          ) : (
            expanded ? <ChevronUp size={14} color={C.textMuted} /> : <ChevronDown size={14} color={C.textMuted} />
          )}
        </div>
      </div>

      {expanded && !loading && (
        <div style={{ padding: '12px 14px', ...mono, fontSize: '11px', color: C.textSecondary, whiteSpace: 'pre-wrap' }}>
          {result}
        </div>
      )}
    </div>
  );
}
