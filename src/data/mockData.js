// Mock database for ERP PRO - 2026

export const initialClients = [
  { id: 1, nom: "Acme Corporation", telephone: "+33 1 45 78 92 10", email: "contact@acme.com", adresse: "12 Rue de l'Innovation, Paris", solde: 15400.00 },
  { id: 2, nom: "Global Tech Solutions", telephone: "+33 2 99 33 44 55", email: "billing@globaltech.fr", adresse: "45 Avenue des Champs-Élysées, Paris", solde: -2300.00 },
  { id: 3, nom: "Espace Digital SARL", telephone: "+33 4 91 00 11 22", email: "info@espacedigital.com", adresse: "88 Boulevard Baille, Marseille", solde: 0.00 },
  { id: 4, nom: "Novatech", telephone: "+33 3 20 55 66 77", email: "contact@novatech.io", adresse: "102 Rue de la Liberté, Lille", solde: 5800.00 },
  { id: 5, nom: "BTP Construction Plus", telephone: "+33 5 56 88 99 00", email: "finance@btpcomp.fr", adresse: "230 Cours Balguerie, Bordeaux", solde: 450.00 }
];

export const initialFournisseurs = [
  { id: 1, nom: "Somme Matériels", telephone: "+33 3 22 44 55 66", email: "sales@sommemateriels.fr", adresse: "14 Rue des Indes, Amiens", solde: 3400.00, matriculeFiscale: "FR12345678901" },
  { id: 2, nom: "DistriData Systems", telephone: "+33 1 50 60 70 80", email: "orders@distridata.com", adresse: "78 Rue du Faubourg Saint-Antoine, Paris", solde: 0.00, matriculeFiscale: "FR98765432109" },
  { id: 3, nom: "Energy & Co", telephone: "+33 4 72 88 99 00", email: "facturation@energyco.fr", adresse: "56 Boulevard de la République, Lyon", solde: -1200.00, matriculeFiscale: "FR45678901234" },
  { id: 4, nom: "Office Supply Premium", telephone: "+33 2 40 12 34 56", email: "contact@officesupply.fr", adresse: "5 Rue des Olivettes, Nantes", solde: 180.00, matriculeFiscale: "FR78901234567" }
];

export const initialVentes = [
  { id: 1, facture: "FAC-2026-001", client: "Acme Corporation", date: "2026-06-10", total: 12500.00, statut: "Payé" },
  { id: 2, facture: "FAC-2026-002", client: "Global Tech Solutions", date: "2026-06-12", total: 4800.00, statut: "En attente" },
  { id: 3, facture: "FAC-2026-003", client: "Novatech", date: "2026-06-15", total: 7200.00, statut: "Partiel" },
  { id: 4, facture: "FAC-2026-004", client: "BTP Construction Plus", date: "2026-06-18", total: 950.00, statut: "Payé" },
  { id: 5, facture: "FAC-2026-005", client: "Acme Corporation", date: "2026-06-22", total: 2900.00, statut: "Payé" },
  { id: 6, facture: "FAC-2026-006", client: "Global Tech Solutions", date: "2026-06-24", total: 3100.00, statut: "En attente" }
];

export const initialAchats = [
  { id: 1, reference: "ACH-2026-001", fournisseur: "Somme Matériels", date: "2026-06-02", montant: 4500.00, statut: "Payé", articles: [{ nom: "Matériaux construction", quantite: 100, prixUnitaire: 45.00, description: "Ciment et sable" }] },
  { id: 2, reference: "ACH-2026-002", fournisseur: "DistriData Systems", date: "2026-06-08", montant: 9800.00, statut: "Payé", articles: [{ nom: "Serveurs Dell PowerEdge", quantite: 2, prixUnitaire: 4900.00, description: "Serveurs entreprise" }] },
  { id: 3, reference: "ACH-2026-003", fournisseur: "Energy & Co", date: "2026-06-14", montant: 2300.00, statut: "En attente", articles: [{ nom: "Panneaux solaires", quantite: 10, prixUnitaire: 230.00, description: "Panneaux photovoltaïques" }] },
  { id: 4, reference: "ACH-2026-004", fournisseur: "Office Supply Premium", date: "2026-06-20", montant: 850.00, statut: "Partiel", articles: [{ nom: "Fournitures bureau", quantite: 50, prixUnitaire: 17.00, description: "Papier, stylos, classeurs" }] }
];

