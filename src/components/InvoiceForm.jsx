import React, { useState, useEffect } from 'react';
import { Send, Zap, ChevronDown, ChevronUp, Building2, FileText, IndianRupee, RefreshCw, Edit3, X, Check, Clock, CheckCircle2 } from 'lucide-react';

const COMMON_PRESETS = [
  'Consultancy fee for Higg Audit',
  'Statutory Audit Fee',
  'ISO 9001 / 14001 Certification Liaison',
  'Compliance & Factory Inspection Advisory',
  'HR & Labor Law Advisory'
];

export default function InvoiceForm({
  form,
  setForm,
  clients,
  onSave,
  onUpdate,
  editingInvoiceId,
  onCancelEdit,
  isSaving,
  nextSrNo
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filteredClients, setFilteredClients] = useState([]);
  const [showClientDropdown, setShowClientDropdown] = useState(false);

  // If in edit mode, auto-expand advanced if there's address or gstin
  useEffect(() => {
    if (editingInvoiceId && (form.companyAddress || form.partyGstin || form.days)) {
      setShowAdvanced(true);
    }
  }, [editingInvoiceId]);

  // Filter clients for autocomplete
  useEffect(() => {
    if (!form.companyName || form.companyName.trim() === '') {
      setFilteredClients([]);
      return;
    }
    const match = clients.filter(c => 
      c.name.toLowerCase().includes(form.companyName.toLowerCase())
    );
    setFilteredClients(match);
  }, [form.companyName, clients]);

  const selectClient = (client) => {
    setForm(prev => ({
      ...prev,
      companyName: client.name,
      companyAddress: client.address || prev.companyAddress,
      partyGstin: client.gstin || prev.partyGstin
    }));
    setShowClientDropdown(false);
  };

  const handlePresetClick = (preset) => {
    setForm(prev => ({
      ...prev,
      description: preset
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.companyName || !form.amount) {
      alert('Please enter at least the Company Name and Amount.');
      return;
    }
    if (editingInvoiceId) {
      onUpdate();
    } else {
      onSave();
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Form Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(201, 168, 76, 0.2)', paddingBottom: '14px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--cream)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {editingInvoiceId ? (
              <>
                <Edit3 size={20} color="#fbbf24" />
                <span style={{ color: '#fbbf24' }}>Edit Invoice #{String(form.srNo).padStart(3, '0')}</span>
              </>
            ) : (
              <>
                <Zap size={20} color="var(--gold)" />
                <span>Generate New Bill</span>
              </>
            )}
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--cream-dim)' }}>
            {editingInvoiceId 
              ? 'Modify any field below to update this invoice and regenerate its PDF.'
              : 'Quick bill generator: Just fill company, amount & description.'}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {editingInvoiceId && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="btn-ghost"
              style={{ fontSize: '0.75rem', padding: '5px 10px', color: '#fbbf24', borderColor: 'rgba(251, 191, 36, 0.4)' }}
              title="Cancel editing and create a new bill"
            >
              <X size={13} />
              <span>Cancel Edit</span>
            </button>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(201, 168, 76, 0.12)', padding: '5px 12px', borderRadius: '20px', border: '1px solid rgba(201, 168, 76, 0.25)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--gold)', fontWeight: 600 }}>Bill #</span>
            <span style={{ fontSize: '0.9rem', color: 'var(--gold-light)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
              {String(form.srNo || nextSrNo || 1).padStart(3, '0')}
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        
        {/* 1. COMPANY NAME INPUT WITH AUTOCOMPLETE */}
        <div style={{ position: 'relative' }}>
          <label className="input-label" htmlFor="company-name-input">
            <Building2 size={13} style={{ display: 'inline', marginRight: '5px' }} />
            Company Name *
          </label>
          <input
            id="company-name-input"
            type="text"
            className="bpc-input"
            placeholder="e.g. Amira Exports"
            value={form.companyName || ''}
            onChange={(e) => {
              setForm(prev => ({ ...prev, companyName: e.target.value }));
              setShowClientDropdown(true);
            }}
            onFocus={() => setShowClientDropdown(true)}
            required
            autoComplete="off"
            style={{ fontSize: '1rem', fontWeight: 600 }}
          />

          {/* Autocomplete Dropdown */}
          {showClientDropdown && filteredClients.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: '#0d1b3e',
              border: '1px solid var(--gold)',
              borderRadius: '6px',
              marginTop: '4px',
              zIndex: 50,
              maxHeight: '180px',
              overflowY: 'auto',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
            }}>
              {filteredClients.map(c => (
                <div
                  key={c._id || c.name}
                  onClick={() => selectClient(c)}
                  style={{
                    padding: '9px 12px',
                    borderBottom: '1px solid rgba(201, 168, 76, 0.1)',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    transition: 'background 0.2s',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(201, 168, 76, 0.15)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <span style={{ fontWeight: 600, color: 'var(--cream)' }}>{c.name}</span>
                  {c.address && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--cream-dim)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.address}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 2. DESCRIPTION INPUT + PRESETS */}
        <div>
          <label className="input-label" htmlFor="service-description-input">
            <FileText size={13} style={{ display: 'inline', marginRight: '5px' }} />
            Description of the Amount *
          </label>
          <input
            id="service-description-input"
            type="text"
            className="bpc-input"
            placeholder="e.g. Consultancy fee for Higg Audit"
            value={form.description || ''}
            onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
            required
          />

          {/* Quick preset chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
            {COMMON_PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handlePresetClick(p)}
                style={{
                  background: form.description === p ? 'rgba(201, 168, 76, 0.25)' : 'rgba(26, 39, 68, 0.6)',
                  border: '1px solid rgba(201, 168, 76, 0.2)',
                  color: form.description === p ? 'var(--gold-light)' : 'var(--cream-dim)',
                  fontSize: '0.73rem',
                  padding: '4px 9px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                + {p}
              </button>
            ))}
          </div>
        </div>

        {/* 3. AMOUNT (₹) & PAYMENT STATUS (PROMINENT RIGHT ON THE FORM) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '14px' }}>
          <div>
            <label className="input-label" htmlFor="bill-amount-input">
              <IndianRupee size={13} style={{ display: 'inline', marginRight: '5px' }} />
              Total Amount (₹) *
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gold)', fontWeight: 700, fontSize: '1.1rem' }}>
                ₹
              </span>
              <input
                id="bill-amount-input"
                type="number"
                min="0"
                step="any"
                className="bpc-input"
                placeholder="e.g. 25000"
                value={form.amount || ''}
                onChange={(e) => setForm(prev => ({ ...prev, amount: e.target.value }))}
                required
                style={{ paddingLeft: '34px', fontSize: '1.15rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--gold-light)' }}
              />
            </div>
          </div>

          {/* PAYMENT STATUS TOGGLE DIRECTLY VISIBLE ON FORM */}
          <div>
            <label className="input-label">Payment Status</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              <button
                type="button"
                onClick={() => setForm(prev => ({ ...prev, status: 'Pending' }))}
                style={{
                  padding: '9px 6px',
                  borderRadius: '6px',
                  border: (form.status === 'Pending' || !form.status) ? '1.5px solid #fbbf24' : '1px solid rgba(201, 168, 76, 0.2)',
                  background: (form.status === 'Pending' || !form.status) ? 'rgba(245, 158, 11, 0.22)' : 'rgba(13, 27, 62, 0.6)',
                  color: (form.status === 'Pending' || !form.status) ? '#fbbf24' : 'var(--cream-dim)',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  transition: 'all 0.2s'
                }}
              >
                <Clock size={13} />
                <span>Pending</span>
              </button>

              <button
                type="button"
                onClick={() => setForm(prev => ({ ...prev, status: 'Paid' }))}
                style={{
                  padding: '9px 6px',
                  borderRadius: '6px',
                  border: form.status === 'Paid' ? '1.5px solid #10b981' : '1px solid rgba(201, 168, 76, 0.2)',
                  background: form.status === 'Paid' ? 'rgba(16, 185, 129, 0.22)' : 'rgba(13, 27, 62, 0.6)',
                  color: form.status === 'Paid' ? '#34d399' : 'var(--cream-dim)',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  transition: 'all 0.2s'
                }}
              >
                <CheckCircle2 size={13} />
                <span>Paid</span>
              </button>
            </div>
          </div>
        </div>

        {/* TOGGLE ADDITIONAL DETAILS */}
        <div>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--gold)',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              padding: '4px 0',
              fontWeight: 600
            }}
          >
            {showAdvanced ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            <span>{showAdvanced ? 'Hide Additional Details (Address, Date, GSTIN)' : 'Show Additional Details (Address, Date, GSTIN)'}</span>
          </button>
        </div>

        {/* ADDITIONAL FIELDS */}
        {showAdvanced && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            padding: '16px',
            background: 'rgba(6, 14, 33, 0.4)',
            borderRadius: '6px',
            border: '1px dashed rgba(201, 168, 76, 0.25)'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="input-label">Date (DD/MM/YYYY)</label>
                <input
                  type="text"
                  className="bpc-input"
                  value={form.date || ''}
                  onChange={(e) => setForm(prev => ({ ...prev, date: e.target.value }))}
                  placeholder="DD/MM/YYYY"
                />
              </div>

              <div>
                <label className="input-label">Sr. No.</label>
                <input
                  type="number"
                  className="bpc-input"
                  value={form.srNo || ''}
                  onChange={(e) => setForm(prev => ({ ...prev, srNo: e.target.value }))}
                  placeholder="001"
                />
              </div>
            </div>

            <div>
              <label className="input-label">Company Address</label>
              <input
                type="text"
                className="bpc-input"
                placeholder="e.g. 106, Kavi Nagar Industrial Area, Ghaziabad"
                value={form.companyAddress || ''}
                onChange={(e) => setForm(prev => ({ ...prev, companyAddress: e.target.value }))}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="input-label">Party GSTIN</label>
                <input
                  type="text"
                  className="bpc-input"
                  placeholder="GSTIN if applicable"
                  value={form.partyGstin || ''}
                  onChange={(e) => setForm(prev => ({ ...prev, partyGstin: e.target.value }))}
                />
              </div>

              <div>
                <label className="input-label">No. of Days / No. of Bills</label>
                <input
                  type="text"
                  className="bpc-input"
                  placeholder="e.g. 1"
                  value={form.days || ''}
                  onChange={(e) => setForm(prev => ({ ...prev, days: e.target.value }))}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="input-label">Cost of Expense (₹)</label>
                <input
                  type="number"
                  min="0"
                  className="bpc-input"
                  placeholder="0"
                  value={form.expense || ''}
                  onChange={(e) => setForm(prev => ({ ...prev, expense: e.target.value }))}
                />
              </div>

              <div>
                <label className="input-label">Other Charges (₹)</label>
                <input
                  type="number"
                  min="0"
                  className="bpc-input"
                  placeholder="0"
                  value={form.otherCharges || ''}
                  onChange={(e) => setForm(prev => ({ ...prev, otherCharges: e.target.value }))}
                />
              </div>
            </div>
          </div>
        )}

        {/* PRIMARY ACTION BUTTON */}
        <button
          type="submit"
          disabled={isSaving}
          className="btn-gold"
          style={{ width: '100%', padding: '14px', fontSize: '0.95rem', marginTop: '6px' }}
        >
          {isSaving ? (
            <>
              <RefreshCw size={18} className="animate-spin" />
              <span>{editingInvoiceId ? 'Updating Invoice...' : 'Saving & Generating PDF...'}</span>
            </>
          ) : editingInvoiceId ? (
            <>
              <Check size={18} />
              <span>Update Invoice #{String(form.srNo).padStart(3, '0')} & Regenerate PDF</span>
            </>
          ) : (
            <>
              <Send size={18} />
              <span>Save & Generate Invoice PDF</span>
            </>
          )}
        </button>

      </form>
    </div>
  );
}
