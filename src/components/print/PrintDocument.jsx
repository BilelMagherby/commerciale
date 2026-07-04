import React from 'react';

/**
 * Base Print Document Component
 * Provides the standard A4 document structure with company header and footer
 */
export default function PrintDocument({ 
  children, 
  title, 
  documentNumber, 
  period,
  showHeader = true,
  showFooter = true,
  className = ""
}) {
  const printDate = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  
  const printTime = new Date().toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const companyInfo = {
    name: "Marbre & Pierre",
    logo: "🏛️",
    address: "123 Rue du Commerce, Tunis",
    phone: "+216 71 123 456",
    email: "contact@marbre-pierre.tn",
    matriculeFiscal: "1234567/A/M/000",
    registreCommerce: "B1234567890"
  };

  return (
    <div className={`print-document ${className}`}>
      {showHeader && (
        <div className="print-header">
          <div className="print-header-left">
            <div className="company-logo">{companyInfo.logo}</div>
            <div className="company-info">
              <h1 className="company-name">{companyInfo.name}</h1>
              <p className="company-address">{companyInfo.address}</p>
              <p className="company-contact">
                <span>Tél: {companyInfo.phone}</span>
                <span>Email: {companyInfo.email}</span>
              </p>
              <p className="company-legal">
                <span>MF: {companyInfo.matriculeFiscal}</span>
                <span>RC: {companyInfo.registreCommerce}</span>
              </p>
            </div>
          </div>
          <div className="print-header-right">
            <div className="document-meta">
              <div className="meta-row">
                <span className="meta-label">Date d'impression:</span>
                <span className="meta-value">{printDate} à {printTime}</span>
              </div>
              {documentNumber && (
                <div className="meta-row">
                  <span className="meta-label">N° Document:</span>
                  <span className="meta-value">{documentNumber}</span>
                </div>
              )}
              {period && (
                <div className="meta-row">
                  <span className="meta-label">Période:</span>
                  <span className="meta-value">{period}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="print-title">
        <h2>{title}</h2>
      </div>

      <div className="print-content">
        {children}
      </div>

      {showFooter && (
        <div className="print-footer">
          <div className="footer-left">
            <p>Document généré automatiquement par ERP PRO</p>
          </div>
          <div className="footer-right">
            <p>Page <span className="page-number"></span></p>
            <p className="print-date-footer">{printDate}</p>
          </div>
        </div>
      )}
    </div>
  );
}
