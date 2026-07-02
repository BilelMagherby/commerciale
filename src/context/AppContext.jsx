import React, { createContext, useContext, useState, useEffect } from "react";
import {
  initialClients,
  initialFournisseurs,
  initialVentes,
  initialAchats,
  initialBonsCommande,
  initialFacturesAchat,
  initialDevis,
  initialPaiementsClients,
  initialPaiementsFournisseurs,
  initialTransactions,
  initialDepenses,
  initialHistorique,
  initialSociete,
  initialUtilisateurs,
  initialEmployees
} from "../data/mockData";

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("erp-theme") || "light";
  });

  // Global search & notifications
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Nouvelle commande", desc: "La commande CMD-2026-006 a été créée.", time: "Il y a 5m", read: false },
    { id: 2, title: "Paiement reçu", desc: "Acme Corp a réglé la facture FAC-2026-005.", time: "Il y a 1h", read: false },
    { id: 3, title: "Rappel Achat", desc: "Facture FA-2026-003 arrive à échéance.", time: "Il y a 1j", read: true }
  ]);

  // Toasts
  const [toasts, setToasts] = useState([]);

  // Mock Database State
  const [clients, setClients] = useState(() => getStoredData("erp-clients", initialClients));
  const [fournisseurs, setFournisseurs] = useState(() => getStoredData("erp-fournisseurs", initialFournisseurs));
  const [ventes, setVentes] = useState(() => getStoredData("erp-ventes", initialVentes));
  const [achats, setAchats] = useState(() => getStoredData("erp-achats", initialAchats));
  const [bonsCommande, setBonsCommande] = useState(() => getStoredData("erp-bons-commande", initialBonsCommande));
  const [facturesAchat, setFacturesAchat] = useState(() => getStoredData("erp-factures-achat", initialFacturesAchat));
  const [devis, setDevis] = useState(() => getStoredData("erp-devis", initialDevis));
  const [paiementsClients, setPaiementsClients] = useState(() => getStoredData("erp-paiements-clients", initialPaiementsClients));
  const [paiementsFournisseurs, setPaiementsFournisseurs] = useState(() => getStoredData("erp-paiements-fournisseurs", initialPaiementsFournisseurs));
  const [transactions, setTransactions] = useState(() => getStoredData("erp-transactions", initialTransactions));
  const [depenses, setDepenses] = useState(() => getStoredData("erp-depenses", initialDepenses));
  const [historique, setHistorique] = useState(() => getStoredData("erp-historique", initialHistorique));
  const [societe, setSociete] = useState(() => getStoredData("erp-societe", initialSociete));
  const [utilisateurs, setUtilisateurs] = useState(() => getStoredData("erp-utilisateurs", initialUtilisateurs));
  const [employees, setEmployees] = useState(() => getStoredData("erp-employees", initialEmployees));

  // Helper functions
  function getStoredData(key, fallback) {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  }

  function setAndStore(key, data, setter) {
    setter(data);
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Effect to apply Theme Class
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
    localStorage.setItem("erp-theme", theme);
  }, [theme]);

  // Toast utilities
  const addToast = (type, title, message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
    addToast("info", "Thème mis à jour", `Mode ${theme === "light" ? "sombre" : "clair"} activé.`);
  };

  // Add Log helper
  const addLog = (action, utilisateur, description) => {
    const newLog = {
      id: Date.now(),
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      action,
      utilisateur,
      description
    };
    const updated = [newLog, ...historique];
    setAndStore("erp-historique", updated, setHistorique);
  };

  // Operations
  const addVenteRecord = (venteData) => {
    // Generate Invoice number
    const nextNum = ventes.length + 1;
    const invoiceNum = `FAC-2026-${String(nextNum).padStart(3, "0")}`;
    const newVente = {
      id: nextNum,
      facture: invoiceNum,
      client: venteData.client,
      date: venteData.date || new Date().toISOString().split("T")[0],
      total: parseFloat(venteData.total),
      statut: venteData.statut || "En attente"
    };

    // Update Ventes list
    const updatedVentes = [newVente, ...ventes];
    setAndStore("erp-ventes", updatedVentes, setVentes);

    // Update Client Solde if not fully paid (assuming full or partial outstanding)
    if (venteData.statut !== "Payé") {
      const updatedClients = clients.map(c => {
        if (c.nom === venteData.client) {
          const outstanding = parseFloat(venteData.total) - (venteData.statut === "Partiel" ? parseFloat(venteData.total) * 0.4 : 0);
          return { ...c, solde: c.solde + outstanding };
        }
        return c;
      });
      setAndStore("erp-clients", updatedClients, setClients);
    }

    // Add Client Payment if paid/partial
    if (venteData.statut === "Payé" || venteData.statut === "Partiel") {
      const payAmount = venteData.statut === "Payé" ? parseFloat(venteData.total) : parseFloat(venteData.total) * 0.4;
      const newPay = {
        id: Date.now(),
        client: venteData.client,
        facture: invoiceNum,
        montant: payAmount,
        statut: venteData.statut === "Payé" ? "Encaissé" : "Partiel",
        date: newVente.date
      };
      setAndStore("erp-paiements-clients", [newPay, ...paiementsClients], setPaiementsClients);

      // Create transaction
      const newTrans = {
        id: Date.now() + 1,
        date: newVente.date,
        type: "Encaissement",
        description: `Règlement Facture ${invoiceNum} ${venteData.client}`,
        montant: payAmount,
        statut: "Validé"
      };
      setAndStore("erp-transactions", [newTrans, ...transactions], setTransactions);
    }

    addLog("Vente Créée", "Bilel Connor (Admin)", `Facture ${invoiceNum} enregistrée pour ${venteData.client} (${venteData.total} €)`);
    addToast("success", "Vente Enregistrée", `La facture ${invoiceNum} a été créée avec succès.`);
  };

  const addAchatRecord = (achatData) => {
    const nextNum = achats.length + 1;
    const refNum = `ACH-2026-${String(nextNum).padStart(3, "0")}`;
    const newAchat = {
      id: nextNum,
      reference: refNum,
      fournisseur: achatData.fournisseur,
      date: achatData.date || new Date().toISOString().split("T")[0],
      montant: parseFloat(achatData.montant),
      statut: achatData.statut || "En attente"
    };

    setAndStore("erp-achats", [newAchat, ...achats], setAchats);

    // Update Supplier Solde if unpaid
    if (achatData.statut !== "Payé") {
      const updatedFourn = fournisseurs.map(f => {
        if (f.nom === achatData.fournisseur) {
          const outstanding = parseFloat(achatData.montant) - (achatData.statut === "Partiel" ? parseFloat(achatData.montant) * 0.4 : 0);
          return { ...f, solde: f.solde + outstanding };
        }
        return f;
      });
      setAndStore("erp-fournisseurs", updatedFourn, setFournisseurs);
    }

    // Supplier Payment record
    if (achatData.statut === "Payé" || achatData.statut === "Partiel") {
      const payAmount = achatData.statut === "Payé" ? parseFloat(achatData.montant) : parseFloat(achatData.montant) * 0.4;
      const newPay = {
        id: Date.now(),
        fournisseur: achatData.fournisseur,
        montant: payAmount,
        statut: achatData.statut === "Payé" ? "Payé" : "Partiel",
        date: newAchat.date
      };
      setAndStore("erp-paiements-fournisseurs", [newPay, ...paiementsFournisseurs], setPaiementsFournisseurs);

      // Create transaction
      const newTrans = {
        id: Date.now() + 1,
        date: newAchat.date,
        type: "Décaissement",
        description: `Paiement Achat ${refNum} ${achatData.fournisseur}`,
        montant: payAmount,
        statut: "Validé"
      };
      setAndStore("erp-transactions", [newTrans, ...transactions], setTransactions);
    }

    // Generate simulated Purchase Invoice (Facture Achat) & Purchase Order (Bon de commande)
    const nextFaNum = `FA-2026-${String(facturesAchat.length + 1).padStart(3, "0")}`;
    const newFa = {
      id: facturesAchat.length + 1,
      numero: nextFaNum,
      fournisseur: achatData.fournisseur,
      montant: newAchat.montant,
      date: newAchat.date,
      pdf: `${nextFaNum}.pdf`
    };
    setAndStore("erp-factures-achat", [newFa, ...facturesAchat], setFacturesAchat);

    const nextBcNum = `BC-2026-${String(bonsCommande.length + 1).padStart(3, "0")}`;
    const newBc = {
      id: bonsCommande.length + 1,
      numero: nextBcNum,
      fournisseur: achatData.fournisseur,
      date: newAchat.date,
      statut: "Livré"
    };
    setAndStore("erp-bons-commande", [newBc, ...bonsCommande], setBonsCommande);

    addLog("Achat Enregistré", "Bilel Connor (Admin)", `Achat ${refNum} enregistré chez ${achatData.fournisseur} (${achatData.montant} €)`);
    addToast("success", "Achat Enregistré", `La référence ${refNum} a été ajoutée.`);
  };

  const addClientRecord = (clientData) => {
    const newClient = {
      id: Date.now(),
      ...clientData,
      solde: parseFloat(clientData.soldeInitial) || 0,
      statut: clientData.statut || "Actif"
    };
    
    setAndStore("erp-clients", [newClient, ...clients], setClients);
    addLog("Client Créé", "Bilel Connor (Admin)", `Nouveau client ${clientData.nom} ajouté (${clientData.typeClient})`);
    addToast("success", "Client Enregistré", `Le client ${clientData.nom} a été créé avec succès.`);
  };

  const addDevisRecord = (devisData) => {
    const nextNum = devis.length + 1;
    const devNum = `DEV-2026-${String(nextNum).padStart(3, "0")}`;
    const newDevis = {
      id: nextNum,
      numero: devNum,
      client: devisData.client,
      montant: parseFloat(devisData.montant),
      date: devisData.date || new Date().toISOString().split("T")[0],
      statut: devisData.statut || "En attente"
    };

    setAndStore("erp-devis", [newDevis, ...devis], setDevis);
    addLog("Devis Créé", "Bilel Connor (Admin)", `Devis ${devNum} créé pour ${devisData.client} (${devisData.montant} €)`);
    addToast("success", "Devis Créé", `Le devis ${devNum} a été préparé avec succès.`);
  };

  const addExpenseRecord = (expData) => {
    const newExp = {
      id: Date.now(),
      categorie: expData.categorie,
      description: expData.description,
      montant: parseFloat(expData.montant),
      date: expData.date || new Date().toISOString().split("T")[0]
    };

    setAndStore("erp-depenses", [newExp, ...depenses], setDepenses);

    // Also register decaissement transaction
    const newTrans = {
      id: Date.now() + 1,
      date: newExp.date,
      type: "Décaissement",
      description: `Dépense [${expData.categorie}] : ${expData.description}`,
      montant: newExp.montant,
      statut: "Validé"
    };
    setAndStore("erp-transactions", [newTrans, ...transactions], setTransactions);

    addLog("Dépense Créée", "Bilel Connor (Admin)", `Dépense de ${expData.montant} € classifiée dans ${expData.categorie}`);
    addToast("success", "Dépense Enregistrée", `Dépense ajoutée avec succès.`);
  };

  const updateSocieteRecord = (socData) => {
    setAndStore("erp-societe", socData, setSociete);
    addLog("Société Modifiée", "Bilel Connor (Admin)", "Coordonnées de l'entreprise mises à jour");
    addToast("success", "Mise à jour réussie", "Les paramètres de la société ont été sauvegardés.");
  };

  const updateUserPermissions = (userId, newPermissions) => {
    const updatedUsers = utilisateurs.map((u) => {
      if (u.id === userId) {
        return { ...u, permissions: newPermissions };
      }
      return u;
    });
    setAndStore("erp-utilisateurs", updatedUsers, setUtilisateurs);
    addLog("Permissions Modifiées", "Bilel Connor (Admin)", `Permissions de l'utilisateur ${userId} modifiées.`);
    addToast("info", "Permissions sauvées", "Les habilitations de l'utilisateur ont été mises à jour.");
  };

  // Backups
  const triggerManualBackup = () => {
    const backupObj = {
      clients,
      fournisseurs,
      ventes,
      achats,
      bonsCommande,
      facturesAchat,
      devis,
      commandes,
      paiementsClients,
      paiementsFournisseurs,
      transactions,
      depenses,
      historique,
      societe,
      utilisateurs,
      backupDate: new Date().toISOString()
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupObj, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `erp_backup_${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    addLog("Backup Créé", "Bilel Connor (Admin)", "Exportation manuelle de la base de données ERP");
    addToast("success", "Sauvegarde Réussie", "Le fichier de sauvegarde JSON a été généré.");
  };

  const importBackupData = (backupData) => {
    try {
      if (backupData.clients) setAndStore("erp-clients", backupData.clients, setClients);
      if (backupData.fournisseurs) setAndStore("erp-fournisseurs", backupData.fournisseurs, setFournisseurs);
      if (backupData.ventes) setAndStore("erp-ventes", backupData.ventes, setVentes);
      if (backupData.achats) setAndStore("erp-achats", backupData.achats, setAchats);
      if (backupData.bonsCommande) setAndStore("erp-bons-commande", backupData.bonsCommande, setBonsCommande);
      if (backupData.facturesAchat) setAndStore("erp-factures-achat", backupData.facturesAchat, setFacturesAchat);
      if (backupData.devis) setAndStore("erp-devis", backupData.devis, setDevis);
      if (backupData.commandes) setAndStore("erp-commandes", backupData.commandes, setCommandes);
      if (backupData.paiementsClients) setAndStore("erp-paiements-clients", backupData.paiementsClients, setPaiementsClients);
      if (backupData.paiementsFournisseurs) setAndStore("erp-paiements-fournisseurs", backupData.paiementsFournisseurs, setPaiementsFournisseurs);
      if (backupData.transactions) setAndStore("erp-transactions", backupData.transactions, setTransactions);
      if (backupData.depenses) setAndStore("erp-depenses", backupData.depenses, setDepenses);
      if (backupData.historique) setAndStore("erp-historique", backupData.historique, setHistorique);
      if (backupData.societe) setAndStore("erp-societe", backupData.societe, setSociete);
      if (backupData.utilisateurs) setAndStore("erp-utilisateurs", backupData.utilisateurs, setUtilisateurs);

      addLog("Backup Restauré", "Bilel Connor (Admin)", "Base de données restaurée à partir d'un fichier externe");
      addToast("success", "Restauration Réussie", "Toutes les données simulées ont été rechargées.");
      return true;
    } catch (e) {
      addToast("destructive", "Erreur d'import", "Le fichier de sauvegarde est corrompu ou invalide.");
      return false;
    }
  };

  const markAllNotificationsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        searchQuery,
        setSearchQuery,
        notifications,
        setNotifications,
        markAllNotificationsRead,
        toasts,
        addToast,
        removeToast,
        clients,
        setClients,
        fournisseurs,
        setFournisseurs,
        ventes,
        achats,
        bonsCommande,
        facturesAchat,
        devis,
        paiementsClients,
        paiementsFournisseurs,
        transactions,
        depenses,
        historique,
        societe,
        utilisateurs,
        employees,
        setEmployees,
        addVenteRecord,
        addAchatRecord,
        addDevisRecord,
        addClientRecord,
        addExpenseRecord,
        updateSocieteRecord,
        updateUserPermissions,
        triggerManualBackup,
        importBackupData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
