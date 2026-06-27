import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

const C = {
  bg:'#020C18', surface:'#060F1E', card:'#091828', elevated:'#0C2038',
  border:'rgba(0,190,255,0.12)', borderHi:'rgba(0,205,255,0.35)',
  cyan:'#00C8FF', orange:'#FF7A2E', green:'#00FF85',
  yellow:'#FFD600', red:'#FF4566', purple:'#A855F7',
  textPrimary:'#C8E4F4', textSecondary:'#3C6882', textMuted:'#1A3550'
};
const raj = { fontFamily: "'Rajdhani',sans-serif" };
const mono = { fontFamily: "'JetBrains Mono',monospace" };

export default function DataTable({ columns, data, onRowClick, emptyMessage = 'No data available' }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const sortedData = React.useMemo(() => {
    let sortableItems = [...data];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  if (data.length === 0) {
    return (
      <div style={{ padding: '32px', textAlign: 'center', color: C.textSecondary, ...mono, fontSize: '13px' }}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${C.borderHi}` }}>
            {columns.map(col => (
              <th 
                key={col.key}
                onClick={() => col.sortable !== false && requestSort(col.key)}
                style={{
                  padding: '12px 16px',
                  ...mono, fontSize: '11px', color: C.textSecondary,
                  letterSpacing: '0.05em', textTransform: 'uppercase',
                  cursor: col.sortable !== false ? 'pointer' : 'default',
                  width: col.width
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {col.label}
                  {col.sortable !== false && sortConfig.key === col.key && (
                    sortConfig.direction === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, i) => (
            <tr 
              key={row.id || i}
              className="table-row"
              onClick={() => onRowClick && onRowClick(row)}
              style={{
                cursor: onRowClick ? 'pointer' : 'default',
                background: i % 2 === 0 ? 'transparent' : 'rgba(0,190,255,0.02)'
              }}
            >
              {columns.map(col => (
                <td key={col.key} style={{ padding: '12px 16px', ...raj, fontSize: '15px', color: C.textPrimary }}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
