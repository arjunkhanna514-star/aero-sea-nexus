import React, { useState, useEffect } from 'react';
import { Search, Bell, Bot, ChevronRight } from 'lucide-react';

const C = {
  bg:'#020C18', surface:'#060F1E', card:'#091828', elevated:'#0C2038',
  border:'rgba(0,190,255,0.12)', borderHi:'rgba(0,205,255,0.35)',
  cyan:'#00C8FF', orange:'#FF7A2E', green:'#00FF85',
  yellow:'#FFD600', red:'#FF4566', purple:'#A855F7',
  textPrimary:'#C8E4F4', textSecondary:'#3C6882', textMuted:'#1A3550'
};
const raj = { fontFamily: "'Rajdhani',sans-serif" };
const mono = { fontFamily: "'JetBrains Mono',monospace" };

export default function TopBar({ currentPage, notificationCount, onToggleAI, onToggleNotifications, onOpenSearch, aiActive }) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const d = new Date();
      setTime(d.toISOString().split('T')[1].split('.')[0] + ' UTC');
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatPageName = (id) => {
    const names = {
      ingestion: 'Data Ingestion',
      simulation: 'Simulation & Analytics',
      operations: 'Auto Operations',
      sales: 'Enterprise Sales',
      consumer: 'Consumer B2C'
    };
    return names[id] || id;
  };

  return (
    <div style={{
      height: '64px',
      borderBottom: `1px solid ${C.border}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      background: 'rgba(2,12,24,0.8)',
      backdropFilter: 'blur(12px)',
      position: 'relative',
      zIndex: 30
    }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ ...raj, fontSize: '16px', color: C.textSecondary, fontWeight: 600 }}>NEXUS</div>
        <ChevronRight size={14} color={C.textMuted} />
        <div style={{ ...raj, fontSize: '16px', color: C.textPrimary, fontWeight: 600 }}>{formatPageName(currentPage)}</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        {/* Clock */}
        <div style={{ 
          ...mono, fontSize: '13px', color: C.cyan, 
          background: 'rgba(0,200,255,0.05)', padding: '6px 12px', 
          borderRadius: '6px', border: `1px solid rgba(0,200,255,0.15)`
        }}>
          {time || '00:00:00 UTC'}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={onOpenSearch}
            className="btn-action" 
            style={{ 
              background: 'transparent', border: `1px solid ${C.border}`, 
              color: C.textSecondary, padding: '8px', borderRadius: '8px'
            }}
          >
            <Search size={18} />
          </button>

          <button 
            onClick={onToggleNotifications}
            className="btn-action" 
            style={{ 
              background: 'transparent', border: `1px solid ${C.border}`, 
              color: C.textSecondary, padding: '8px', borderRadius: '8px',
              position: 'relative'
            }}
          >
            <Bell size={18} />
            {notificationCount > 0 && (
              <div style={{
                position: 'absolute', top: '-4px', right: '-4px',
                background: C.red, color: 'white', ...mono, fontSize: '9px',
                width: '16px', height: '16px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: `2px solid ${C.bg}`
              }}>
                {notificationCount}
              </div>
            )}
          </button>

          <button 
            onClick={onToggleAI}
            className="btn-action" 
            style={{ 
              background: aiActive ? 'rgba(168,85,247,0.15)' : 'transparent', 
              border: `1px solid ${aiActive ? C.purple : C.border}`, 
              color: aiActive ? C.purple : C.textSecondary, 
              padding: '8px 16px', borderRadius: '8px',
              display: 'flex', alignItems: 'center', gap: '8px',
              boxShadow: aiActive ? `0 0 15px rgba(168,85,247,0.2)` : 'none'
            }}
          >
            <Bot size={18} />
            <span style={{ ...raj, fontWeight: 700, fontSize: '14px' }}>AI AGENT</span>
          </button>
        </div>
      </div>
    </div>
  );
}