export const initialBonsCommande = [
  { id: 1, numero: "BC-2026-001", fournisseur: "Somme Matériels", date: "2026-06-01", statut: "Livré", montant: 4500.00, delaiLivraison: "3 jours", modeTransport: "Camion", articles: [{ nom: "Matériaux construction", quantite: 100 }], priorite: "Haute", conditionsPaiement: "30 jours", adresseLivraison: "75 Avenue de la République, Paris", contactPersonne: "Jean Dupont", dateLivraisonPrevue: "2026-06-04", notes: "Livraison à l'entrepôt principal" },
  { id: 2, numero: "BC-2026-002", fournisseur: "DistriData Systems", date: "2026-06-07", statut: "Livré", montant: 9800.00, delaiLivraison: "5 jours", modeTransport: "Express", articles: [{ nom: "Serveurs Dell PowerEdge", quantite: 2 }], priorite: "Urgente", conditionsPaiement: "15 jours", adresseLivraison: "45 Avenue des Champs-Élysées, Paris", contactPersonne: "Marie Martin", dateLivraisonPrevue: "2026-06-12", notes: "Installation requise par le fournisseur" },
  { id: 3, numero: "BC-2026-003", fournisseur: "Energy & Co", date: "2026-06-12", statut: "Validé", montant: 2300.00, delaiLivraison: "7 jours", modeTransport: "Standard", articles: [{ nom: "Panneaux solaires", quantite: 10 }], priorite: "Normale", conditionsPaiement: "45 jours", adresseLivraison: "88 Boulevard Baille, Marseille", contactPersonne: "Pierre Bernard", dateLivraisonPrevue: "2026-06-19", notes: "Matériel fragile - manipulation avec soin" },
  { id: 4, numero: "BC-2026-004", fournisseur: "Office Supply Premium", date: "2026-06-19", statut: "En attente", montant: 850.00, delaiLivraison: "2 jours", modeTransport: "Colis", articles: [{ nom: "Fournitures bureau", quantite: 50 }], priorite: "Basse", conditionsPaiement: "30 jours", adresseLivraison: "102 Rue de la Liberté, Lille", contactPersonne: "Sophie Petit", dateLivraisonPrevue: "2026-06-21", notes: "Livraison bureau standard" }
];

export const initialFacturesAchat = [
  { id: 1, numero: "FA-2026-001", fournisseur: "Somme Matériels", montant: 4500.00, date: "2026-06-02", pdf: "FA-2026-001.pdf" },
  { id: 2, numero: "FA-2026-002", fournisseur: "DistriData Systems", montant: 9800.00, date: "2026-06-08", pdf: "FA-2026-002.pdf" },
  { id: 3, numero: "FA-2026-003", fournisseur: "Energy & Co", montant: 2300.00, date: "2026-06-14", pdf: "FA-2026-003.pdf" },
  { id: 4, numero: "FA-2026-004", fournisseur: "Office Supply Premium", montant: 850.00, date: "2026-06-20", pdf: "FA-2026-004.pdf" }
];

export const initialDevis = [
  { id: 1, numero: "DEV-2026-001", client: "Acme Corporation", montant: 15000.00, date: "2026-06-01", statut: "Accepté", surface: 250, lineaire: 50, metrage: 100, typeProjet: "Rénovation", description: "Travaux de rénovation complète" },
  { id: 2, numero: "DEV-2026-002", client: "Global Tech Solutions", montant: 5000.00, date: "2026-06-05", statut: "Accepté", surface: 120, lineaire: 30, metrage: 45, typeProjet: "Installation", description: "Installation réseau informatique" },
  { id: 3, numero: "DEV-2026-003", client: "Espace Digital SARL", montant: 3200.00, date: "2026-06-10", statut: "En attente", surface: 80, lineaire: 20, metrage: 35, typeProjet: "Maintenance", description: "Maintenance préventive" },
  { id: 4, numero: "DEV-2026-004", client: "Novatech", montant: 8000.00, date: "2026-06-12", statut: "Accepté", surface: 180, lineaire: 40, metrage: 75, typeProjet: "Construction", description: "Construction bureau" },
  { id: 5, numero: "DEV-2026-005", client: "BTP Construction Plus", montant: 14000.00, date: "2026-06-18", statut: "Refusé", surface: 300, lineaire: 60, metrage: 120, typeProjet: "Extension", description: "Extension bâtiment" },
  { id: 6, numero: "DEV-2026-006", client: "Acme Corporation", montant: 4500.00, date: "2026-06-22", statut: "En attente", surface: 90, lineaire: 25, metrage: 40, typeProjet: "Réparation", description: "Réparation façade" }
];

