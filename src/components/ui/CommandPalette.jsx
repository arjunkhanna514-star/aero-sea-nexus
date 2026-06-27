import React, { useState, useEffect, useRef } from 'react';
import { Search, Globe, Cpu, Zap, TrendingUp, Package, Terminal } from 'lucide-react';

const C = {
  bg:'#020C18', surface:'#060F1E', card:'#091828', elevated:'#0C2038',
  border:'rgba(0,190,255,0.12)', borderHi:'rgba(0,205,255,0.35)',
  cyan:'#00C8FF', orange:'#FF7A2E', green:'#00FF85',
  yellow:'#FFD600', red:'#FF4566', purple:'#A855F7',
  textPrimary:'#C8E4F4', textSecondary:'#3C6882', textMuted:'#1A3550'
};
const raj = { fontFamily: "'Rajdhani',sans-serif" };
const mono = { fontFamily: "'JetBrains Mono',monospace" };

export default function CommandPalette({ isOpen, onClose, onSelect, pages }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const actions = [
    { id: 'simulate_storm', label: 'Simulate Category 5 Storm', icon: Terminal, category: 'Actions' },
    { id: 'recalc_routes', label: 'Recalculate All Routes', icon: Zap, category: 'Actions' },
    { id: 'export_report', label: 'Export Daily Intelligence Report', icon: TrendingUp, category: 'Actions' }
  ];

  const allItems = [
    ...pages.map(p => ({ ...p, category: 'Pages' })),
    ...actions
  ];

  const filteredItems = query === '' 
    ? allItems 
    : allItems.filter(item => item.label.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredItems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
      } else if (e.key === 'Enter' && filteredItems.length > 0) {
        onSelect(filteredItems[selectedIndex]);
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onClose, onSelect]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      paddingTop: '10vh', background: 'rgba(2,12,24,0.6)', backdropFilter: 'blur(4px)'
    }} onClick={onClose}>
      <div 
        className="glass-elevated animate-fade-up"
        style={{ width: '100%', maxWidth: '600px', borderRadius: '12px', overflow: 'hidden' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderBottom: `1px solid ${C.border}` }}>
          <Search size={20} color={C.cyan} style={{ marginRight: '12px' }} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search pages, actions, commands..."
            value={query}
            onChange={e => { setQuery(e.target.value); setSelectedIndex(0); }}
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: C.textPrimary, ...raj, fontSize: '20px',
            }}
          />
          <div style={{ ...mono, fontSize: '10px', color: C.textMuted, background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>
            ESC to close
          </div>
        </div>

        <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '8px' }}>
          {filteredItems.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: C.textSecondary, ...mono, fontSize: '13px' }}>
              No results found for "{query}"
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const Icon = item.icon || Globe;
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => { onSelect(item); onClose(); }}
                  style={{
                    display: 'flex', alignItems: 'center', padding: '12px 16px', cursor: 'pointer',
                    borderRadius: '8px',
                    background: isSelected ? 'rgba(0,200,255,0.1)' : 'transparent',
                    borderLeft: `2px solid ${isSelected ? C.cyan : 'transparent'}`,
                    transition: 'all 0.1s'
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div style={{ 
                    width: '32px', height: '32px', borderRadius: '6px', 
                    background: isSelected ? `${C.cyan}22` : 'rgba(255,255,255,0.03)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginRight: '12px'
                  }}>
                    <Icon size={16} color={isSelected ? C.cyan : C.textSecondary} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ ...raj, fontSize: '16px', color: isSelected ? C.textPrimary : C.textSecondary }}>{item.label}</div>
                    <div style={{ ...mono, fontSize: '10px', color: C.textMuted }}>{item.category}</div>
                  </div>
                  {isSelected && <div style={{ ...mono, fontSize: '10px', color: C.cyan }}>↵ Enter</div>}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
