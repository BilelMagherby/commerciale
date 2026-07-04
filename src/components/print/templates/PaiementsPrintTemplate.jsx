import React from 'react';

const companyInfo = {
  name: "Marbre & Pierre",
  logo: "🏛️",
  address: "123 Rue du Commerce, Tunis",
  phone: "+216 71 123 456",
  email: "contact@marbre-pierre.tn",
  matriculeFiscal: "1234567/A/M/000",
  registreCommerce: "B1234567890"
};

const getPrintDate = () => new Date().toLocaleDateString('fr-FR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric'
});

const getPrintTime = () => new Date().toLocaleTimeString('fr-FR', {
  hour: '2-digit',
  minute: '2-digit'
});

const renderHeader = (printDate, printTime, period, documentNumber) => `
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
`;

const renderFooter = (printDate) => `
      <div class="print-footer">
        <div class="footer-left">
          <p>Document généré automatiquement par ERP PRO</p>
        </div>
        <div class="footer-right">
          <p>Page <span class="page-number">1</span>/1</p>
          <p class="print-date-footer">${printDate}</p>
        </div>
      </div>
`;

export function PaiementsClientsPrintTemplate({ paiements, period, documentNumber }) {
  const totalMontant = paiements.reduce((sum, p) => sum + p.montant, 0);
  const printDate = getPrintDate();
  const printTime = getPrintTime();

  return `
    <div class="print-document">
      ${renderHeader(printDate, printTime, period, documentNumber)}
      <div class="print-title">
        <h2>RAPPORT DES PAIEMENTS CLIENTS</h2>
      </div>
      <div class="print-content">
        <div class="print-info-box">
          <div class="print-info-box-title">RÉSUMÉ</div>
          <div class="print-info-row">
            <span class="print-info-label">Total encaissé:</span>
            <span class="print-info-value print-money">${totalMontant.toFixed(2)} €</span>
          </div>
          <div class="print-info-row">
            <span class="print-info-label">Nombre de paiements:</span>
            <span class="print-info-value">${paiements.length}</span>
          </div>
        </div>
        <table class="print-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Facture</th>
              <th>Date</th>
              <th class="text-right">Montant</th>
              <th class="text-center">Statut</th>
            </tr>
          </thead>
          <tbody>
            ${paiements.map(paiement => `
              <tr>
                <td>${paiement.client}</td>
                <td>${paiement.facture}</td>
                <td>${paiement.date}</td>
                <td class="text-right print-money">${paiement.montant.toFixed(2)} €</td>
                <td class="text-center">${paiement.statut || 'N/A'}</td>
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
      ${renderFooter(printDate)}
    </div>
  `;
}

export function PaiementsFournisseursPrintTemplate({ paiements, period, documentNumber }) {
  const totalMontant = paiements.reduce((sum, p) => sum + p.montant, 0);
  const printDate = getPrintDate();
  const printTime = getPrintTime();

  return `
    <div class="print-document">
      ${renderHeader(printDate, printTime, period, documentNumber)}
      <div class="print-title">
        <h2>RAPPORT DES PAIEMENTS FOURNISSEURS</h2>
      </div>
      <div class="print-content">
        <div class="print-info-box">
          <div class="print-info-box-title">RÉSUMÉ</div>
          <div class="print-info-row">
            <span class="print-info-label">Total décaissement:</span>
            <span class="print-info-value print-money">${totalMontant.toFixed(2)} €</span>
          </div>
          <div class="print-info-row">
            <span class="print-info-label">Nombre de paiements:</span>
            <span class="print-info-value">${paiements.length}</span>
          </div>
        </div>
        <table class="print-table">
          <thead>
            <tr>
              <th>Fournisseur</th>
              <th>Date</th>
              <th class="text-right">Montant</th>
              <th class="text-center">Statut</th>
            </tr>
          </thead>
          <tbody>
            ${paiements.map(paiement => `
              <tr>
                <td>${paiement.fournisseur}</td>
                <td>${paiement.date}</td>
                <td class="text-right print-money">${paiement.montant.toFixed(2)} €</td>
                <td class="text-center">${paiement.statut || 'N/A'}</td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr class="total-row">
              <td colspan="2" class="text-right">TOTAL GÉNÉRAL:</td>
              <td class="text-right print-money">${totalMontant.toFixed(2)} €</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
      ${renderFooter(printDate)}
    </div>
  `;
}

export function PaiementsTransactionsPrintTemplate({ transactions, period, documentNumber }) {
  const totalMontant = transactions.reduce((sum, t) => sum + t.montant, 0);
  const printDate = getPrintDate();
  const printTime = getPrintTime();

  return `
    <div class="print-document">
      ${renderHeader(printDate, printTime, period, documentNumber)}
      <div class="print-title">
        <h2>JOURNAL DES TRANSACTIONS</h2>
      </div>
      <div class="print-content">
        <div class="print-info-box">
          <div class="print-info-box-title">RÉSUMÉ</div>
          <div class="print-info-row">
            <span class="print-info-label">Total transactions:</span>
            <span class="print-info-value print-money">${totalMontant.toFixed(2)} €</span>
          </div>
          <div class="print-info-row">
            <span class="print-info-label">Nombre de transactions:</span>
            <span class="print-info-value">${transactions.length}</span>
          </div>
        </div>
        <table class="print-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Description</th>
              <th class="text-right">Montant</th>
              <th class="text-center">Statut</th>
            </tr>
          </thead>
          <tbody>
            ${transactions.map(transaction => `
              <tr>
                <td>${transaction.date}</td>
                <td>${transaction.type}</td>
                <td>${transaction.description}</td>
                <td class="text-right print-money">${transaction.montant.toFixed(2)} €</td>
                <td class="text-center">${transaction.statut || 'N/A'}</td>
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
      ${renderFooter(printDate)}
    </div>
  `;
}

export function PaiementClientDetailPrintTemplate({ paiement }) {
  const printDate = getPrintDate();
  const printTime = getPrintTime();

  return `
    <div class="print-document">
      ${renderHeader(printDate, printTime)}
      <div class="print-title">
        <h2>DETAIL PAIEMENT CLIENT</h2>
      </div>
      <div class="print-content">
        <div class="print-info-box">
          <div class="print-info-box-title">Informations Client</div>
          <div class="print-grid-2">
            <div class="print-info-row">
              <span class="print-info-label">Client:</span>
              <span class="print-info-value">${paiement.client}</span>
            </div>
            <div class="print-info-row">
              <span class="print-info-label">Facture:</span>
              <span class="print-info-value">${paiement.facture}</span>
            </div>
            <div class="print-info-row">
              <span class="print-info-label">Date:</span>
              <span class="print-info-value">${paiement.date}</span>
            </div>
            <div class="print-info-row">
              <span class="print-info-label">Montant:</span>
              <span class="print-info-value print-money">${paiement.montant.toFixed(2)} €</span>
            </div>
            <div class="print-info-row">
              <span class="print-info-label">Statut:</span>
              <span class="print-info-value">${paiement.statut || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
      ${renderFooter(printDate)}
    </div>
  `;
}

export function PaiementFournisseurDetailPrintTemplate({ paiement }) {
  const printDate = getPrintDate();
  const printTime = getPrintTime();

  return `
    <div class="print-document">
      ${renderHeader(printDate, printTime)}
      <div class="print-title">
        <h2>DETAIL PAIEMENT FOURNISSEUR</h2>
      </div>
      <div class="print-content">
        <div class="print-info-box">
          <div class="print-info-box-title">Informations Fournisseur</div>
          <div class="print-grid-2">
            <div class="print-info-row">
              <span class="print-info-label">Fournisseur:</span>
              <span class="print-info-value">${paiement.fournisseur}</span>
            </div>
            <div class="print-info-row">
              <span class="print-info-label">Date:</span>
              <span class="print-info-value">${paiement.date}</span>
            </div>
            <div class="print-info-row">
              <span class="print-info-label">Montant:</span>
              <span class="print-info-value print-money">${paiement.montant.toFixed(2)} €</span>
            </div>
            <div class="print-info-row">
              <span class="print-info-label">Statut:</span>
              <span class="print-info-value">${paiement.statut || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
      ${renderFooter(printDate)}
    </div>
  `;
}

export function TransactionDetailPrintTemplate({ transaction }) {
  const printDate = getPrintDate();
  const printTime = getPrintTime();

  return `
    <div class="print-document">
      ${renderHeader(printDate, printTime)}
      <div class="print-title">
        <h2>DETAIL TRANSACTION</h2>
      </div>
      <div class="print-content">
        <div class="print-info-box">
          <div class="print-info-box-title">Informations Transaction</div>
          <div class="print-grid-2">
            <div class="print-info-row">
              <span class="print-info-label">Date:</span>
              <span class="print-info-value">${transaction.date}</span>
            </div>
            <div class="print-info-row">
              <span class="print-info-label">Type:</span>
              <span class="print-info-value">${transaction.type}</span>
            </div>
            <div class="print-info-row">
              <span class="print-info-label">Description:</span>
              <span class="print-info-value">${transaction.description}</span>
            </div>
            <div class="print-info-row">
              <span class="print-info-label">Montant:</span>
              <span class="print-info-value print-money">${transaction.montant.toFixed(2)} €</span>
            </div>
            <div class="print-info-row">
              <span class="print-info-label">Statut:</span>
              <span class="print-info-value">${transaction.statut || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
      ${renderFooter(printDate)}
    </div>
  `;
}