export const initialCommandes = [
  { id: "cmd-1", numero: "CMD-2026-001", client: "Acme Corporation", date: "2026-06-15", etat: "Livrée", montant: 12500.00, articles: [{ label: "Licences Logiciel Cloud ERP", qte: 5, prixUnit: 2500.00 }] },
  { id: "cmd-2", numero: "CMD-2026-002", client: "Global Tech Solutions", date: "2026-06-18", etat: "En cours", montant: 4800.00, articles: [{ label: "Prestation Audit DSI", qte: 4, prixUnit: 1200.00 }] },
  { id: "cmd-3", numero: "CMD-2026-003", client: "Novatech", date: "2026-06-20", etat: "En attente", montant: 7200.00, articles: [{ label: "Modules ERP Complémentaires", qte: 3, prixUnit: 2400.00 }] },
  { id: "cmd-4", numero: "CMD-2026-004", client: "BTP Construction Plus", date: "2026-06-22", etat: "Annulée", montant: 950.00, articles: [{ label: "Formation Utilisateurs", qte: 1, prixUnit: 950.00 }] },
  { id: "cmd-5", numero: "CMD-2026-005", client: "Espace Digital SARL", date: "2026-06-23", etat: "En attente", montant: 3100.00, articles: [{ label: "Support Premium Annuel", qte: 1, prixUnit: 3100.00 }] },
  { id: "cmd-6", numero: "CMD-2026-006", client: "Acme Corporation", date: "2026-06-24", etat: "En cours", montant: 2900.00, articles: [{ label: "Intégration API & Webhooks", qte: 2, prixUnit: 1450.00 }] }
];

export const initialPaiementsClients = [
  { id: 1, client: "Acme Corporation", facture: "FAC-2026-001", montant: 12500.00, statut: "Encaissé", date: "2026-06-12" },
  { id: 2, client: "Novatech", facture: "FAC-2026-003", montant: 3000.00, statut: "Partiel", date: "2026-06-16" },
  { id: 3, client: "BTP Construction Plus", facture: "FAC-2026-004", montant: 950.00, statut: "Encaissé", date: "2026-06-19" },
  { id: 4, client: "Acme Corporation", facture: "FAC-2026-005", montant: 2900.00, statut: "Encaissé", date: "2026-06-23" }
];

export const initialPaiementsFournisseurs = [
  { id: 1, fournisseur: "Somme Matériels", montant: 4500.00, statut: "Payé", date: "2026-06-03" },
  { id: 2, fournisseur: "DistriData Systems", montant: 9800.00, statut: "Payé", date: "2026-06-10" },
  { id: 3, fournisseur: "Office Supply Premium", montant: 400.00, statut: "Partiel", date: "2026-06-21" }
];

export const initialTransactions = [
  { id: 1, date: "2026-06-03", type: "Décaissement", description: "Paiement Achat Somme Matériels ACH-2026-001", montant: 4500.00, statut: "Validé" },
  { id: 2, date: "2026-06-10", type: "Décaissement", description: "Paiement Achat DistriData Systems ACH-2026-002", montant: 9800.00, statut: "Validé" },
  { id: 3, date: "2026-06-12", type: "Encaissement", description: "Règlement Facture FAC-2026-001 Acme Corp", montant: 12500.00, statut: "Validé" },
  { id: 4, date: "2026-06-16", type: "Encaissement", description: "Acompte Facture FAC-2026-003 Novatech", montant: 3000.00, statut: "Validé" },
  { id: 5, date: "2026-06-19", type: "Encaissement", description: "Règlement Facture FAC-2026-004 BTP Plus", montant: 950.00, statut: "Validé" },
  { id: 6, date: "2026-06-21", type: "Décaissement", description: "Acompte Achat Office Supply ACH-2026-004", montant: 400.00, statut: "Validé" },
  { id: 7, date: "2026-06-23", type: "Encaissement", description: "Règlement Facture FAC-2026-005 Acme Corp", montant: 2900.00, statut: "Validé" }
];

