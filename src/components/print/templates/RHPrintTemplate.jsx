import React from 'react';

/**
 * RH Print Template
 * Generates professional A4 documents for HR reports and employee details
 */
export function RHListPrintTemplate({ employes, period, documentNumber }) {
  const totalSalaire = employes.reduce((sum, e) => sum + (e.salaire || 0), 0);

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
        <h2>RAPPORT RH</h2>
      </div>

      <!-- Content -->
      <div class="print-content">
        <!-- Summary Box -->
        <div class="print-info-box">
          <div class="print-info-box-title">RÉSUMÉ</div>
          <div class="print-grid-2">
            <div class="print-info-row">
              <span class="print-info-label">Total Employés:</span>
              <span class="print-info-value">${employes.length}</span>
            </div>
            <div class="print-info-row">
              <span class="print-info-label">Masse Salariale:</span>
              <span class="print-info-value print-money">${totalSalaire.toFixed(2)} €</span>
            </div>
          </div>
        </div>

        <!-- Table -->
        <table class="print-table">
          <thead>
            <tr>
              <th>Matricule</th>
              <th>Nom & Prénom</th>
              <th>Poste</th>
              <th>Département</th>
              <th>Date Embauche</th>
              <th class="text-right">Salaire</th>
              <th class="text-center">Statut</th>
            </tr>
          </thead>
          <tbody>
            ${employes.map((employe) => `
              <tr>
                <td class="text-bold">${employe.matricule || 'N/A'}</td>
                <td>${employe.nom} ${employe.prenom || ''}</td>
                <td>${employe.poste || 'N/A'}</td>
                <td>${employe.departement || 'N/A'}</td>
                <td>${employe.dateEmbauche || 'N/A'}</td>
                <td class="text-right print-money">${(employe.salaire || 0).toFixed(2)} €</td>
                <td class="text-center">
                  <span class="print-status ${employe.statut?.toLowerCase() || 'actif'}">${employe.statut || 'Actif'}</span>
                </td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr class="total-row">
              <td colspan="5" class="text-right">TOTAL MASSE SALARIALE:</td>
              <td class="text-right print-money">${totalSalaire.toFixed(2)} €</td>
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

export function EmployeDetailPrintTemplate({ employe }) {
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
              <span class="meta-label">Matricule:</span>
              <span class="meta-value">${employe.matricule || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Title -->
      <div class="print-title">
        <h2>FICHE EMPLOYÉ</h2>
      </div>

      <!-- Content -->
      <div class="print-content">
        <!-- Personal Info -->
        <div class="print-info-box">
          <div class="print-info-box-title">INFORMATIONS PERSONNELLES</div>
          <div class="print-grid-2">
            <div class="print-info-row">
              <span class="print-info-label">Nom:</span>
              <span class="print-info-value">${employe.nom || 'N/A'}</span>
            </div>
            <div class="print-info-row">
              <span class="print-info-label">Prénom:</span>
              <span class="print-info-value">${employe.prenom || 'N/A'}</span>
            </div>
            <div class="print-info-row">
              <span class="print-info-label">CIN:</span>
              <span class="print-info-value">${employe.cin || 'N/A'}</span>
            </div>
            <div class="print-info-row">
              <span class="print-info-label">Date de Naissance:</span>
              <span class="print-info-value">${employe.dateNaissance || 'N/A'}</span>
            </div>
            <div class="print-info-row">
              <span class="print-info-label">Téléphone:</span>
              <span class="print-info-value">${employe.telephone || 'N/A'}</span>
            </div>
            <div class="print-info-row">
              <span class="print-info-label">Email:</span>
              <span class="print-info-value">${employe.email || 'N/A'}</span>
            </div>
            <div class="print-info-row">
              <span class="print-info-label">Adresse:</span>
              <span class="print-info-value">${employe.adresse || 'N/A'}</span>
            </div>
          </div>
        </div>

        <!-- Professional Info -->
        <div class="print-info-box">
          <div class="print-info-box-title">INFORMATIONS PROFESSIONNELLES</div>
          <div class="print-grid-2">
            <div class="print-info-row">
              <span class="print-info-label">Poste:</span>
              <span class="print-info-value">${employe.poste || 'N/A'}</span>
            </div>
            <div class="print-info-row">
              <span class="print-info-label">Département:</span>
              <span class="print-info-value">${employe.departement || 'N/A'}</span>
            </div>
            <div class="print-info-row">
              <span class="print-info-label">Date Embauche:</span>
              <span class="print-info-value">${employe.dateEmbauche || 'N/A'}</span>
            </div>
            <div class="print-info-row">
              <span class="print-info-label">Type de Contrat:</span>
              <span class="print-info-value">${employe.typeContrat || 'N/A'}</span>
            </div>
            <div class="print-info-row">
              <span class="print-info-label">Salaire:</span>
              <span class="print-info-value print-money">${(employe.salaire || 0).toFixed(2)} €</span>
            </div>
            <div class="print-info-row">
              <span class="print-info-label">Statut:</span>
              <span class="print-info-value">
                <span class="print-status ${employe.statut?.toLowerCase() || 'actif'}">${employe.statut || 'Actif'}</span>
              </span>
            </div>
          </div>
        </div>

        <!-- Signatures -->
        <div class="print-signatures">
          <div class="print-signature">
            <div class="print-signature-line">Signature Employé</div>
          </div>
          <div class="print-signature">
            <div class="print-signature-line">Signature RH</div>
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
