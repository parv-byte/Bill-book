import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle2, Building, CreditCard, RefreshCw } from 'lucide-react';

export default function SettingsModal({ settings, onSaveSettings }) {
  const [formData, setFormData] = useState({
    companyName: 'BP CONSULTANT',
    tagline: 'HR and Compliance',
    pan: 'AEYPR8669A',
    contact: '91 988736872',
    email: 'bpc1164@gmail.com',
    nextSrNo: 1,
    signatureTitle: 'For BP CONSULTANT',
    bankDetails: {
      accountName: 'BP CONSULTANT',
      bankName: 'INDIAN BANK',
      branch: 'DINDAYAL NAGAR MORADABAD',
      accountNumber: '50322428417',
      ifsc: 'IDIB000D554'
    }
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        companyName: settings.companyName || 'BP CONSULTANT',
        tagline: settings.tagline || 'HR and Compliance',
        pan: settings.pan || 'AEYPR8669A',
        contact: settings.contact || '91 988736872',
        email: settings.email || 'bpc1164@gmail.com',
        nextSrNo: settings.nextSrNo !== undefined ? settings.nextSrNo : 1,
        signatureTitle: settings.signatureTitle || 'For BP CONSULTANT',
        bankDetails: {
          accountName: settings.bankDetails?.accountName || 'BP CONSULTANT',
          bankName: settings.bankDetails?.bankName || 'INDIAN BANK',
          branch: settings.bankDetails?.branch || 'DINDAYAL NAGAR MORADABAD',
          accountNumber: settings.bankDetails?.accountNumber || '50322428417',
          ifsc: settings.bankDetails?.ifsc || 'IDIB000D554'
        }
      });
    }
  }, [settings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBankChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      bankDetails: {
        ...(prev.bankDetails || {}),
        [name]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSaveSettings(formData);
    setIsSubmitting(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <h2 style={{ fontSize: '1.3rem', color: 'var(--cream)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Settings size={22} color="var(--gold)" />
          <span>Business & Invoice Configuration</span>
        </h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--cream-dim)' }}>
          These details appear on your invoices and generated PDFs.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Company & Provider Info */}
        <div className="glass-panel" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1.05rem', color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(201, 168, 76, 0.2)', paddingBottom: '8px' }}>
            <Building size={17} />
            <span>Service Provider & Header Details</span>
          </h3>

          <div className="form-grid-2col">
            <div>
              <label className="input-label">Provider / Firm Name</label>
              <input
                type="text"
                name="companyName"
                className="bpc-input"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="BP CONSULTANT"
                required
              />
            </div>

            <div>
              <label className="input-label">Subtitle (Below Firm Name)</label>
              <input
                type="text"
                name="tagline"
                className="bpc-input"
                value={formData.tagline}
                onChange={handleChange}
                placeholder="HR and Compliance"
                required
              />
            </div>
          </div>

          <div className="form-grid-2col">
            <div>
              <label className="input-label">PAN Number</label>
              <input
                type="text"
                name="pan"
                className="bpc-input"
                value={formData.pan}
                onChange={handleChange}
                placeholder="AEYPR8669A"
                required
              />
            </div>

            <div>
              <label className="input-label">Next Invoice Serial Number</label>
              <input
                type="number"
                name="nextSrNo"
                className="bpc-input"
                value={formData.nextSrNo}
                onChange={handleChange}
                style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--gold-light)' }}
              />
            </div>
          </div>

          <div className="form-grid-2col">
            <div>
              <label className="input-label">Contact Phone</label>
              <input
                type="text"
                name="contact"
                className="bpc-input"
                value={formData.contact}
                onChange={handleChange}
                placeholder="91 988736872"
              />
            </div>

            <div>
              <label className="input-label">Email Address</label>
              <input
                type="email"
                name="email"
                className="bpc-input"
                value={formData.email}
                onChange={handleChange}
                placeholder="bpc1164@gmail.com"
              />
            </div>
          </div>
        </div>

        {/* Bank Details */}
        <div className="glass-panel" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1.05rem', color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(201, 168, 76, 0.2)', paddingBottom: '8px' }}>
            <CreditCard size={17} />
            <span>Bank Details (As Shown on Invoice Bottom)</span>
          </h3>

          <div className="form-grid-2col">
            <div>
              <label className="input-label">A/c Holder Name</label>
              <input
                type="text"
                name="accountName"
                className="bpc-input"
                value={formData.bankDetails?.accountName || ''}
                onChange={handleBankChange}
                placeholder="BP CONSULTANT"
              />
            </div>

            <div>
              <label className="input-label">Bank Name</label>
              <input
                type="text"
                name="bankName"
                className="bpc-input"
                value={formData.bankDetails?.bankName || ''}
                onChange={handleBankChange}
                placeholder="INDIAN BANK"
              />
            </div>
          </div>

          <div className="form-grid-2col">
            <div>
              <label className="input-label">Branch</label>
              <input
                type="text"
                name="branch"
                className="bpc-input"
                value={formData.bankDetails?.branch || ''}
                onChange={handleBankChange}
                placeholder="DINDAYAL NAGAR MORADABAD"
              />
            </div>

            <div>
              <label className="input-label">A/C Number</label>
              <input
                type="text"
                name="accountNumber"
                className="bpc-input"
                value={formData.bankDetails?.accountNumber || ''}
                onChange={handleBankChange}
                style={{ fontFamily: 'monospace', fontWeight: 600 }}
              />
            </div>
          </div>

          <div>
            <label className="input-label">IFSC Code</label>
            <input
              type="text"
              name="ifsc"
              className="bpc-input"
              value={formData.bankDetails?.ifsc || ''}
              onChange={handleBankChange}
              style={{ fontFamily: 'monospace', fontWeight: 600 }}
            />
          </div>
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
          {savedSuccess && (
            <span style={{ color: '#34d399', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} />
              <span>Settings Saved Successfully!</span>
            </span>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-gold"
            style={{ padding: '12px 28px' }}
          >
            {isSubmitting ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
            <span>Save Settings</span>
          </button>
        </div>

      </form>
    </div>
  );
}
