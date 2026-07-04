import React from 'react';

/**
 * Rapports Print Template
 * Generates professional A4 documents for the reports module
 */
export function RapportsPrintTemplate({ stats, period, documentNumber }) {
  const companyInfo = {
    name: "Marbre & Pierre",
    logo: "🏛️",
    address: "123 Rue du Commerce, Tunis",
    phone: "+216 71 123 456",
    email: "contact@marbre-pierre.tn",
    matriculeFiscal: "1234567/A/M/000",
    registreCommerce: "B1234567890"
  };

  const printDate = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const printTime = new Date().toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return `
    <div class="print-document">
      <div class="print-header">
        <div class="print-header-left">
          <div class="company-logo">${companyInfo.logo}</div>
          <div class="company-info">
            <h1 class="company-name">${companyInfo.name}</h1>
            <p class="company-address">${companyInfo.address}</p>
            <p class="company-contact">
              <span>Tél: ${companyInfo.phone}</span>
              <span>Email: ${companyInfo.email}</span>
            </p>
            <p class="company-legal">
              <span>MF: ${companyInfo.matriculeFiscal}</span>
              <span>RC: ${companyInfo.registreCommerce}</span>
            </p>
          </div>
        </div>
        <div class="print-header-right">
          <div class="document-meta">
            <div class="meta-row">
              <span class="meta-label">Date d'impression:</span>
              <span class="meta-value">${printDate} à ${printTime}</span>
            </div>
            ${documentNumber ? `
            <div class="meta-row">
              <span class="meta-label">N° Document:</span>
              <span class="meta-value">${documentNumber}</span>
            </div>
            ` : ''}
            ${period ? `
            <div class="meta-row">
              <span class="meta-label">Période:</span>
              <span class="meta-value">${period}</span>
            </div>
            ` : ''}
          </div>
        </div>
      </div>

      <div class="print-title">
        <h2>RAPPORT GÉNÉRAL</h2>
      </div>

      <div class="print-content">
        <div class="print-info-box">
          <div class="print-info-box-title">INDICATEURS CLÉS</div>
          <div class="print-grid-3">
            <div class="print-info-row">
              <span class="print-info-label">Chiffre d'affaires</span>
              <span class="print-info-value print-money">${stats.totalCA?.toFixed(2) || '0.00'} €</span>
            </div>
            <div class="print-info-row">
              <span class="print-info-label">Total Achats</span>
              <span class="print-info-value print-money">${stats.totalAchats?.toFixed(2) || '0.00'} €</span>
            </div>
            <div class="print-info-row">
              <span class="print-info-label">Total Dépenses</span>
              <span class="print-info-value print-money">${stats.totalExpenses?.toFixed(2) || '0.00'} €</span>
            </div>
            <div class="print-info-row">
              <span class="print-info-label">Marge</span>
              <span class="print-info-value print-money">${stats.netProfit?.toFixed(2) || '0.00'} €</span>
            </div>
            <div class="print-info-row">
              <span class="print-info-label">Encaissements</span>
              <span class="print-info-value print-money">${stats.totalCollected?.toFixed(2) || '0.00'} €</span>
            </div>
            <div class="print-info-row">
              <span class="print-info-label">Clients actifs</span>
              <span class="print-info-value">${stats.totalClients || 0}</span>
            </div>
          </div>
        </div>

        <div class="print-section">
          <div class="print-section-title">SYNTHÈSE DES FLUX</div>
          <table class="print-table">
            <thead>
              <tr>
                <th>Indicateur</th>
                <th class="text-right">Valeur</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Chiffre d'affaires</td>
                <td class="text-right print-money">${stats.totalCA?.toFixed(2) || '0.00'} €</td>
              </tr>
              <tr>
                <td>Achats</td>
                <td class="text-right print-money">${stats.totalAchats?.toFixed(2) || '0.00'} €</td>
              </tr>
              <tr>
                <td>Dépenses</td>
                <td class="text-right print-money">${stats.totalExpenses?.toFixed(2) || '0.00'} €</td>
              </tr>
              <tr>
                <td>Bénéfice net</td>
                <td class="text-right print-money">${stats.netProfit?.toFixed(2) || '0.00'} €</td>
              </tr>
              <tr>
                <td>Encaissements</td>
                <td class="text-right print-money">${stats.totalCollected?.toFixed(2) || '0.00'} €</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="print-footer">
        <div class="footer-left">
          <p>Document généré automatiquement par ERP PRO</p>
        </div>
        <div class="footer-right">
          <p>Page <span class="page-number">1</span>/1</p>
          <p class="print-date-footer">${printDate}</p>
        </div>
      </div>
    </div>
  `;
}
