import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import InvoiceForm from './components/InvoiceForm';
import InvoicePreview from './components/InvoicePreview';
import BillLedger from './components/BillLedger';
import ClientDirectory from './components/ClientDirectory';
import SettingsModal from './components/SettingsModal';
import SignIn from './components/SignIn';
import { API_BASE } from './config';
import { numberToWords } from './utils/numberToWords';
import { CheckCircle2, Download, AlertCircle } from 'lucide-react';

function getTodayString() {
  const d = new Date();
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('bpc_auth') === 'true';
  });
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('bpc_user')) || null;
    } catch {
      return null;
    }
  });

  const handleLoginSuccess = (user) => {
    localStorage.setItem('bpc_auth', 'true');
    localStorage.setItem('bpc_user', JSON.stringify(user));
    setIsAuthenticated(true);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('bpc_auth');
    localStorage.removeItem('bpc_user');
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const [activeTab, setActiveTab] = useState('create');
  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  // Edit Mode state
  const [editingInvoiceId, setEditingInvoiceId] = useState(null);

  // Active form state for new or edited bill
  const [form, setForm] = useState({
    companyName: '',
    description: 'Consultancy fee for Higg Audit',
    amount: '',
    companyAddress: '',
    partyGstin: '',
    date: getTodayString(),
    days: '',
    expense: 0,
    otherCharges: 0,
    status: 'Pending'
  });

  // Active invoice for live preview
  const [previewInvoice, setPreviewInvoice] = useState(null);

  // Fetch initial data
  const loadData = async () => {
    try {
      setLoading(true);
      const [invRes, clientRes, setRes] = await Promise.all([
        fetch(`${API_BASE}/api/invoices`),
        fetch(`${API_BASE}/api/clients`),
        fetch(`${API_BASE}/api/settings`)
      ]);

      const [invData, clientData, setData] = await Promise.all([
        invRes.json(),
        clientRes.json(),
        setRes.json()
      ]);

      setInvoices(Array.isArray(invData) ? invData : []);
      setClients(Array.isArray(clientData) ? clientData : []);
      setSettings(setData);

      if (invData.length > 0) {
        setPreviewInvoice(invData[0]);
      }
    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Update live preview object when form changes
  useEffect(() => {
    if (activeTab === 'create') {
      const amt = Number(form.amount) || 0;
      const expense = Number(form.expense) || 0;
      const otherCharges = Number(form.otherCharges) || 0;
      const totalAmount = amt;
      const grandTotal = totalAmount + otherCharges;

      setPreviewInvoice(prev => ({
        ...prev,
        srNo: form.srNo || prev?.srNo || settings?.nextSrNo || 1,
        date: form.date || getTodayString(),
        companyName: form.companyName || '',
        companyAddress: form.companyAddress || '',
        partyGstin: form.partyGstin || '',
        items: [
          {
            srNo: 1,
            description: form.description || 'Consultancy fee',
            days: form.days || '',
            expense,
            consultancyCost: amt,
            amount: amt
          }
        ],
        totalAmount,
        otherCharges,
        grandTotal,
        amountInWords: numberToWords(grandTotal),
        providerName: settings?.companyName || 'BP CONSULTANT',
        tagline: settings?.tagline || 'HR and Compliance',
        pan: settings?.pan || 'AEYPR8669A',
        contact: settings?.contact || '91 988736872',
        email: settings?.email || 'bpc1164@gmail.com',
        bankDetails: settings?.bankDetails,
        declarations: settings?.declarations,
        status: form.status || 'Pending'
      }));
    }
  }, [form, settings, activeTab]);

  const showToast = (message, type = 'success', actions = null) => {
    setNotification({ message, type, actions });
    setTimeout(() => {
      setNotification(null);
    }, 6000);
  };

  // Handle Save New Bill
  const handleSaveInvoice = async () => {
    try {
      setIsSaving(true);
      const amt = Number(form.amount) || 0;
      const otherChg = Number(form.otherCharges) || 0;
      const payload = {
        ...form,
        srNo: form.srNo || settings?.nextSrNo || 1,
        amount: amt,
        expense: Number(form.expense) || 0,
        otherCharges: otherChg,
        amountInWords: numberToWords(amt + otherChg)
      };

      const res = await fetch(`${API_BASE}/api/invoices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error('Failed to generate invoice');
      }

      const saved = await res.json();

      await loadData();
      setPreviewInvoice(saved);

      // Reset form
      setForm({
        companyName: '',
        description: 'Consultancy fee for Higg Audit',
        amount: '',
        companyAddress: '',
        partyGstin: '',
        date: getTodayString(),
        days: '',
        expense: 0,
        otherCharges: 0,
        status: 'Pending'
      });

      const paddedSrNo = String(saved.srNo).padStart(3, '0');
      showToast(
        `Invoice #${paddedSrNo} generated & PDF permanently archived!`,
        'success',
        {
          pdfUrl: `${API_BASE}/api/invoices/${saved._id}/pdf`,
          srNo: paddedSrNo
        }
      );
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Error creating invoice', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Edit Existing Invoice
  const handleEditInvoice = (inv) => {
    setEditingInvoiceId(inv._id);
    setForm({
      srNo: inv.srNo,
      companyName: inv.companyName || '',
      description: inv.items && inv.items.length > 0 ? inv.items[0].description : 'Consultancy fee',
      amount: inv.items && inv.items.length > 0 ? inv.items[0].amount : (inv.totalAmount || ''),
      companyAddress: inv.companyAddress || '',
      partyGstin: inv.partyGstin || '',
      date: inv.date || getTodayString(),
      days: inv.items && inv.items.length > 0 ? inv.items[0].days : '',
      expense: inv.items && inv.items.length > 0 ? inv.items[0].expense : 0,
      otherCharges: inv.otherCharges || 0,
      status: inv.status || 'Pending'
    });
    setPreviewInvoice(inv);
    setActiveTab('create');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Loaded Invoice #${String(inv.srNo).padStart(3, '0')} in edit mode.`);
  };

  // Handle Cancel Edit
  const handleCancelEdit = () => {
    setEditingInvoiceId(null);
    setForm({
      companyName: '',
      description: 'Consultancy fee for Higg Audit',
      amount: '',
      companyAddress: '',
      partyGstin: '',
      date: getTodayString(),
      days: '',
      expense: 0,
      otherCharges: 0,
      status: 'Pending'
    });
  };

  // Handle Update Existing Invoice
  const handleUpdateInvoice = async () => {
    if (!editingInvoiceId) return;
    try {
      setIsSaving(true);
      const amt = Number(form.amount) || 0;
      const otherChg = Number(form.otherCharges) || 0;
      const payload = {
        ...form,
        amount: amt,
        expense: Number(form.expense) || 0,
        otherCharges: otherChg,
        amountInWords: numberToWords(amt + otherChg),
        items: [
          {
            srNo: 1,
            description: form.description || 'Consultancy fee',
            days: form.days || '',
            expense: Number(form.expense) || 0,
            consultancyCost: Number(form.amount) || 0,
            amount: Number(form.amount) || 0
          }
        ]
      };

      const res = await fetch(`${API_BASE}/api/invoices/${editingInvoiceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error('Failed to update invoice');
      }

      const updated = await res.json();

      await loadData();
      setPreviewInvoice(updated);
      setEditingInvoiceId(null);

      // Reset form
      setForm({
        companyName: '',
        description: 'Consultancy fee for Higg Audit',
        amount: '',
        companyAddress: '',
        partyGstin: '',
        date: getTodayString(),
        days: '',
        expense: 0,
        otherCharges: 0,
        status: 'Pending'
      });

      const paddedSrNo = String(updated.srNo).padStart(3, '0');
      showToast(
        `Invoice #${paddedSrNo} updated & PDF regenerated successfully!`,
        'success',
        {
          pdfUrl: `${API_BASE}/api/invoices/${updated._id}/pdf`,
          srNo: paddedSrNo
        }
      );
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Error updating invoice', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Select Invoice from Ledger for quick view
  const handleSelectInvoice = (inv) => {
    setPreviewInvoice(inv);
    setActiveTab('create');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Select Client from Directory
  const handleSelectClientForBill = (client) => {
    setEditingInvoiceId(null);
    setForm(prev => ({
      ...prev,
      companyName: client.name,
      companyAddress: client.address || '',
      partyGstin: client.gstin || ''
    }));
    setActiveTab('create');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Toggle Status (Instant, reliable PATCH)
  const handleToggleStatus = async (inv) => {
    try {
      const newStatus = inv.status === 'Paid' ? 'Pending' : 'Paid';
      const res = await fetch(`${API_BASE}/api/invoices/${inv._id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        const updated = await res.json();
        setInvoices(prev => prev.map(i => i._id === updated._id ? { ...i, status: newStatus } : i));
        setPreviewInvoice(prev => {
          if (prev && prev._id === inv._id) {
            return { ...prev, status: newStatus };
          }
          return prev;
        });
        showToast(`Invoice #${inv.srNo} marked as ${newStatus}`);
      } else {
        throw new Error('Failed to update status');
      }
    } catch (err) {
      console.error(err);
      showToast('Error changing status', 'error');
    }
  };

  // Handle Delete Invoice
  const handleDeleteInvoice = async (id) => {
    if (!window.confirm('Are you sure you want to delete this invoice? The archived PDF record will be removed.')) {
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/invoices/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setInvoices(prev => prev.filter(i => i._id !== id));
        if (editingInvoiceId === id) {
          handleCancelEdit();
        }
        showToast('Invoice deleted from archive');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Update Client
  const handleUpdateClient = async (id, updatedData) => {
    try {
      const res = await fetch(`${API_BASE}/api/clients/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      if (res.ok) {
        const updated = await res.json();
        setClients(prev => prev.map(c => c._id === updated._id ? updated : c));
        showToast(`Client "${updated.name}" updated successfully!`);
      } else {
        throw new Error('Failed to update client');
      }
    } catch (err) {
      console.error(err);
      showToast('Error updating client', 'error');
    }
  };

  // Handle Delete Client
  const handleDeleteClient = async (id) => {
    if (!window.confirm('Are you sure you want to remove this client from your directory?')) {
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/clients/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setClients(prev => prev.filter(c => c._id !== id));
        showToast('Client removed from directory');
      } else {
        throw new Error('Failed to delete client');
      }
    } catch (err) {
      console.error(err);
      showToast('Error removing client', 'error');
    }
  };

  // Handle Add Client
  const handleAddClient = async (clientData) => {
    try {
      const res = await fetch(`${API_BASE}/api/clients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData)
      });
      if (res.ok) {
        const newClient = await res.json();
        setClients(prev => [newClient, ...prev]);
        showToast(`Client "${newClient.name}" added successfully!`);
      } else {
        throw new Error('Failed to add client');
      }
    } catch (err) {
      console.error(err);
      showToast('Error adding client', 'error');
    }
  };

  // Handle Save Settings
  const handleSaveSettings = async (newSettings) => {
    try {
      const res = await fetch(`${API_BASE}/api/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
      if (res.ok) {
        const updated = await res.json();
        setSettings(updated);
        showToast('Settings saved successfully');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isAuthenticated) {
    return <SignIn onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        nextSrNo={settings?.nextSrNo || 1}
        totalInvoices={invoices.length}
        onLogout={handleLogout}
        currentUser={currentUser}
      />

      {/* Floating Notification Toast */}
      {notification && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 1000,
          background: notification.type === 'error' ? 'rgba(239, 68, 68, 0.95)' : 'rgba(6, 14, 33, 0.95)',
          border: `1.5px solid ${notification.type === 'error' ? '#ef4444' : 'var(--gold)'}`,
          borderRadius: '8px',
          padding: '14px 20px',
          boxShadow: '0 12px 35px rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          maxWidth: '480px',
          animation: 'fadeUp 0.3s ease'
        }}>
          {notification.type === 'error' ? (
            <AlertCircle size={22} color="#ffffff" />
          ) : (
            <CheckCircle2 size={22} color="#34d399" />
          )}

          <div style={{ flex: 1, fontSize: '0.88rem', color: '#ffffff' }}>
            <div>{notification.message}</div>
            {notification.actions && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <a
                  href={notification.actions.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold"
                  style={{ padding: '4px 10px', fontSize: '0.74rem' }}
                >
                  <Download size={12} />
                  <span>Download PDF #{notification.actions.srNo}</span>
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="app-main-container">
        
        {/* TAB 1: CREATE OR EDIT BILL & LIVE PREVIEW */}
        {activeTab === 'create' && (
          <div className="main-grid-layout">
            
            {/* Left: Input Form (handles both Create and Edit) */}
            <div>
              <InvoiceForm
                form={form}
                setForm={setForm}
                clients={clients}
                onSave={handleSaveInvoice}
                onUpdate={handleUpdateInvoice}
                editingInvoiceId={editingInvoiceId}
                onCancelEdit={handleCancelEdit}
                isSaving={isSaving}
                nextSrNo={settings?.nextSrNo || 1}
              />
            </div>

            {/* Right: Live 1:1 Pure B&W Invoice Preview & Print */}
            <div>
              <InvoicePreview
                invoice={previewInvoice}
                settings={settings}
                onEditBill={handleEditInvoice}
                onToggleStatus={handleToggleStatus}
                isSaving={isSaving}
              />
            </div>

          </div>
        )}

        {/* TAB 2: 3-YEAR LEDGER & ARCHIVE */}
        {activeTab === 'archive' && (
          <BillLedger
            invoices={invoices}
            onSelectInvoice={handleSelectInvoice}
            onEditInvoice={handleEditInvoice}
            onDeleteInvoice={handleDeleteInvoice}
            onToggleStatus={handleToggleStatus}
            onRefresh={loadData}
          />
        )}

        {/* TAB 3: CLIENT DIRECTORY */}
        {activeTab === 'clients' && (
          <ClientDirectory
            clients={clients}
            onSelectClientForBill={handleSelectClientForBill}
            onUpdateClient={handleUpdateClient}
            onDeleteClient={handleDeleteClient}
            onAddClient={handleAddClient}
          />
        )}

        {/* TAB 4: SETTINGS */}
        {activeTab === 'settings' && (
          <SettingsModal
            settings={settings}
            onSaveSettings={handleSaveSettings}
          />
        )}

      </main>

      {/* Footer - Only BP Consultant • HR and Compliance */}
      <footer style={{ borderTop: '1px solid rgba(201, 168, 76, 0.15)', padding: '16px 24px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--cream-dim)', background: 'rgba(6, 14, 33, 0.8)', letterSpacing: '0.04em' }}>
        <div>
          BP Consultant • HR and Compliance
        </div>
      </footer>

    </div>
  );
}
