import React from 'react';

/**
 * Ventes Print Template
 * Generates professional A4 documents for sales reports, invoices, and individual sale details
 */
export function VentesListPrintTemplate({ ventes, period, documentNumber }) {
  const totalMontant = ventes.reduce((sum, v) => sum + v.total, 0);
  const totalPaye = ventes.filter(v => v.statut === 'Payé').reduce((sum, v) => sum + v.total, 0);
  const totalEnAttente = ventes.filter(v => v.statut === 'En attente').reduce((sum, v) => sum + v.total, 0);

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
        <h2>RAPPORT DES VENTES</h2>
      </div>

      <!-- Content -->
      <div class="print-content">
        <!-- Summary Box -->
        <div class="print-info-box">
          <div class="print-info-box-title">RÉSUMÉ</div>
          <div class="print-grid-3">
            <div class="print-info-row">
              <span class="print-info-label">Total Ventes:</span>
              <span class="print-info-value print-money">${totalMontant.toFixed(2)} €</span>
            </div>
            <div class="print-info-row">
              <span class="print-info-label">Payé:</span>
              <span class="print-info-value print-money">${totalPaye.toFixed(2)} €</span>
            </div>
            <div class="print-info-row">
              <span class="print-info-label">En Attente:</span>
              <span class="print-info-value print-money">${totalEnAttente.toFixed(2)} €</span>
            </div>
          </div>
        </div>

        <!-- Table -->
        <table class="print-table">
          <thead>
            <tr>
              <th>Facture</th>
              <th>Client</th>
              <th>Date</th>
              <th class="text-right">Montant</th>
              <th class="text-center">Statut</th>
            </tr>
          </thead>
          <tbody>
            ${ventes.map((vente) => `
              <tr>
                <td class="text-bold">${vente.facture}</td>
                <td>${vente.client}</td>
                <td>${vente.date}</td>
                <td class="text-right print-money">${vente.total.toFixed(2)} €</td>
                <td class="text-center">
                  <span class="print-status ${vente.statut.toLowerCase().replace(' ', '-')}">${vente.statut}</span>
                </td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr class="total-row">
              <td colspan="3" class="text-right">TOTAL GÉNÉRAL:</td>
              <td class="text-right print-money">${totalMontant.toFixed(2)} €</td>
              <td></td>
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

export function VenteDetailPrintTemplate({ vente, client }) {
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
            <div class="meta-row">
              <span class="meta-label">N° Facture:</span>
              <span class="meta-value">${vente.facture}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Title -->
      <div class="print-title">
        <h2>FACTURE</h2>
      </div>

      <!-- Content -->
      <div class="print-content">
        <!-- Client Info -->
        <div class="print-info-box">
          <div class="print-info-box-title">INFORMATIONS CLIENT</div>
          <div class="print-grid-2">
            <div class="print-info-row">
              <span class="print-info-label">Nom:</span>
              <span class="print-info-value">${vente.client}</span>
            </div>
            <div class="print-info-row">
              <span class="print-info-label">Téléphone:</span>
              <span class="print-info-value">${client?.telephonePrincipal || 'N/A'}</span>
            </div>
            <div class="print-info-row">
              <span class="print-info-label">Email:</span>
              <span class="print-info-value">${client?.email || 'N/A'}</span>
            </div>
            <div class="print-info-row">
              <span class="print-info-label">Adresse:</span>
              <span class="print-info-value">${client?.adresseComplete || 'N/A'}</span>
            </div>
          </div>
        </div>

        <!-- Invoice Info -->
        <div class="print-info-box">
          <div class="print-info-box-title">INFORMATIONS FACTURE</div>
          <div class="print-grid-2">
            <div class="print-info-row">
              <span class="print-info-label">N° Facture:</span>
              <span class="print-info-value text-bold">${vente.facture}</span>
            </div>
            <div class="print-info-row">
              <span class="print-info-label">Date:</span>
              <span class="print-info-value">${vente.date}</span>
            </div>
            <div class="print-info-row">
              <span class="print-info-label">Montant HT:</span>
              <span class="print-info-value print-money">${(vente.total / 1.19).toFixed(2)} €</span>
            </div>
            <div class="print-info-row">
              <span class="print-info-label">TVA (19%):</span>
              <span class="print-info-value print-money">${((vente.total / 1.19) * 0.19).toFixed(2)} €</span>
            </div>
            <div class="print-info-row">
              <span class="print-info-label">Montant TTC:</span>
              <span class="print-info-value print-money">${vente.total.toFixed(2)} €</span>
            </div>
            <div class="print-info-row">
              <span class="print-info-label">Statut:</span>
              <span class="print-info-value">
                <span class="print-status ${vente.statut.toLowerCase().replace(' ', '-')}">${vente.statut}</span>
              </span>
            </div>
          </div>
        </div>

        <!-- Items -->
        ${vente.items && vente.items.length > 0 ? `
        <div class="print-section">
          <div class="print-section-title">ARTICLES</div>
          <table class="print-table">
            <thead>
              <tr>
                <th>Description</th>
                <th class="text-center">Quantité</th>
                <th class="text-right">Prix Unitaire</th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${vente.items.map((item, idx) => `
                <tr>
                  <td>${item.description}</td>
                  <td class="text-center">${item.quantite}</td>
                  <td class="text-right print-money">${item.prixUnitaire.toFixed(2)} €</td>
                  <td class="text-right print-money">${item.total.toFixed(2)} €</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr class="subtotal-row">
                <td colspan="3" class="text-right">Sous-total HT:</td>
                <td class="text-right print-money">${(vente.total / 1.19).toFixed(2)} €</td>
              </tr>
              <tr>
                <td colspan="3" class="text-right">TVA (19%):</td>
                <td class="text-right print-money">${((vente.total / 1.19) * 0.19).toFixed(2)} €</td>
              </tr>
              <tr class="total-row">
                <td colspan="3" class="text-right">TOTAL TTC:</td>
                <td class="text-right print-money">${vente.total.toFixed(2)} €</td>
              </tr>
            </tfoot>
          </table>
        </div>
        ` : ''}

        ${vente.notes ? `
        <div class="print-info-box">
          <div class="print-info-box-title">NOTES</div>
          <p>${vente.notes}</p>
        </div>
        ` : ''}

        <!-- Signatures -->
        <div class="print-signatures">
          <div class="print-signature">
            <div class="print-signature-line">Signature Client</div>
          </div>
          <div class="print-signature">
            <div class="print-signature-line">Signature Responsable</div>
          </div>
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
