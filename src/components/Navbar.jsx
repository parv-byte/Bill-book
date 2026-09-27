import React from 'react';
import { Archive, Users, Settings, PlusCircle, ShieldCheck, LogOut } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, nextSrNo, totalInvoices, onLogout, currentUser }) {
  return (
    <header className="glass-panel" style={{ borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none', padding: '16px 24px', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Brand & Logo - Clean BP CONSULTANT */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '6px',
            background: 'linear-gradient(135deg, var(--gold-light), var(--gold-dim))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(201, 168, 76, 0.3)'
          }}>
            <ShieldCheck size={26} color="#060e21" strokeWidth={2.2} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 700, letterSpacing: '0.04em' }} className="gold-gradient-text">
                BP CONSULTANT
              </span>
              <span style={{ fontSize: '0.72rem', padding: '3px 8px', background: 'rgba(201, 168, 76, 0.15)', color: 'var(--gold)', border: '1px solid rgba(201, 168, 76, 0.3)', borderRadius: '4px', fontWeight: 600 }}>
                BILL BOOK
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(6, 14, 33, 0.6)', padding: '4px', borderRadius: '8px', border: '1px solid rgba(201, 168, 76, 0.15)' }}>
          <button
            onClick={() => setActiveTab('create')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.84rem',
              fontWeight: 600,
              transition: 'all 0.2s',
              background: activeTab === 'create' ? 'linear-gradient(135deg, var(--gold), var(--gold-dim))' : 'transparent',
              color: activeTab === 'create' ? '#060e21' : 'var(--cream-dim)'
            }}
          >
            <PlusCircle size={16} />
            <span>New Bill</span>
          </button>

          <button
            onClick={() => setActiveTab('archive')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.84rem',
              fontWeight: 600,
              transition: 'all 0.2s',
              background: activeTab === 'archive' ? 'linear-gradient(135deg, var(--gold), var(--gold-dim))' : 'transparent',
              color: activeTab === 'archive' ? '#060e21' : 'var(--cream-dim)'
            }}
          >
            <Archive size={16} />
            <span>Ledger & Archive</span>
            {totalInvoices > 0 && (
              <span style={{ fontSize: '0.72rem', background: activeTab === 'archive' ? 'rgba(0,0,0,0.2)' : 'rgba(201, 168, 76, 0.2)', padding: '1px 6px', borderRadius: '10px' }}>
                {totalInvoices}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('clients')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.84rem',
              fontWeight: 600,
              transition: 'all 0.2s',
              background: activeTab === 'clients' ? 'linear-gradient(135deg, var(--gold), var(--gold-dim))' : 'transparent',
              color: activeTab === 'clients' ? '#060e21' : 'var(--cream-dim)'
            }}
          >
            <Users size={16} />
            <span>Clients</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.84rem',
              fontWeight: 600,
              transition: 'all 0.2s',
              background: activeTab === 'settings' ? 'linear-gradient(135deg, var(--gold), var(--gold-dim))' : 'transparent',
              color: activeTab === 'settings' ? '#060e21' : 'var(--cream-dim)'
            }}
          >
            <Settings size={16} />
            <span>Settings</span>
          </button>
        </nav>

        {/* Quick status pill & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.70rem', color: 'var(--cream-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Next Bill Serial
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--gold-light)', fontFamily: 'var(--font-mono)' }}>
              #{String(nextSrNo || 1).padStart(3, '0')}
            </div>
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              title="Sign Out (bpc1164@gmail.com)"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 12px',
                borderRadius: '6px',
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#fca5a5',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 500,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.22)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)';
              }}
            >
              <LogOut size={15} />
              <span>Sign Out</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
