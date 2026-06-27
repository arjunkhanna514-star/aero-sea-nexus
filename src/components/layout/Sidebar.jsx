import React from 'react';
import { Anchor, Globe, Cpu, Zap, TrendingUp, Package, ChevronLeft, ChevronRight } from 'lucide-react';
import { UserButton } from '@clerk/clerk-react';
import StatusBadge from '../ui/StatusBadge';

const C = {
  bg:'#020C18', surface:'#060F1E', card:'#091828', elevated:'#0C2038',
  border:'rgba(0,190,255,0.12)', borderHi:'rgba(0,205,255,0.35)',
  cyan:'#00C8FF', orange:'#FF7A2E', green:'#00FF85',
  yellow:'#FFD600', red:'#FF4566', purple:'#A855F7',
  textPrimary:'#C8E4F4', textSecondary:'#3C6882', textMuted:'#1A3550'
};
const raj = { fontFamily: "'Rajdhani',sans-serif" };
const mono = { fontFamily: "'JetBrains Mono',monospace" };

export default function Sidebar({ activePage, onPageChange, collapsed, onToggleCollapse }) {
  const navItems = [
    { id: 'ingestion', icon: Globe, label: 'Data Ingestion', sub: 'The Global Eyes' },
    { id: 'simulation', icon: Cpu, label: 'Simulation & Analytics', sub: 'The Virtual Earth' },
    { id: 'operations', icon: Zap, label: 'Auto Operations', sub: 'The AI Negotiator' },
    { id: 'sales', icon: TrendingUp, label: 'Enterprise Sales', sub: 'The Data Goldmine' },
    { id: 'consumer', icon: Package, label: 'Consumer B2C', sub: 'Personal Hub' }
  ];

  return (
    <div style={{
      width: collapsed ? '68px' : '260px',
      height: '100vh',
      background: 'rgba(6,15,30,0.6)',
      backdropFilter: 'blur(16px)',
      borderRight: `1px solid ${C.border}`,
      transition: 'width 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      zIndex: 40
    }}>
      {/* Header */}
      <div style={{
        height: '64px', display: 'flex', alignItems: 'center', padding: collapsed ? '0 18px' : '0 20px',
        borderBottom: `1px solid ${C.border}`, overflow: 'hidden'
      }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '8px',
          background: 'rgba(0,200,255,0.1)', border: `1px solid ${C.cyan}40`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
        }}>
          <Anchor size={18} color={C.cyan} />
        </div>
        {!collapsed && (
          <div style={{ marginLeft: '12px', whiteSpace: 'nowrap', animation: 'fadeIn 0.3s' }}>
            <div style={{ ...raj, fontSize: '18px', fontWeight: 700, color: C.textPrimary, letterSpacing: '0.05em' }}>
              AERO-SEA <span style={{ color: C.cyan }}>NEXUS</span>
            </div>
          </div>
        )}
      </div>

      {/* Nav Items */}
      <div style={{ flex: 1, padding: '20px 0', overflowY: 'auto', overflowX: 'hidden' }}>
        {navItems.map(item => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`nav-btn ${isActive ? 'active' : ''}`}
              title={collapsed ? item.label : undefined}
              style={{
                width: '100%',
                padding: collapsed ? '12px 0' : '12px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: collapsed ? 'center' : 'flex-start',
                borderLeft: `3px solid ${isActive ? C.cyan : 'transparent'}`,
                background: isActive ? 'linear-gradient(90deg, rgba(0,200,255,0.1) 0%, transparent 100%)' : 'transparent',
                transition: 'all 0.2s',
                borderRight: 'none',
                cursor: 'pointer'
              }}
            >
              <item.icon size={20} color={isActive ? C.cyan : C.textSecondary} style={{ flexShrink: 0 }} />
              {!collapsed && (
                <div style={{ marginLeft: '14px', textAlign: 'left', whiteSpace: 'nowrap' }}>
                  <div style={{ ...raj, fontSize: '16px', fontWeight: 600, color: isActive ? C.textPrimary : C.textSecondary }}>
                    {item.label}
                  </div>
                  <div style={{ ...mono, fontSize: '10px', color: C.textMuted }}>
                    {item.sub}
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Section */}
      <div style={{ padding: '20px', borderTop: `1px solid ${C.border}`, overflow: 'hidden' }}>
        {!collapsed && (
          <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ ...mono, fontSize: '10px', color: C.textMuted }}>Q-NAV</span>
              <StatusBadge status="live" label="LIVE" size="sm" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ ...mono, fontSize: '10px', color: C.textMuted }}>SWARM</span>
              <StatusBadge status="live" label="LIVE" size="sm" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ ...mono, fontSize: '10px', color: C.textMuted }}>EAGLE EYE</span>
              <StatusBadge status="live" label="LIVE" size="sm" />
            </div>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between' }}>
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: { width: '32px', height: '32px', borderRadius: '8px' }
              }
            }}
          />
          {!collapsed && (
            <div style={{ ...mono, fontSize: '10px', color: C.textMuted }}>
              v4.0.0
            </div>
          )}
        </div>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={onToggleCollapse}
        style={{
          position: 'absolute',
          top: '20px',
          right: '-12px',
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          background: C.elevated,
          border: `1px solid ${C.borderHi}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: C.textPrimary,
          zIndex: 50
        }}
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </div>
  );
}
