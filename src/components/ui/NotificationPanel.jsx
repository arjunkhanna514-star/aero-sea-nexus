import React from 'react';
import { X, Bell, Check, Info, AlertTriangle, AlertCircle } from 'lucide-react';

const C = {
  bg:'#020C18', surface:'#060F1E', card:'#091828', elevated:'#0C2038',
  border:'rgba(0,190,255,0.12)', borderHi:'rgba(0,205,255,0.35)',
  cyan:'#00C8FF', orange:'#FF7A2E', green:'#00FF85',
  yellow:'#FFD600', red:'#FF4566', purple:'#A855F7',
  textPrimary:'#C8E4F4', textSecondary:'#3C6882', textMuted:'#1A3550'
};
const raj = { fontFamily: "'Rajdhani',sans-serif" };
const mono = { fontFamily: "'JetBrains Mono',monospace" };

export default function NotificationPanel({ notifications = [], isOpen, onClose, onMarkRead, onDismiss }) {
  if (!isOpen) return null;

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return C.red;
      case 'medium': return C.orange;
      case 'low': return C.textSecondary;
      default: return C.cyan;
    }
  };

  const getPriorityIcon = (priority, color) => {
    switch(priority) {
      case 'high': return <AlertCircle size={16} color={color} />;
      case 'medium': return <AlertTriangle size={16} color={color} />;
      default: return <Info size={16} color={color} />;
    }
  };

  return (
    <div className="animate-slide-down glass-elevated" style={{
      position: 'absolute',
      top: '60px',
      right: '20px',
      width: '380px',
      maxHeight: '80vh',
      borderRadius: '8px',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100,
      boxShadow: '0 12px 40px rgba(0,0,0,0.8)'
    }}>
      <div style={{ 
        padding: '16px', 
        borderBottom: `1px solid ${C.border}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bell size={16} color={C.cyan} />
          <h3 style={{ ...raj, margin: 0, fontSize: '16px', color: C.textPrimary }}>SYSTEM ALERTS</h3>
          {notifications.filter(n => !n.read).length > 0 && (
            <span style={{ 
              background: C.red, color: 'white', ...mono, fontSize: '10px', 
              padding: '2px 6px', borderRadius: '10px' 
            }}>
              {notifications.filter(n => !n.read).length} NEW
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={onMarkRead} style={{
            background: 'none', border: 'none', color: C.textSecondary, cursor: 'pointer',
            ...mono, fontSize: '10px', display: 'flex', alignItems: 'center', gap: '4px'
          }}>
            <Check size={12} /> MARK ALL READ
          </button>
        </div>
      </div>

      <div style={{ overflowY: 'auto', flex: 1, padding: '8px 0' }}>
        {notifications.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: C.textSecondary, ...mono, fontSize: '12px' }}>
            No new alerts
          </div>
        ) : (
          notifications.slice(0, 20).map(notif => {
            const pColor = getPriorityColor(notif.priority);
            return (
              <div key={notif.id} style={{
                padding: '12px 16px',
                borderBottom: `1px solid rgba(0,190,255,0.05)`,
                display: 'flex',
                gap: '12px',
                position: 'relative',
                background: notif.read ? 'transparent' : 'rgba(0,200,255,0.03)',
                transition: 'background 0.2s'
              }} className="table-row">
                {!notif.read && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: pColor }}></div>}
                
                <div style={{ marginTop: '2px' }}>
                  {getPriorityIcon(notif.priority, pColor)}
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ ...raj, fontSize: '15px', fontWeight: 600, color: C.textPrimary }}>{notif.title}</div>
                    <div style={{ ...mono, fontSize: '9px', color: C.textMuted }}>{notif.timestamp}</div>
                  </div>
                  <div style={{ ...mono, fontSize: '11px', color: C.textSecondary, marginTop: '4px', lineHeight: 1.4 }}>
                    {notif.description}
                  </div>
                </div>
                
                <button onClick={() => onDismiss(notif.id)} style={{
                  background: 'none', border: 'none', color: C.textMuted, cursor: 'pointer',
                  padding: '4px', alignSelf: 'flex-start'
                }}>
                  <X size={14} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
