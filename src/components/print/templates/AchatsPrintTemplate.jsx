import React from 'react';

/**
 * Achats Print Template
 * Generates professional A4 documents for purchase reports and individual purchase details
 */
export function AchatsListPrintTemplate({ achats, period, documentNumber }) {
  const totalMontant = achats.reduce((sum, a) => sum + a.montant, 0);
  const totalPaye = achats.filter(a => a.statut === 'Payé').reduce((sum, a) => sum + a.montant, 0);
  const totalEnAttente = achats.filter(a => a.statut === 'En attente').reduce((sum, a) => sum + a.montant, 0);

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
        <h2>RAPPORT DES ACHATS</h2>
      </div>

      <!-- Content -->
      <div class="print-content">
        <!-- Summary Box -->
        <div class="print-info-box">
          <div class="print-info-box-title">RÉSUMÉ</div>
          <div class="print-grid-3">
            <div class="print-info-row">
              <span class="print-info-label">Total Achats:</span>
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
              <th>Référence</th>
              <th>Fournisseur</th>
              <th>Date</th>
              <th class="text-right">Montant</th>
              <th class="text-center">Statut</th>
            </tr>
          </thead>
          <tbody>
            ${achats.map((achat) => `
              <tr>
                <td class="text-bold">${achat.reference}</td>
                <td>${achat.fournisseur}</td>
                <td>${achat.date}</td>
                <td class="text-right print-money">${achat.montant.toFixed(2)} €</td>
                <td class="text-center">
                  <span class="print-status ${achat.statut.toLowerCase().replace(' ', '-')}">${achat.statut}</span>
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

export function AchatDetailPrintTemplate({ achat, fournisseur }) {
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
              <span class="meta-label">N° Document:</span>
              <span class="meta-value">${achat.reference}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Title -->
      <div class="print-title">
        <h2>DÉTAIL ACHAT</h2>
      </div>

      <!-- Content -->
      <div class="print-content">
        <!-- Supplier Info -->
        <div class="print-info-box">
          <div class="print-info-box-title">INFORMATIONS FOURNISSEUR</div>
          <div class="print-grid-2">
            <div class="print-info-row">
              <span class="print-info-label">Nom:</span>
              <span class="print-info-value">${achat.fournisseur}</span>
            </div>
            <div class="print-info-row">
              <span class="print-info-label">Matricule Fiscal:</span>
              <span class="print-info-value">${achat.matriculeFiscale || 'N/A'}</span>
            </div>
          </div>
        </div>

        <!-- Purchase Info -->
        <div class="print-info-box">
          <div class="print-info-box-title">INFORMATIONS ACHAT</div>
          <div class="print-grid-2">
            <div class="print-info-row">
              <span class="print-info-label">Référence:</span>
              <span class="print-info-value text-bold">${achat.reference}</span>
            </div>
            <div class="print-info-row">
              <span class="print-info-label">Date:</span>
              <span class="print-info-value">${achat.date}</span>
            </div>
            <div class="print-info-row">
              <span class="print-info-label">Montant:</span>
              <span class="print-info-value print-money">${achat.montant.toFixed(2)} €</span>
            </div>
            <div class="print-info-row">
              <span class="print-info-label">Statut:</span>
              <span class="print-info-value">
                <span class="print-status ${achat.statut.toLowerCase().replace(' ', '-')}">${achat.statut}</span>
              </span>
            </div>
          </div>
        </div>

        <!-- Articles -->
        ${achat.articles && achat.articles.length > 0 ? `
        <div class="print-section">
          <div class="print-section-title">ARTICLES</div>
          <table class="print-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th class="text-center">Quantité</th>
                <th class="text-center">Largeur</th>
                <th class="text-center">Longueur</th>
                <th class="text-right">Prix Unitaire</th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${achat.articles.map((article, idx) => `
                <tr>
                  <td>${article.nom}</td>
                  <td class="text-center">${article.quantite}</td>
                  <td class="text-center">${article.largeur || '-'} m</td>
                  <td class="text-center">${article.longueur || '-'} m</td>
                  <td class="text-right print-money">${article.prixUnitaire.toFixed(2)} €</td>
                  <td class="text-right print-money">${article.total ? article.total.toFixed(2) : (article.quantite * article.prixUnitaire).toFixed(2)} €</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr class="total-row">
                <td colspan="5" class="text-right">TOTAL:</td>
                <td class="text-right print-money">${achat.montant.toFixed(2)} €</td>
              </tr>
            </tfoot>
          </table>
        </div>
        ` : ''}

        ${achat.notes ? `
        <div class="print-info-box">
          <div class="print-info-box-title">NOTES</div>
          <p>${achat.notes}</p>
        </div>
        ` : ''}

        <!-- Signatures -->
        <div class="print-signatures">
          <div class="print-signature">
            <div class="print-signature-line">Signature Fournisseur</div>
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

export function BonCommandePrintTemplate({ bonCommande }) {
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
              <span class="meta-label">N° Bon:</span>
              <span class="meta-value">${bonCommande.numero}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="print-title">
        <h2>BON DE COMMANDE</h2>
      </div>

      <div class="print-content">
        <div class="print-info-box">
          <div class="print-info-box-title">INFORMATIONS FOURNISSEUR</div>
          <div class="print-grid-2">
            <div class="print-info-row">
              <span class="print-info-label">Fournisseur:</span>
              <span class="print-info-value">${bonCommande.fournisseur}</span>
            </div>
            <div class="print-info-row">
              <span class="print-info-label">Date d'émission:</span>
              <span class="print-info-value">${bonCommande.date}</span>
            </div>
            <div class="print-info-row">
              <span class="print-info-label">Priorité:</span>
              <span class="print-info-value">${bonCommande.priorite}</span>
            </div>
            <div class="print-info-row">
              <span class="print-info-label">Date livraison prévue:</span>
              <span class="print-info-value">${bonCommande.dateLivraisonPrevue || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div class="print-info-box">
          <div class="print-info-box-title">STATUT</div>
          <div class="print-info-row">
            <span class="print-info-label">Livraison:</span>
            <span class="print-info-value">
              <span class="print-status ${bonCommande.statut.toLowerCase().replace(' ', '-')}">${bonCommande.statut}</span>
            </span>
          </div>
        </div>

        ${bonCommande.articles && bonCommande.articles.length > 0 ? `
        <div class="print-section">
          <div class="print-section-title">ARTICLES COMMANDÉS</div>
          <table class="print-table">
            <thead>
              <tr>
                <th>Article</th>
                <th class="text-center">Quantité</th>
                <th class="text-right">Prix Unitaire</th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${bonCommande.articles.map((article) => `
                <tr>
                  <td>${article.nom}</td>
                  <td class="text-center">${article.quantite}</td>
                  <td class="text-right print-money">${article.prixUnitaire ? article.prixUnitaire.toFixed(2) : '0.00'} €</td>
                  <td class="text-right print-money">${article.total ? article.total.toFixed(2) : '0.00'} €</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr class="total-row">
                <td colspan="3" class="text-right">TOTAL:</td>
                <td class="text-right print-money">${bonCommande.montant ? bonCommande.montant.toFixed(2) : '0.00'} €</td>
              </tr>
            </tfoot>
          </table>
        </div>
        ` : ''}

        <div class="print-signatures">
          <div class="print-signature">
            <div class="print-signature-line">Signature Fournisseur</div>
          </div>
          <div class="print-signature">
            <div class="print-signature-line">Signature Responsable</div>
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

export function FournisseurDetailPrintTemplate({ fournisseur, achats }) {
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

  const totalAchats = achats.reduce((sum, a) => sum + a.montant, 0);
  const totalPaye = achats.filter(a => a.statut === 'Payé').reduce((sum, a) => sum + a.montant, 0);
  const totalEnAttente = achats.filter(a => a.statut === 'En attente').reduce((sum, a) => sum + a.montant, 0);

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
          </div>
        </div>
      </div>

      <div class="print-title">
        <h2>FICHE FOURNISSEUR</h2>
      </div>

      <div class="print-content">
        <div class="print-info-box">
          <div class="print-info-box-title">INFORMATIONS FOURNISSEUR</div>
          <div class="print-grid-2">
            <div class="print-info-row">
              <span class="print-info-label">Nom:</span>
              <span class="print-info-value text-bold">${fournisseur.nom}</span>
            </div>
            <div class="print-info-row">
              <span class="print-info-label">Téléphone:</span>
              <span class="print-info-value">${fournisseur.telephone}</span>
            </div>
            <div class="print-info-row">
              <span class="print-info-label">Email:</span>
              <span class="print-info-value">${fournisseur.email}</span>
            </div>
            <div class="print-info-row">
              <span class="print-info-label">Adresse:</span>
              <span class="print-info-value">${fournisseur.adresse}</span>
            </div>
            <div class="print-info-row">
              <span class="print-info-label">Matricule Fiscal:</span>
              <span class="print-info-value">${fournisseur.matriculeFiscale || 'N/A'}</span>
            </div>
            <div class="print-info-row">
              <span class="print-info-label">Solde dû:</span>
              <span class="print-info-value print-money">${fournisseur.solde.toFixed(2)} €</span>
            </div>
          </div>
        </div>

        <div class="print-info-box">
          <div class="print-info-box-title">RÉSUMÉ ACHATS</div>
          <div class="print-grid-3">
            <div class="print-info-row">
              <span class="print-info-label">Total Achats:</span>
              <span class="print-info-value print-money">${totalAchats.toFixed(2)} €</span>
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

        ${achats.length > 0 ? `
        <div class="print-section">
          <div class="print-section-title">HISTORIQUE DES ACHATS</div>
          <table class="print-table">
            <thead>
              <tr>
                <th>Référence</th>
                <th>Date</th>
                <th class="text-right">Montant</th>
                <th class="text-center">Statut</th>
              </tr>
            </thead>
            <tbody>
              ${achats.map((achat) => `
                <tr>
                  <td class="text-bold">${achat.reference}</td>
                  <td>${achat.date}</td>
                  <td class="text-right print-money">${achat.montant.toFixed(2)} €</td>
                  <td class="text-center">
                    <span class="print-status ${achat.statut.toLowerCase().replace(' ', '-')}">${achat.statut}</span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr class="total-row">
                <td colspan="2" class="text-right">TOTAL:</td>
                <td class="text-right print-money">${totalAchats.toFixed(2)} €</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
        ` : ''}
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

export function FactureAchatPrintTemplate({ facture, achat }) {
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
              <span class="meta-label">N° Facture:</span>
              <span class="meta-value">${facture.numero}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="print-title">
        <h2>FACTURE ACHAT</h2>
      </div>

      <div class="print-content">
        <div class="print-info-box">
          <div class="print-info-box-title">INFORMATIONS FOURNISSEUR</div>
          <div class="print-grid-2">
            <div class="print-info-row">
              <span class="print-info-label">Fournisseur:</span>
              <span class="print-info-value">${facture.fournisseur}</span>
            </div>
            <div class="print-info-row">
              <span class="print-info-label">Date facture:</span>
              <span class="print-info-value">${facture.date || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div class="print-info-box">
          <div class="print-info-box-title">MONTANT</div>
          <div class="print-info-row">
            <span class="print-info-label">Montant TTC:</span>
            <span class="print-info-value print-money text-bold">${facture.montant.toFixed(2)} €</span>
          </div>
        </div>

        ${achat && achat.articles && achat.articles.length > 0 ? `
        <div class="print-section">
          <div class="print-section-title">DÉTAILS ACHAT ASSOCIÉ</div>
          <table class="print-table">
            <thead>
              <tr>
                <th>Article</th>
                <th class="text-center">Quantité</th>
                <th class="text-right">Prix Unitaire</th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${achat.articles.map((article) => `
                <tr>
                  <td>${article.nom}</td>
                  <td class="text-center">${article.quantite}</td>
                  <td class="text-right print-money">${article.prixUnitaire.toFixed(2)} €</td>
                  <td class="text-right print-money">${article.total ? article.total.toFixed(2) : (article.quantite * article.prixUnitaire).toFixed(2)} €</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr class="total-row">
                <td colspan="3" class="text-right">TOTAL:</td>
                <td class="text-right print-money">${achat.montant.toFixed(2)} €</td>
              </tr>
            </tfoot>
          </table>
        </div>
        ` : ''}

        <div class="print-signatures">
          <div class="print-signature">
            <div class="print-signature-line">Signature Fournisseur</div>
          </div>
          <div class="print-signature">
            <div class="print-signature-line">Signature Comptable</div>
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