export const initialDepenses = [
  { id: 1, categorie: "Loyer", description: "Loyer bureaux Paris - 6ème arr.", montant: 3800.00, date: "2026-06-01" },
  { id: 2, categorie: "Transport", description: "Abonnements Navigo & Déplacements client", montant: 450.00, date: "2026-06-05" },
  { id: 3, categorie: "Salaires", description: "Salaires de l'équipe (5 personnes)", montant: 14500.00, date: "2026-06-25" },
  { id: 4, categorie: "Electricité", description: "Facture EDF bureaux trimestrielle", montant: 620.00, date: "2026-06-10" },
  { id: 5, categorie: "Divers", description: "Achat fournitures de bureau & café", montant: 180.00, date: "2026-06-18" },
  { id: 6, categorie: "Divers", description: "Licences Zoom & Slack Enterprise", montant: 320.00, date: "2026-06-20" }
];

export const initialHistorique = [
  { id: 1, date: "2026-06-01 09:15", action: "Création Devis", utilisateur: "Bilel Connor (Admin)", description: "Devis DEV-2026-001 créé pour Acme Corporation" },
  { id: 2, date: "2026-06-02 14:30", action: "Achat Enregistré", utilisateur: "Bilel Connor (Admin)", description: "Achat ACH-2026-001 enregistré auprès de Somme Matériels" },
  { id: 3, date: "2026-06-10 10:20", action: "Vente Créée", utilisateur: "Marc Vasseur (Commercial)", description: "Facture FAC-2026-001 créée pour Acme Corporation" },
  { id: 4, date: "2026-06-12 11:05", action: "Paiement Reçu", utilisateur: "Bilel Connor (Admin)", description: "Encaissement de 12 500 € pour la facture FAC-2026-001" },
  { id: 5, date: "2026-06-15 16:45", action: "Commande Créée", utilisateur: "Marc Vasseur (Commercial)", description: "Commande CMD-2026-003 en attente pour Novatech" },
  { id: 6, date: "2026-06-22 09:00", action: "Commande Livrée", utilisateur: "Logistique ERP", description: "Commande CMD-2026-001 marquée comme Livrée" },
  { id: 7, date: "2026-06-24 17:10", action: "Paramètres modifiés", utilisateur: "Bilel Connor (Admin)", description: "Mise à jour des coordonnées de la société" }
];

export const staticRapports = {
  mensuel: [
    { name: "Janvier", ventes: 18000, achats: 12000, benefices: 6000, depenses: 4000 },
    { name: "Février", ventes: 22000, achats: 15000, benefices: 7000, depenses: 4200 },
    { name: "Mars", ventes: 25000, achats: 11000, benefices: 14000, depenses: 4500 },
    { name: "Avril", ventes: 29000, achats: 16000, benefices: 13000, depenses: 5200 },
    { name: "Mai", ventes: 32000, achats: 18000, benefices: 14000, depenses: 5000 },
    { name: "Juin", ventes: 34450, achats: 17450, benefices: 17000, depenses: 19870 }
  ],
  trimestriel: [
    { name: "Trimestre 1 (T1)", ventes: 65000, achats: 38000, benefices: 27000, depenses: 12700 },
    { name: "Trimestre 2 (T2)", ventes: 95450, achats: 51450, benefices: 44000, depenses: 30070 }
  ],
  annuel: [
    { name: "Année 2024", ventes: 280000, achats: 190000, benefices: 90000, depenses: 58000 },
    { name: "Année 2025", ventes: 340000, achats: 210000, benefices: 130000, depenses: 62000 },
    { name: "Année 2026 (Prév)", ventes: 410000, achats: 240000, benefices: 170000, depenses: 75000 }
  ]
};

export const initialSociete = {
  nom: "ERP PRO SAS",
  adresse: "75 Avenue de la République, 75011 Paris",
  telephone: "+33 1 88 99 00 11",
  email: "admin@erppro.com",
  logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60"
};

export const initialUtilisateurs = [
  { id: 1, nom: "Bilel Connor", email: "s.connor@erppro.com", role: "Super-Administrateur", actif: true, permissions: { Dashboard: true, Achats: true, Ventes: true, Paiements: true, Commandes: true, Depenses: true, Historique: true, Rapports: true, Parametres: true } },
  { id: 2, nom: "Marc Vasseur", email: "m.vasseur@erppro.com", role: "Commercial", actif: true, permissions: { Dashboard: true, Achats: false, Ventes: true, Paiements: true, Commandes: true, Depenses: false, Historique: true, Rapports: true, Parametres: false } },
  { id: 3, nom: "Lucas Dupont", email: "l.dupont@erppro.com", role: "Logistique / Achat", actif: true, permissions: { Dashboard: true, Achats: true, Ventes: false, Paiements: false, Commandes: true, Depenses: true, Historique: true, Rapports: false, Parametres: false } }
];
