import React from 'react';

/**
 * Dépenses Print Template
 * Generates professional A4 documents for expense reports
 */
export function DepensesListPrintTemplate({ depenses, period, documentNumber }) {
  const totalMontant = depenses.reduce((sum, d) => sum + d.montant, 0);

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
        <h2>RAPPORT DES DÉPENSES</h2>
      </div>

      <!-- Content -->
      <div class="print-content">
        <!-- Summary Box -->
        <div class="print-info-box">
          <div class="print-info-box-title">RÉSUMÉ</div>
          <div class="print-info-row">
            <span class="print-info-label">Total Dépenses:</span>
            <span class="print-info-value print-money">${totalMontant.toFixed(2)} €</span>
          </div>
          <div class="print-info-row">
            <span class="print-info-label">Nombre de dépenses:</span>
            <span class="print-info-value">${depenses.length}</span>
          </div>
        </div>

        <!-- Table -->
        <table class="print-table">
          <thead>
            <tr>
              <th>Référence</th>
              <th>Catégorie</th>
              <th>Description</th>
              <th>Date</th>
              <th class="text-right">Montant</th>
            </tr>
          </thead>
          <tbody>
            ${depenses.map((depense) => `
              <tr>
                <td class="text-bold">${depense.reference || 'N/A'}</td>
                <td>${depense.categorie || 'N/A'}</td>
                <td>${depense.description || 'N/A'}</td>
                <td>${depense.date}</td>
                <td class="text-right print-money">${depense.montant.toFixed(2)} €</td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr class="total-row">
              <td colspan="4" class="text-right">TOTAL GÉNÉRAL:</td>
              <td class="text-right print-money">${totalMontant.toFixed(2)} €</td>
            </tr>
          </tfoot>
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

export function DepenseDetailPrintTemplate({ depense }) {
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
            <div class="meta-row">
              <span class="meta-label">Référence:</span>
              <span class="meta-value">${depense.reference || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="print-title">
        <h2>FICHE DE DÉPENSE</h2>
      </div>
      <div class="print-content">
        <div class="print-info-box">
          <div class="print-info-box-title">Détails de la dépense</div>
          <div class="print-info-row">
            <span class="print-info-label">Catégorie:</span>
            <span class="print-info-value">${depense.categorie || 'N/A'}</span>
          </div>
          <div class="print-info-row">
            <span class="print-info-label">Description:</span>
            <span class="print-info-value">${depense.description || 'N/A'}</span>
          </div>
          <div class="print-info-row">
            <span class="print-info-label">Montant:</span>
            <span class="print-info-value print-money">${depense.montant.toFixed(2)} €</span>
          </div>
          <div class="print-info-row">
            <span class="print-info-label">Date:</span>
            <span class="print-info-value">${depense.date}</span>
          </div>
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
