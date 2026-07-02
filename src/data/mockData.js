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
  { id: 1, reference: "ACH-2026-001", fournisseur: "Somme Matériels", date: "2026-06-02", montant: 4500.00, statut: "Payé", articles: [{ nom: "Matériaux construction", quantite: 100, prixUnitaire: 45.00, description: "Ciment et sable", surface: 50 }] },
  { id: 2, reference: "ACH-2026-002", fournisseur: "DistriData Systems", date: "2026-06-08", montant: 9800.00, statut: "Payé", articles: [{ nom: "Serveurs Dell PowerEdge", quantite: 2, prixUnitaire: 4900.00, description: "Serveurs entreprise", surface: null }] },
  { id: 3, reference: "ACH-2026-003", fournisseur: "Energy & Co", date: "2026-06-14", montant: 2300.00, statut: "En attente", articles: [{ nom: "Panneaux solaires", quantite: 10, prixUnitaire: 230.00, description: "Panneaux photovoltaïques", surface: 25 }] },
  { id: 4, reference: "ACH-2026-004", fournisseur: "Office Supply Premium", date: "2026-06-20", montant: 850.00, statut: "Partiel", articles: [{ nom: "Fournitures bureau", quantite: 50, prixUnitaire: 17.00, description: "Papier, stylos, classeurs", surface: null }] }
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
  { id: 1, nom: "Bilel Connor", email: "s.connor@erppro.com", role: "Super-Administrateur", actif: true, permissions: { Dashboard: true, Achats: true, Ventes: true, Paiements: true, Depenses: true, Historique: true, Rapports: true, Parametres: true } },
  { id: 2, nom: "Marc Vasseur", email: "m.vasseur@erppro.com", role: "Commercial", actif: true, permissions: { Dashboard: true, Achats: false, Ventes: true, Paiements: true, Depenses: false, Historique: true, Rapports: true, Parametres: false } },
  { id: 3, nom: "Lucas Dupont", email: "l.dupont@erppro.com", role: "Logistique / Achat", actif: true, permissions: { Dashboard: true, Achats: true, Ventes: false, Paiements: false, Depenses: true, Historique: true, Rapports: false, Parametres: false } }
];

