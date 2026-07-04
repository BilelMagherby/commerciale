import React from 'react';

/**
 * Historique Print Template
 * Generates professional A4 documents for history reports
 */
export function HistoriquePrintTemplate({ historique, period, documentNumber }) {
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
      <!-- Header -->
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

      <!-- Title -->
      <div class="print-title">
        <h2>RAPPORT HISTORIQUE</h2>
      </div>

      <!-- Content -->
      <div class="print-content">
        <!-- Summary Box -->
        <div class="print-info-box">
          <div class="print-info-box-title">RÉSUMÉ</div>
          <div class="print-info-row">
            <span class="print-info-label">Total Actions:</span>
            <span class="print-info-value">${historique.length}</span>
          </div>
        </div>

        <!-- Table -->
        <table class="print-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Description</th>
              <th>Utilisateur</th>
              <th class="text-center">Statut</th>
            </tr>
          </thead>
          <tbody>
            ${historique.map((action) => `
              <tr>
                <td>${action.date}</td>
                <td>${action.type || 'N/A'}</td>
                <td>${action.description || 'N/A'}</td>
                <td>${action.utilisateur || 'N/A'}</td>
                <td class="text-center">
                  <span class="print-status ${action.statut?.toLowerCase() || 'succes'}">${action.statut || 'Succès'}</span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Footer -->
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
