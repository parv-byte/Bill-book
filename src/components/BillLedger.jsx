import React, { useState } from 'react';
import { Search, Download, Trash2, CheckCircle2, Clock, FileSpreadsheet, AlertCircle, Edit3 } from 'lucide-react';
import { API_BASE } from '../config';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function BillLedger({ invoices, onSelectInvoice, onEditInvoice, onDeleteInvoice, onToggleStatus }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Filter invoices locally or based on current loaded state
  const filtered = invoices.filter(inv => {
    // Search
    const matchesSearch = !searchTerm || 
      inv.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(inv.srNo).includes(searchTerm) ||
      (inv.items && inv.items.some(i => i.description.toLowerCase().includes(searchTerm.toLowerCase())));

    // Status
    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;

    // Date/Year/Month
    let matchesDate = true;
    if (inv.invoiceDate || inv.date) {
      const d = new Date(inv.invoiceDate || inv.createdAt);
      if (!isNaN(d.getTime())) {
        if (selectedYear !== 'All' && d.getFullYear().toString() !== selectedYear) {
          matchesDate = false;
        }
        if (selectedMonth !== 'All' && (d.getMonth() + 1).toString() !== selectedMonth) {
          matchesDate = false;
        }
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalRevenue = filtered.reduce((acc, curr) => acc + (Number(curr.grandTotal) || 0), 0);
  const paidCount = filtered.filter(i => i.status === 'Paid').length;
  const pendingCount = filtered.filter(i => i.status === 'Pending').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        
        <div className="glass-panel" style={{ padding: '18px' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--cream-dim)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Total Invoices Archived
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--gold-light)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
            {filtered.length}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'rgba(212, 201, 176, 0.6)', marginTop: '4px' }}>
            Target ~30 bills/mo • 3-Year Record System
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '18px' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--cream-dim)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Total Billed Revenue
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#34d399', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
            ₹{totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'rgba(212, 201, 176, 0.6)', marginTop: '4px' }}>
            From {filtered.length} matched records
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '18px' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--cream-dim)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Payment Status
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '10px' }}>
            <div>
              <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#34d399' }}>{paidCount}</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--cream-dim)', marginLeft: '4px' }}>Paid</span>
            </div>
            <div style={{ width: '1px', height: '24px', background: 'rgba(201, 168, 76, 0.2)' }}></div>
            <div>
              <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fbbf24' }}>{pendingCount}</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--cream-dim)', marginLeft: '4px' }}>Pending</span>
            </div>
          </div>
          <div style={{ fontSize: '0.74rem', color: 'rgba(212, 201, 176, 0.6)', marginTop: '6px' }}>
            Click status pill to toggle
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--cream-dim)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Archive Compliance
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--cream)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} color="#34d399" />
              <span>Permanent PDF Retention</span>
            </div>
          </div>
          <a
            href={`${API_BASE}/api/invoices/export/csv`}
            className="btn-outline-gold"
            style={{ fontSize: '0.75rem', padding: '6px 12px', marginTop: '8px', alignSelf: 'flex-start' }}
            download
          >
            <FileSpreadsheet size={14} />
            <span>Export CSV / Excel</span>
          </a>
        </div>

      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Search Input */}
        <div style={{ position: 'relative', flex: '1', minWidth: '220px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gold)' }} />
          <input
            type="text"
            className="bpc-input"
            style={{ paddingLeft: '36px', fontSize: '0.88rem' }}
            placeholder="Search by company name, bill # or service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters Group */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          
          {/* Year Filter */}
          <select
            className="bpc-input"
            style={{ width: 'auto', padding: '8px 12px', fontSize: '0.84rem' }}
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="All" style={{ background: '#0d1b3e', color: '#fff' }}>All Years</option>
            <option value="2026" style={{ background: '#0d1b3e', color: '#fff' }}>2026</option>
            <option value="2025" style={{ background: '#0d1b3e', color: '#fff' }}>2025</option>
            <option value="2024" style={{ background: '#0d1b3e', color: '#fff' }}>2024</option>
            <option value="2023" style={{ background: '#0d1b3e', color: '#fff' }}>2023</option>
          </select>

          {/* Month Filter */}
          <select
            className="bpc-input"
            style={{ width: 'auto', padding: '8px 12px', fontSize: '0.84rem' }}
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="All" style={{ background: '#0d1b3e', color: '#fff' }}>All Months</option>
            {MONTH_NAMES.map((m, idx) => (
              <option key={idx} value={String(idx + 1)} style={{ background: '#0d1b3e', color: '#fff' }}>
                {m}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            className="bpc-input"
            style={{ width: 'auto', padding: '8px 12px', fontSize: '0.84rem' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All" style={{ background: '#0d1b3e', color: '#fff' }}>All Status</option>
            <option value="Paid" style={{ background: '#0d1b3e', color: '#fff' }}>Paid</option>
            <option value="Pending" style={{ background: '#0d1b3e', color: '#fff' }}>Pending</option>
          </select>

        </div>

      </div>

      {/* Invoices Ledger Table */}
      <div className="glass-panel" style={{ overflowX: 'auto', padding: '8px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(201, 168, 76, 0.25)', color: 'var(--gold)' }}>
              <th style={{ padding: '12px 14px' }}>Bill #</th>
              <th style={{ padding: '12px 14px' }}>Date</th>
              <th style={{ padding: '12px 14px' }}>Company Name</th>
              <th style={{ padding: '12px 14px' }}>Service Description</th>
              <th style={{ padding: '12px 14px', textAlign: 'right' }}>Amount</th>
              <th style={{ padding: '12px 14px', textAlign: 'center' }}>Status</th>
              <th style={{ padding: '12px 14px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--cream-dim)' }}>
                  <AlertCircle size={28} color="var(--gold-dim)" style={{ marginBottom: '8px', display: 'inline-block' }} />
                  <div>No invoices match your filter criteria.</div>
                </td>
              </tr>
            ) : (
              filtered.map((inv) => (
                <tr
                  key={inv._id}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(201, 168, 76, 0.07)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '12px 14px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--gold-light)' }}>
                    #{String(inv.srNo).padStart(3, '0')}
                  </td>
                  <td style={{ padding: '12px 14px', color: 'var(--cream-dim)' }}>
                    {inv.date}
                  </td>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--cream)' }}>
                    {inv.companyName}
                    {inv.partyGstin && (
                      <div style={{ fontSize: '0.72rem', color: 'var(--cream-muted)', fontFamily: 'monospace' }}>
                        GSTIN: {inv.partyGstin}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '12px 14px', color: 'var(--cream-dim)', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {inv.items && inv.items.length > 0 ? inv.items[0].description : 'Consultancy fee'}
                    {inv.items && inv.items.length > 1 && ` (+${inv.items.length - 1} more)`}
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#fff' }}>
                    ₹{Number(inv.grandTotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                    <button
                      onClick={() => onToggleStatus(inv)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                      title="Click to toggle status"
                    >
                      <span className={`badge ${inv.status === 'Paid' ? 'badge-paid' : 'badge-pending'}`}>
                        {inv.status === 'Paid' ? <CheckCircle2 size={11} /> : <Clock size={11} />}
                        {inv.status}
                      </span>
                    </button>
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                      {/* EDIT BUTTON */}
                      <button
                        onClick={() => onEditInvoice ? onEditInvoice(inv) : onSelectInvoice(inv)}
                        className="btn-ghost"
                        style={{ color: '#fbbf24', borderColor: 'rgba(251, 191, 36, 0.3)' }}
                        title="Edit this Invoice"
                      >
                        <Edit3 size={14} />
                        <span style={{ fontSize: '0.75rem' }}>Edit</span>
                      </button>

                      <a
                        href={`${API_BASE}/api/invoices/${inv._id}/pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-ghost"
                        title="Download Original PDF"
                      >
                        <Download size={14} />
                      </a>

                      <button
                        onClick={() => onDeleteInvoice(inv._id)}
                        className="btn-ghost"
                        style={{ color: 'var(--danger)' }}
                        title="Delete Invoice"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
