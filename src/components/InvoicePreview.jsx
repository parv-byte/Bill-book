import React from 'react';
import { Printer, Download, Edit3, CheckCircle2, Clock } from 'lucide-react';
import { API_BASE } from '../config';

export default function InvoicePreview({ invoice, settings, onEditBill, onToggleStatus }) {
  const currentInvoice = invoice || {};
  const currentSettings = settings || {};

  const srNo = String(currentInvoice.srNo || currentSettings.nextSrNo || 1).padStart(3, '0');
  const dateStr = currentInvoice.date || new Date().toLocaleDateString('en-GB');
  const companyName = currentInvoice.companyName || '';
  const companyAddress = currentInvoice.companyAddress || '';
  const partyGstin = currentInvoice.partyGstin || '';
  const status = currentInvoice.status || 'Pending';

  const items = (currentInvoice.items && currentInvoice.items.length > 0) ? currentInvoice.items : [
    {
      srNo: 1,
      description: currentInvoice.description || 'Consultancy fee',
      days: currentInvoice.days || '',
      expense: currentInvoice.expense || 0,
      consultancyCost: currentInvoice.consultancyCost || currentInvoice.amount || 0,
      amount: currentInvoice.amount || 0
    }
  ];

  const totalAmount = currentInvoice.totalAmount !== undefined 
    ? Number(currentInvoice.totalAmount)
    : items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  const otherCharges = Number(currentInvoice.otherCharges || 0);
  const grandTotal = currentInvoice.grandTotal !== undefined 
    ? Number(currentInvoice.grandTotal)
    : (totalAmount + otherCharges);

  const amountInWords = currentInvoice.amountInWords || 'Rupees Only';

  const bank = currentInvoice.bankDetails || currentSettings.bankDetails || {
    accountName: 'BP CONSULTANT',
    bankName: 'INDIAN BANK',
    branch: 'DINDAYAL NAGAR MORADABAD',
    accountNumber: '50322428417',
    ifsc: 'IDIB000D554'
  };

  const providerName = currentInvoice.providerName || currentSettings.companyName || 'BP CONSULTANT';
  const tagline = currentInvoice.tagline || currentSettings.tagline || 'HR and Compliance';
  const pan = currentInvoice.pan || currentSettings.pan || 'AEYPR8669A';
  const contact = currentInvoice.contact || currentSettings.contact || '91 988736872';
  const email = currentInvoice.email || currentSettings.email || 'bpc1164@gmail.com';

  const declarations = (currentInvoice.declarations && currentInvoice.declarations.length > 0)
    ? currentInvoice.declarations
    : [
        'Payment 50% Advance',
        'Described and that all particulars are true and correct.',
        'Disputes are subject to MORADABAD jurisdiction only.'
      ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Top Action Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', background: 'rgba(13, 27, 62, 0.6)', padding: '10px 16px', borderRadius: '8px', border: '1px solid rgba(201, 168, 76, 0.2)' }}>
        
        {/* Left indicators */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--gold-light)' }}>
            Live Bill Preview
          </span>

          {/* Interactive Status Toggle Button */}
          {currentInvoice._id && onToggleStatus && (
            <button
              onClick={() => onToggleStatus(currentInvoice)}
              type="button"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '3px 10px',
                borderRadius: '20px',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: status === 'Paid' ? '1.5px solid #10b981' : '1.5px solid #fbbf24',
                background: status === 'Paid' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                color: status === 'Paid' ? '#34d399' : '#fbbf24',
                transition: 'all 0.2s'
              }}
              title="Click to toggle status (Paid / Pending)"
            >
              {status === 'Paid' ? <CheckCircle2 size={13} /> : <Clock size={13} />}
              <span>{status} (Click to toggle)</span>
            </button>
          )}
        </div>

        {/* Right action buttons */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {/* Edit Bill Button */}
          {currentInvoice._id && onEditBill && (
            <button
              onClick={() => onEditBill(currentInvoice)}
              type="button"
              className="btn-outline-gold"
              style={{ padding: '7px 14px', fontSize: '0.8rem', background: 'rgba(201, 168, 76, 0.15)' }}
              title="Edit this invoice's details"
            >
              <Edit3 size={14} />
              <span>Edit Bill</span>
            </button>
          )}

          <button
            onClick={handlePrint}
            type="button"
            className="btn-outline-gold"
            style={{ padding: '7px 14px', fontSize: '0.8rem' }}
            title="Print A4 Invoice directly"
          >
            <Printer size={15} />
            <span>Print A4</span>
          </button>

          {currentInvoice._id && (
            <a
              href={`${API_BASE}/api/invoices/${currentInvoice._id}/pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold"
              style={{ padding: '7px 16px', fontSize: '0.8rem' }}
            >
              <Download size={15} />
              <span>Download PDF</span>
            </a>
          )}
        </div>
      </div>

      {/* Bill Sheet Canvas - PURE WHITE BACKGROUND, PURE BLACK TEXT AND BORDERS ONLY */}
      <div className="bill-paper-container" style={{ background: '#e2e5eb' }}>
        <div id="printable-bill" className="physical-invoice-sheet" style={{ background: '#ffffff', color: '#000000', border: '1.5px solid #000000' }}>
          
          {/* Header Box */}
          <div style={{ border: '1.5px solid #000000', padding: '10px 14px', position: 'relative', textAlign: 'center', background: '#ffffff' }}>
            {/* PAN Box on Top Right */}
            <div style={{
              position: 'absolute',
              top: '8px',
              right: '10px',
              fontSize: '11px',
              fontWeight: 700,
              color: '#000000',
              fontFamily: 'monospace',
              letterSpacing: '0.04em'
            }}>
              PAN-{pan}
            </div>

            <div style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '0.12em', color: '#000000', textTransform: 'uppercase' }}>
              INVOICE
            </div>
            
            {/* Firm Name - BP CONSULTANT */}
            <div style={{ fontSize: '19px', fontWeight: 800, color: '#000000', letterSpacing: '0.02em', marginTop: '2px' }}>
              {providerName}
            </div>

            {/* HR and Compliance directly below BP CONSULTANT */}
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#000000', letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: '2px' }}>
              {tagline}
            </div>

            <div style={{ fontSize: '11px', color: '#000000', marginTop: '3px', fontWeight: 500 }}>
              Contact : {contact}, E-mail : {email}
            </div>
          </div>

          {/* Client Details (Left) + Date & Sr. No. Box (Right) */}
          <div style={{ display: 'flex', borderLeft: '1.5px solid #000000', borderRight: '1.5px solid #000000', borderBottom: '1.5px solid #000000', minHeight: '110px' }}>
            
            {/* Left: To details */}
            <div style={{ flex: 1, padding: '10px 14px', borderRight: '1.5px solid #000000', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#000000' }}>To:</span>
                  <span style={{ fontSize: '14.5px', fontWeight: 700, color: '#000000', textDecoration: companyName ? 'none' : 'underline' }}>
                    {companyName || '...........................................................................'}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#000000', marginTop: '4px', paddingLeft: '28px', lineHeight: '1.4' }}>
                  {companyAddress ? (
                    <div>{companyAddress}</div>
                  ) : (
                    <div style={{ color: '#555', fontStyle: 'italic' }}>
                      ....................................................................................................
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', marginTop: '8px', paddingTop: '6px', borderTop: '1px dashed #777' }}>
                <span style={{ fontWeight: 700, color: '#000000' }}>Party GSTIN:</span>
                <span style={{ fontFamily: 'monospace', color: '#000000', fontWeight: 600 }}>
                  {partyGstin || '...................................................'}
                </span>
              </div>
            </div>

            {/* Right: Date & Sr. No. */}
            <div style={{ width: '180px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '10px 12px', borderBottom: '1.5px solid #000000', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#000000' }}>Date:</span>
                <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#000000', textDecoration: 'underline' }}>
                  {dateStr}
                </span>
              </div>
              <div style={{ padding: '12px 12px', display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#000000' }}>Sr. No.</span>
                <span style={{ fontSize: '17px', fontWeight: 800, color: '#000000', fontFamily: 'monospace' }}>
                  {srNo}
                </span>
              </div>
            </div>

          </div>

          {/* Line Items Table */}
          <div style={{ borderLeft: '1.5px solid #000000', borderRight: '1.5px solid #000000', borderBottom: '1.5px solid #000000', flex: 1, display: 'flex', flexDirection: 'column' }}>
            
            {/* Table Header: Pure white background, crisp black text */}
            <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 85px 90px 100px 105px', background: '#ffffff', borderBottom: '1.5px solid #000000', textAlign: 'center', fontWeight: 700, fontSize: '11px', color: '#000000' }}>
              <div style={{ padding: '8px 2px', borderRight: '1.5px solid #000000' }}>Sr.<br/>No.</div>
              <div style={{ padding: '8px 6px', borderRight: '1.5px solid #000000', textAlign: 'left' }}>Service Description</div>
              <div style={{ padding: '8px 2px', borderRight: '1.5px solid #000000' }}>No of Days /<br/>No of Bills</div>
              <div style={{ padding: '8px 4px', borderRight: '1.5px solid #000000' }}>Cost of<br/>Expence</div>
              <div style={{ padding: '8px 4px', borderRight: '1.5px solid #000000' }}>Cost of<br/>Consultancy</div>
              <div style={{ padding: '8px 4px' }}>Total<br/>Amount</div>
            </div>

            {/* Table Body */}
            <div style={{ flex: 1, minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
              {items.map((item, index) => (
                <div key={index} style={{
                  display: 'grid',
                  gridTemplateColumns: '40px 1fr 85px 90px 100px 105px',
                  borderBottom: index < items.length - 1 ? '1px solid #ddd' : 'none',
                  minHeight: '44px',
                  alignItems: 'flex-start',
                  fontSize: '12.5px',
                  color: '#000000'
                }}>
                  <div style={{ padding: '10px 4px', textAlign: 'center', borderRight: '1.5px solid #000000', height: '100%' }}>
                    {index + 1}
                  </div>
                  <div style={{ padding: '10px 10px', textAlign: 'left', borderRight: '1.5px solid #000000', height: '100%', fontWeight: 700, lineHeight: '1.4' }}>
                    {item.description}
                  </div>
                  <div style={{ padding: '10px 4px', textAlign: 'center', borderRight: '1.5px solid #000000', height: '100%' }}>
                    {item.days || '—'}
                  </div>
                  <div style={{ padding: '10px 8px', textAlign: 'right', borderRight: '1.5px solid #000000', height: '100%', fontFamily: 'monospace' }}>
                    {item.expense > 0 ? Number(item.expense).toFixed(2) : '—'}
                  </div>
                  <div style={{ padding: '10px 8px', textAlign: 'right', borderRight: '1.5px solid #000000', height: '100%', fontFamily: 'monospace', fontWeight: 600 }}>
                    {item.consultancyCost > 0 ? Number(item.consultancyCost).toFixed(2) : (item.amount ? Number(item.amount).toFixed(2) : '—')}
                  </div>
                  <div style={{ padding: '10px 8px', textAlign: 'right', height: '100%', fontFamily: 'monospace', fontWeight: 700 }}>
                    {Number(item.amount || 0).toFixed(2)}
                  </div>
                </div>
              ))}

              {/* Blank fill space for height realism */}
              <div style={{
                flex: 1,
                display: 'grid',
                gridTemplateColumns: '40px 1fr 85px 90px 100px 105px',
                minHeight: '160px'
              }}>
                <div style={{ borderRight: '1.5px solid #000000', height: '100%' }}></div>
                <div style={{ borderRight: '1.5px solid #000000', height: '100%' }}></div>
                <div style={{ borderRight: '1.5px solid #000000', height: '100%' }}></div>
                <div style={{ borderRight: '1.5px solid #000000', height: '100%' }}></div>
                <div style={{ borderRight: '1.5px solid #000000', height: '100%' }}></div>
                <div style={{ height: '100%' }}></div>
              </div>
            </div>

          </div>

          {/* Bank Details & Totals Section */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', borderLeft: '1.5px solid #000000', borderRight: '1.5px solid #000000', borderBottom: '1.5px solid #000000', background: '#ffffff' }}>
            
            {/* Bank Details (Left) */}
            <div style={{ padding: '10px 14px', borderRight: '1.5px solid #000000', fontSize: '11px', lineHeight: '1.6', color: '#000000' }}>
              <div style={{ fontWeight: 800, fontSize: '12px', marginBottom: '4px' }}>
                Bank Details :
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '85px 1fr', rowGap: '2px' }}>
                <span style={{ fontWeight: 700 }}>A/c Name</span>
                <span style={{ fontWeight: 600 }}>: {bank.accountName || providerName}</span>

                <span style={{ fontWeight: 700 }}>Bank</span>
                <span>: {bank.bankName || 'INDIAN BANK'}</span>

                <span style={{ fontWeight: 700 }}>Branch</span>
                <span>: {bank.branch || 'DINDAYAL NAGAR MORADABAD'}</span>

                <span style={{ fontWeight: 700 }}>A/C</span>
                <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>: {bank.accountNumber || '50322428417'}</span>

                <span style={{ fontWeight: 700 }}>IFSC</span>
                <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>: {bank.ifsc || 'IDIB000D554'}</span>
              </div>
            </div>

            {/* Totals Breakdown (Right) */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              
              {/* Row 1: Total Amount */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 10px', borderBottom: '1.5px solid #000000', fontSize: '12px' }}>
                <span style={{ fontWeight: 700, color: '#000000' }}>Total Amount</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#000000' }}>
                  {totalAmount.toFixed(2)}
                </span>
              </div>

              {/* Row 2: Other Charges */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 10px', borderBottom: '1.5px solid #000000', fontSize: '12px' }}>
                <span style={{ fontWeight: 700, color: '#000000' }}>Other Charges</span>
                <span style={{ fontFamily: 'monospace', color: '#000000' }}>
                  {otherCharges > 0 ? otherCharges.toFixed(2) : '—'}
                </span>
              </div>

              {/* Row 3: Grand Total */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 10px', fontSize: '13.5px', background: '#ffffff' }}>
                <span style={{ fontWeight: 800, color: '#000000' }}>Grand Total</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#000000' }}>
                  {grandTotal.toFixed(2)}
                </span>
              </div>

            </div>

          </div>

          {/* Amount in words banner */}
          <div style={{ borderLeft: '1.5px solid #000000', borderRight: '1.5px solid #000000', borderBottom: '1.5px solid #000000', padding: '7px 14px', background: '#ffffff', fontSize: '11.5px', display: 'flex', alignItems: 'center', gap: '8px', color: '#000000' }}>
            <span style={{ fontWeight: 700 }}>Amount in Words:</span>
            <span style={{ fontWeight: 700, fontStyle: 'italic' }}>{amountInWords}</span>
          </div>

          {/* Bottom Declarations (Left) & Signature (Right) */}
          <div style={{ display: 'flex', borderLeft: '1.5px solid #000000', borderRight: '1.5px solid #000000', borderBottom: '1.5px solid #000000', minHeight: '95px', background: '#ffffff' }}>
            
            {/* Left: Declaration */}
            <div style={{ flex: 1, padding: '8px 14px', borderRight: '1.5px solid #000000', fontSize: '10px', color: '#000000' }}>
              <div style={{ fontWeight: 800, fontSize: '11px', marginBottom: '3px' }}>
                Declaration
              </div>
              {declarations.map((dec, idx) => (
                <div key={idx} style={{ lineHeight: '1.4' }}>
                  • {dec}
                </div>
              ))}
            </div>

            {/* Right: Signature */}
            <div style={{ width: '190px', padding: '8px 12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#000000' }}>
                For {providerName}
              </div>

              <div style={{ height: '35px' }}></div>

              <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#000000', borderTop: '1px solid #000000', paddingTop: '3px' }}>
                Auth. Signatory
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
