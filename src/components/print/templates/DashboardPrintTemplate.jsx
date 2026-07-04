import React from 'react';

/**
 * Dashboard Print Template
 * Generates professional A4 documents for activity reports
 */
export function DashboardPrintTemplate({ stats, period, documentNumber }) {
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
        <h2>RAPPORT D'ACTIVITÉ</h2>
      </div>

      <!-- Content -->
      <div class="print-content">
        <!-- Summary Stats -->
        <div class="print-info-box">
          <div class="print-info-box-title">RÉSUMÉ GÉNÉRAL</div>
          <div class="print-grid-3">
            <div class="print-info-row">
              <span class="print-info-label">Ventes:</span>
              <span class="print-info-value print-money">${stats.totalVentes?.toFixed(2) || '0.00'} €</span>
            </div>
            <div class="print-info-row">
              <span class="print-info-label">Achats:</span>
              <span class="print-info-value print-money">${stats.totalAchats?.toFixed(2) || '0.00'} €</span>
            </div>
            <div class="print-info-row">
              <span class="print-info-label">Dépenses:</span>
              <span class="print-info-value print-money">${stats.totalDepenses?.toFixed(2) || '0.00'} €</span>
            </div>
            <div class="print-info-row">
              <span class="print-info-label">Clients:</span>
              <span class="print-info-value">${stats.totalClients || 0}</span>
            </div>
            <div class="print-info-row">
              <span class="print-info-label">Fournisseurs:</span>
              <span class="print-info-value">${stats.totalFournisseurs || 0}</span>
            </div>
            <div class="print-info-row">
              <span class="print-info-label">Employés:</span>
              <span class="print-info-value">${stats.totalEmployes || 0}</span>
            </div>
          </div>
        </div>

        <!-- Detailed Stats Table -->
        <div class="print-section">
          <div class="print-section-title">DÉTAILS PAR CATÉGORIE</div>
          <table class="print-table">
            <thead>
              <tr>
                <th>Catégorie</th>
                <th class="text-right">Montant</th>
                <th class="text-center">Statut</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Ventes Payées</td>
                <td class="text-right print-money">${stats.ventesPayees?.toFixed(2) || '0.00'} €</td>
                <td class="text-center"><span class="print-status paye">Payé</span></td>
              </tr>
              <tr>
                <td>Ventes En Attente</td>
                <td class="text-right print-money">${stats.ventesEnAttente?.toFixed(2) || '0.00'} €</td>
                <td class="text-center"><span class="print-status en-attente">En attente</span></td>
              </tr>
              <tr>
                <td>Achats Payés</td>
                <td class="text-right print-money">${stats.achatsPayes?.toFixed(2) || '0.00'} €</td>
                <td class="text-center"><span class="print-status paye">Payé</span></td>
              </tr>
              <tr>
                <td>Achats En Attente</td>
                <td class="text-right print-money">${stats.achatsEnAttente?.toFixed(2) || '0.00'} €</td>
                <td class="text-center"><span class="print-status en-attente">En attente</span></td>
              </tr>
              <tr>
                <td>Paiements Reçus</td>
                <td class="text-right print-money">${stats.paiementsRecus?.toFixed(2) || '0.00'} €</td>
                <td class="text-center"><span class="print-status paye">Payé</span></td>
              </tr>
              <tr>
                <td>Dépenses Totales</td>
                <td class="text-right print-money">${stats.totalDepenses?.toFixed(2) || '0.00'} €</td>
                <td class="text-center"><span class="print-status paye">Payé</span></td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="total-row">
                <td class="text-right">BÉNÉFICE NET:</td>
                <td class="text-right print-money">${((stats.totalVentes || 0) - (stats.totalAchats || 0) - (stats.totalDepenses || 0)).toFixed(2)} €</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <!-- Recent Activity -->
        <div class="print-section">
          <div class="print-section-title">ACTIVITÉ RÉCENTE</div>
          <table class="print-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Description</th>
                <th>Date</th>
                <th class="text-right">Montant</th>
              </tr>
            </thead>
            <tbody>
              ${stats.recentActivity?.map((activity) => `
                <tr>
                  <td>${activity.type}</td>
                  <td>${activity.description}</td>
                  <td>${activity.date}</td>
                  <td class="text-right print-money">${activity.montant?.toFixed(2) || '0.00'} €</td>
                </tr>
              `).join('') || '<tr><td colspan="4" class="text-center">Aucune activité récente</td></tr>'}
            </tbody>
          </table>
        </div>
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
