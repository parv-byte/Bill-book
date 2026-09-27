import React, { useState } from 'react';
import { Users, Plus, Search, MapPin, Hash, Edit3, Trash2, X, Check, Building2, Phone, Mail } from 'lucide-react';

export default function ClientDirectory({
  clients,
  onSelectClientForBill,
  onUpdateClient,
  onDeleteClient,
  onAddClient
}) {
  const [search, setSearch] = useState('');
  const [editingClient, setEditingClient] = useState(null); // client being edited
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states for Add/Edit
  const [formName, setFormName] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formGstin, setFormGstin] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filtered = clients.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.address && c.address.toLowerCase().includes(search.toLowerCase())) ||
    (c.gstin && c.gstin.toLowerCase().includes(search.toLowerCase()))
  );

  const openEditModal = (client) => {
    setEditingClient(client);
    setFormName(client.name || '');
    setFormAddress(client.address || '');
    setFormGstin(client.gstin || '');
    setFormPhone(client.phone || '');
  };

  const closeEditModal = () => {
    setEditingClient(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert('Company name is required.');
      return;
    }
    setIsSubmitting(true);
    await onUpdateClient(editingClient._id, {
      name: formName.trim(),
      address: formAddress.trim(),
      gstin: formGstin.trim(),
      phone: formPhone.trim()
    });
    setIsSubmitting(false);
    closeEditModal();
  };

  const openAddModal = () => {
    setFormName('');
    setFormAddress('');
    setFormGstin('');
    setFormPhone('');
    setShowAddModal(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert('Company name is required.');
      return;
    }
    setIsSubmitting(true);
    await onAddClient({
      name: formName.trim(),
      address: formAddress.trim(),
      gstin: formGstin.trim(),
      phone: formPhone.trim()
    });
    setIsSubmitting(false);
    setShowAddModal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '1.3rem', color: 'var(--cream)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={22} color="var(--gold)" />
            <span>Client & Company Directory</span>
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--cream-dim)' }}>
            Manage saved client companies. Edit details or remove clients anytime.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Search */}
          <div style={{ position: 'relative', width: '240px' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gold)' }} />
            <input
              type="text"
              className="bpc-input"
              style={{ paddingLeft: '34px', fontSize: '0.85rem' }}
              placeholder="Search company or GSTIN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Add Client Button */}
          <button
            type="button"
            onClick={openAddModal}
            className="btn-gold"
            style={{ padding: '9px 16px', fontSize: '0.82rem' }}
          >
            <Plus size={15} />
            <span>Add Client</span>
          </button>
        </div>
      </div>

      {/* Grid of Client Cards */}
      {filtered.length === 0 ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--cream-dim)' }}>
          <Building2 size={36} color="var(--gold-dim)" style={{ marginBottom: '10px', display: 'inline-block' }} />
          <div style={{ fontSize: '1rem', fontWeight: 600 }}>No clients found</div>
          <div style={{ fontSize: '0.82rem', marginTop: '4px' }}>
            {search ? 'Try adjusting your search query.' : 'Add your first client using the button above or generate a bill.'}
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {filtered.map((c) => (
            <div key={c._id || c.name} className="glass-panel" style={{ padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '14px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                  <h3 style={{ fontSize: '1.05rem', color: 'var(--gold-light)' }}>
                    {c.name}
                  </h3>
                  
                  {/* Action Icons: Edit & Delete */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <button
                      type="button"
                      onClick={() => openEditModal(c)}
                      className="btn-ghost"
                      style={{ padding: '5px 8px', color: '#fbbf24', borderColor: 'rgba(251, 191, 36, 0.3)' }}
                      title="Edit Client Details"
                    >
                      <Edit3 size={13} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteClient(c._id)}
                      className="btn-ghost"
                      style={{ padding: '5px 8px', color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                      title="Remove Client"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {c.address ? (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '0.8rem', color: 'var(--cream-dim)', marginTop: '8px' }}>
                    <MapPin size={13} style={{ flexShrink: 0, marginTop: '3px', color: 'var(--gold-dim)' }} />
                    <span>{c.address}</span>
                  </div>
                ) : (
                  <div style={{ fontSize: '0.75rem', color: 'var(--cream-muted)', marginTop: '8px', fontStyle: 'italic' }}>
                    No address specified
                  </div>
                )}

                {c.gstin && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--cream-muted)', marginTop: '6px', fontFamily: 'monospace' }}>
                    <Hash size={13} color="var(--gold-dim)" />
                    <span>GSTIN: {c.gstin}</span>
                  </div>
                )}
              </div>

              <div style={{ borderTop: '1px solid rgba(201, 168, 76, 0.15)', paddingTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--cream-dim)', textTransform: 'uppercase' }}>
                    {c.billCount || 0} {(c.billCount || 0) === 1 ? 'Bill' : 'Bills'} • Billed
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#34d399', fontFamily: 'var(--font-mono)' }}>
                    ₹{Number(c.totalBilledAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                </div>

                <button
                  onClick={() => onSelectClientForBill(c)}
                  className="btn-gold"
                  style={{ padding: '7px 14px', fontSize: '0.78rem' }}
                >
                  <Plus size={13} />
                  <span>New Bill</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EDIT CLIENT MODAL POPUP */}
      {editingClient && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(6px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '24px', background: '#0a1633', border: '1.5px solid var(--gold)', animation: 'scaleIn 0.25s ease' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(201, 168, 76, 0.2)', paddingBottom: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Edit3 size={18} color="#fbbf24" />
                <h3 style={{ fontSize: '1.15rem', color: 'var(--cream)' }}>Edit Client Details</h3>
              </div>
              <button
                type="button"
                onClick={closeEditModal}
                className="btn-ghost"
                style={{ padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="input-label">Company Name *</label>
                <input
                  type="text"
                  className="bpc-input"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Amira Exports"
                  required
                />
              </div>

              <div>
                <label className="input-label">Company Address</label>
                <input
                  type="text"
                  className="bpc-input"
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  placeholder="e.g. 106, Kavi Nagar Industrial Area, Ghaziabad"
                />
              </div>

              <div>
                <label className="input-label">Party GSTIN</label>
                <input
                  type="text"
                  className="bpc-input"
                  value={formGstin}
                  onChange={(e) => setFormGstin(e.target.value)}
                  placeholder="GSTIN if applicable"
                />
              </div>

              <div>
                <label className="input-label">Phone Number (Optional)</label>
                <input
                  type="text"
                  className="bpc-input"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="btn-ghost"
                  style={{ padding: '8px 16px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-gold"
                  style={{ padding: '8px 20px' }}
                >
                  <Check size={15} />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ADD CLIENT MODAL POPUP */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(6px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '24px', background: '#0a1633', border: '1.5px solid var(--gold)', animation: 'scaleIn 0.25s ease' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(201, 168, 76, 0.2)', paddingBottom: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={18} color="var(--gold)" />
                <h3 style={{ fontSize: '1.15rem', color: 'var(--cream)' }}>Add New Client</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="btn-ghost"
                style={{ padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="input-label">Company Name *</label>
                <input
                  type="text"
                  className="bpc-input"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Amira Exports"
                  required
                />
              </div>

              <div>
                <label className="input-label">Company Address</label>
                <input
                  type="text"
                  className="bpc-input"
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  placeholder="e.g. 106, Kavi Nagar Industrial Area, Ghaziabad"
                />
              </div>

              <div>
                <label className="input-label">Party GSTIN</label>
                <input
                  type="text"
                  className="bpc-input"
                  value={formGstin}
                  onChange={(e) => setFormGstin(e.target.value)}
                  placeholder="GSTIN if applicable"
                />
              </div>

              <div>
                <label className="input-label">Phone Number (Optional)</label>
                <input
                  type="text"
                  className="bpc-input"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-ghost"
                  style={{ padding: '8px 16px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-gold"
                  style={{ padding: '8px 20px' }}
                >
                  <Plus size={15} />
                  <span>Add Client</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