export const initialEmployees = [
  {
    id: "EMP-001",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60",
    fullName: "Ahmed Ben Ali",
    position: "Software Engineer",
    department: "IT",
    phone: "+216 71 123 456",
    email: "ahmed.benali@erppro.com",
    monthlySalary: 2500,
    status: "Active",
    joinDate: "2023-01-15",
    attendance: {},
    salaryHistory: [],
    documents: {
      contract: "contract_ahmed.pdf",
      idCard: "id_ahmed.pdf",
      cnss: "cnss_ahmed.pdf",
      diploma: "diploma_ahmed.pdf"
    },
    notes: "Senior developer with 5 years experience in React and Node.js",
    // Additional fields for profile
    cin: "12345678",
    dateOfBirth: "1990-05-15",
    address: "Tunis, Tunisie",
    maritalStatus: "Célibataire",
    numberOfChildren: 0,
    manager: "Directeur IT",
    contractType: "CDI",
    bankName: "BIAT",
    rib: "12345678901234567890",
    contractEnd: "N/A",
    workSchedule: "9h-17h",
    vacationBalance: 15,
    cnssNumber: "12345678",
    emergencyContact: "+216 71 999 999"
  },
  {
    id: "EMP-002",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60",
    fullName: "Fatma Trabelsi",
    position: "HR Manager",
    department: "Human Resources",
    phone: "+216 71 234 567",
    email: "fatma.trabelsi@erppro.com",
    monthlySalary: 2200,
    status: "Active",
    joinDate: "2022-06-01",
    attendance: {},
    salaryHistory: [],
    documents: {
      contract: "contract_fatma.pdf",
      idCard: "id_fatma.pdf",
      cnss: "cnss_fatma.pdf",
      diploma: "diploma_fatma.pdf"
    },
    notes: "Excellent communication skills, handles recruitment and employee relations",
    cin: "23456789",
    dateOfBirth: "1988-03-20",
    address: "Sfax, Tunisie",
    maritalStatus: "Mariée",
    numberOfChildren: 2,
    manager: "Directeur Général",
    contractType: "CDI",
    bankName: "Attijari",
    rib: "23456789012345678901",
    contractEnd: "N/A",
    workSchedule: "8h30-16h30",
    vacationBalance: 20,
    cnssNumber: "23456789",
    emergencyContact: "+216 71 888 888"
  },
  {
    id: "EMP-003",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60",
    fullName: "Mohamed Kaddour",
    position: "Sales Manager",
    department: "Sales",
    phone: "+216 71 345 678",
    email: "mohamed.kaddour@erppro.com",
    monthlySalary: 2800,
    status: "Active",
    joinDate: "2022-03-10",
    attendance: {},
    salaryHistory: [],
    documents: {
      contract: "contract_mohamed.pdf",
      idCard: "id_mohamed.pdf",
      cnss: "cnss_mohamed.pdf",
      diploma: "diploma_mohamed.pdf"
    },
    notes: "Top performer, exceeded sales targets for 3 consecutive quarters",
    cin: "34567890",
    dateOfBirth: "1985-08-10",
    address: "Sousse, Tunisie",
    maritalStatus: "Marié",
    numberOfChildren: 3,
    manager: "Directeur Commercial",
    contractType: "CDI",
    bankName: "Zitouna",
    rib: "34567890123456789012",
    contractEnd: "N/A",
    workSchedule: "9h-18h",
    vacationBalance: 18,
    cnssNumber: "34567890",
    emergencyContact: "+216 71 777 777"
  },
  {
    id: "EMP-004",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=60",
    fullName: "Sarra Masmoudi",
    position: "Accountant",
    department: "Finance",
    phone: "+216 71 456 789",
    email: "sarra.masmoudi@erppro.com",
    monthlySalary: 2000,
    status: "Vacation",
    joinDate: "2023-02-20",
    attendance: {},
    salaryHistory: [],
    documents: {
      contract: "contract_sarra.pdf",
      idCard: "id_sarra.pdf",
      cnss: "cnss_sarra.pdf",
      diploma: "diploma_sarra.pdf"
    },
    notes: "On vacation until July 15, 2026",
    cin: "45678901",
    dateOfBirth: "1992-12-05",
    address: "Bizerte, Tunisie",
    maritalStatus: "Célibataire",
    numberOfChildren: 0,
    manager: "Directeur Financier",
    contractType: "CDD",
    bankName: "UIB",
    rib: "45678901234567890123",
    contractEnd: "2024-02-20",
    workSchedule: "8h-16h",
    vacationBalance: 25,
    cnssNumber: "45678901",
    emergencyContact: "+216 71 666 666"
  },
  {
    id: "EMP-005",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60",
    fullName: "Karim Bouazizi",
    position: "Marketing Specialist",
    department: "Marketing",
    phone: "+216 71 567 890",
    email: "karim.bouazizi@erppro.com",
    monthlySalary: 1800,
    status: "Active",
    joinDate: "2023-05-15",
    attendance: {},
    salaryHistory: [],
    documents: {
      contract: "contract_karim.pdf",
      idCard: "id_karim.pdf",
      cnss: "cnss_karim.pdf",
      diploma: "diploma_karim.pdf"
    },
    notes: "Creative marketer, specializes in digital campaigns and social media",
    cin: "56789012",
    dateOfBirth: "1995-02-28",
    address: "Gabès, Tunisie",
    maritalStatus: "Célibataire",
    numberOfChildren: 0,
    manager: "Directeur Marketing",
    contractType: "CDI",
    bankName: "BNA",
    rib: "56789012345678901234",
    contractEnd: "N/A",
    workSchedule: "9h-17h",
    vacationBalance: 12,
    cnssNumber: "56789012",
    emergencyContact: "+216 71 555 555"
  },
  {
    id: "EMP-006",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=60",
    fullName: "Youssef Haddad",
    position: "Operations Manager",
    department: "Operations",
    phone: "+216 71 678 901",
    email: "youssef.haddad@erppro.com",
    monthlySalary: 2600,
    status: "Suspended",
    joinDate: "2021-11-01",
    attendance: {},
    salaryHistory: [],
    documents: {
      contract: "contract_youssef.pdf",
      idCard: "id_youssef.pdf",
      cnss: "cnss_youssef.pdf",
      diploma: "diploma_youssef.pdf"
    },
    notes: "Suspended pending investigation - expected return July 20, 2026",
    cin: "67890123",
    dateOfBirth: "1987-07-18",
    address: "Monastir, Tunisie",
    maritalStatus: "Marié",
    numberOfChildren: 1,
    manager: "Directeur des Opérations",
    contractType: "CDI",
    bankName: "STB",
    rib: "67890123456789012345",
    contractEnd: "N/A",
    workSchedule: "8h-17h",
    vacationBalance: 10,
    cnssNumber: "67890123",
    emergencyContact: "+216 71 444 444"
  },
  {
    id: "EMP-007",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=60",
    fullName: "Amel Ben Salem",
    position: "Customer Service",
    department: "Support",
    phone: "+216 71 789 012",
    email: "amel.bensalem@erppro.com",
    monthlySalary: 1500,
    status: "Active",
    joinDate: "2023-08-01",
    attendance: {},
    salaryHistory: [],
    documents: {
      contract: "contract_amel.pdf",
      idCard: "id_amel.pdf",
      cnss: "cnss_amel.pdf",
      diploma: "diploma_amel.pdf"
    },
    notes: "Bilingual (Arabic/French/English), excellent customer satisfaction ratings",
    cin: "78901234",
    dateOfBirth: "1996-09-12",
    address: "Nabeul, Tunisie",
    maritalStatus: "Célibataire",
    numberOfChildren: 0,
    manager: "Responsable Support",
    contractType: "CDI",
    bankName: "BH",
    rib: "78901234567890123456",
    contractEnd: "N/A",
    workSchedule: "8h-16h",
    vacationBalance: 14,
    cnssNumber: "78901234",
    emergencyContact: "+216 71 333 333"
  },
  {
    id: "EMP-008",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=60",
    fullName: "Hamdi Jaziri",
    position: "Logistics Coordinator",
    department: "Logistics",
    phone: "+216 71 890 123",
    email: "hamdi.jaziri@erppro.com",
    monthlySalary: 1900,
    status: "Inactive",
    joinDate: "2022-09-15",
    attendance: {},
    salaryHistory: [],
    documents: {
      contract: "contract_hamdi.pdf",
      idCard: "id_hamdi.pdf",
      cnss: "cnss_hamdi.pdf",
      diploma: "diploma_hamdi.pdf"
    },
    notes: "Left company on June 30, 2026",
    cin: "89012345",
    dateOfBirth: "1991-04-25",
    address: "Kairouan, Tunisie",
    maritalStatus: "Marié",
    numberOfChildren: 2,
    manager: "Responsable Logistique",
    contractType: "CDD",
    bankName: "ATB",
    rib: "89012345678901234567",
    contractEnd: "2023-09-15",
    workSchedule: "9h-18h",
    vacationBalance: 0,
    cnssNumber: "89012345",
    emergencyContact: "+216 71 222 222"
  }
];
