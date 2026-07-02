import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Card, Badge, Modal, TableContainer, THead, TBody, Tr, Th, Td } from "../components/ui/SharedUI";
import { Plus, FileText, Download, User, Phone, MapPin, CheckCircle, FileUp, History, Clock, Filter, Printer, Eye, DollarSign, Calendar, Package, Mail, Trash2, Building, Upload } from "lucide-react";

export default function Ventes() {
  const {
    ventes,
    clients,
    devis,
    searchQuery,
    addVenteRecord,
    addDevisRecord,
    addClientRecord,
    societe
  } = useApp();

  const [activeTab, setActiveTab] = useState("ventes");
  const [modalType, setModalType] = useState(null); // 'vente', 'devis', 'client', or null
  const [selectedVentePdf, setSelectedVentePdf] = useState(null);
  const [selectedClientHistory, setSelectedClientHistory] = useState(null);
  const [selectedVenteDetails, setSelectedVenteDetails] = useState(null);
  const [selectedHistoryAction, setSelectedHistoryAction] = useState(null);
  const [selectedDevisDetails, setSelectedDevisDetails] = useState(null);
  
  // Client filtering states
  const [clientNameFilter, setClientNameFilter] = useState("");
  const [clientDateFilter, setClientDateFilter] = useState("");

  const handlePrint = () => {
    window.print();
  };

  // Form states
  const [client, setClient] = useState(clients[0]?.nom || "");
  const [total, setTotal] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [statut, setStatut] = useState("En attente");
  const [venteItems, setVenteItems] = useState([
    { id: 1, article: "", quantity: "1", unitPrice: "", description: "" }
  ]);

  const [devisClient, setDevisClient] = useState(clients[0]?.nom || "");
  const [devisDate, setDevisDate] = useState(new Date().toISOString().split("T")[0]);
  const [devisStatut, setDevisStatut] = useState("En attente");
  const [devisDescription, setDevisDescription] = useState("");
  const [devisItems, setDevisItems] = useState([
    { id: 1, article: "", length: "", width: "", quantity: "1", unitPrice: "" }
  ]);

  // New Client form states
  const [newClient, setNewClient] = useState({
    // 1. Informations générales
    typeClient: "Particulier",
    nom: "",
    nomCommercial: "",
    responsable: "",
    cin: "",
    matriculeFiscal: "",
    registreCommerce: "",
    tva: "",
    statut: "Actif",
    // 2. Coordonnées
    telephonePrincipal: "",
    telephoneSecondaire: "",
    whatsapp: "",
    email: "",
    siteWeb: "",
    // 3. Adresse
    gouvernorat: "",
    ville: "",
    delegation: "",
    codePostal: "",
    adresseComplete: "",
    adresseChantier: "",
    // 4. Informations Commerciales
    commercialResponsable: "",
    sourceClient: "",
    priorite: "Normale",
    categorie: "Standard",
    // 5. Informations Financières
    plafondCredit: "",
    soldeInitial: "0",
    devise: "EUR",
    conditionsPaiement: "30 jours",
    remiseDefaut: "0",
    // 6. Informations Projet
    projetNom: "",
    projetType: "",
    adresseChantierProjet: "",
    dateDebut: "",
    dateLivraison: "",
    surfaceEstimee: "",
    budgetEstime: "",
    architecte: "",
    entrepriseResponsable: "",
    // 7. Préférences Marbre
    typePierre: "Marbre",
    couleurPreferee: "",
    finition: "Poli",
    epaisseur: "2 cm",
    // 8. Documents
    documents: [],
    // 9. Notes
    observations: "",
    instructionsParticulieres: ""
  });

  const handleCreateVente = (e) => {
    e.preventDefault();
    
    // Calculate total from items
    const calculatedTotal = calculateVenteGrandTotal();
    
    if (calculatedTotal <= 0) {
      alert("Veuillez saisir au moins un article avec une quantité et un prix unitaire.");
      return;
    }
    
    const articles = venteItems.map(item => ({
      nom: item.article,
      quantite: parseFloat(item.quantity) || 1,
      prixUnitaire: parseFloat(item.unitPrice) || 0,
      total: calculateVenteRowTotal(item),
      description: item.description
    })).filter(item => item.nom && item.prixUnitaire > 0);
    
    addVenteRecord({ 
      client, 
      total: calculatedTotal, 
      date, 
      statut,
      articles 
    });
    setModalType(null);
    setClient(clients[0]?.nom || "");
    setTotal("");
    setDate(new Date().toISOString().split("T")[0]);
    setStatut("En attente");
    setVenteItems([{ id: 1, article: "", quantity: "1", unitPrice: "", description: "" }]);
  };

  const handleCreateDevis = (e) => {
    e.preventDefault();
    
    // Calculate grand total
    const grandTotal = devisItems.reduce((sum, item) => {
      const length = parseFloat(item.length) || 0;
      const width = parseFloat(item.width) || 0;
      const quantity = parseFloat(item.quantity) || 0;
      const unitPrice = parseFloat(item.unitPrice) || 0;
      return sum + (length * width * unitPrice * quantity);
    }, 0);
    
    if (grandTotal <= 0) {
      alert("Veuillez saisir au moins un article avec des dimensions et un prix unitaire.");
      return;
    }
    
    addDevisRecord({ 
      client: devisClient, 
      montant: grandTotal, 
      date: devisDate, 
      statut: devisStatut,
      description: devisDescription,
      items: devisItems.map(item => ({
        article: item.article,
        length: parseFloat(item.length) || 0,
        width: parseFloat(item.width) || 0,
        quantity: parseFloat(item.quantity) || 1,
        unitPrice: parseFloat(item.unitPrice) || 0,
        total: (parseFloat(item.length) || 0) * (parseFloat(item.width) || 0) * (parseFloat(item.unitPrice) || 0) * (parseFloat(item.quantity) || 1)
      }))
    });
    setModalType(null);
    setDevisClient(clients[0]?.nom || "");
    setDevisDate(new Date().toISOString().split("T")[0]);
    setDevisStatut("En attente");
    setDevisDescription("");
    setDevisItems([{ id: 1, article: "", length: "", width: "", quantity: "1", unitPrice: "" }]);
  };

  const addItemRow = () => {
    const newId = Math.max(...devisItems.map(item => item.id), 0) + 1;
    setDevisItems([...devisItems, { id: newId, article: "", length: "", width: "", quantity: "1", unitPrice: "" }]);
  };

  const removeItemRow = (id) => {
    if (devisItems.length > 1) {
      setDevisItems(devisItems.filter(item => item.id !== id));
    }
  };

  const updateItemRow = (id, field, value) => {
    setDevisItems(devisItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const addVenteItemRow = () => {
    const newId = Math.max(...venteItems.map(item => item.id), 0) + 1;
    setVenteItems([...venteItems, { id: newId, article: "", quantity: "1", unitPrice: "", description: "" }]);
  };

  const removeVenteItemRow = (id) => {
    if (venteItems.length > 1) {
      setVenteItems(venteItems.filter(item => item.id !== id));
    }
  };

  const updateVenteItemRow = (id, field, value) => {
    setVenteItems(venteItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const calculateRowTotal = (item) => {
    const length = parseFloat(item.length) || 0;
    const width = parseFloat(item.width) || 0;
    const quantity = parseFloat(item.quantity) || 0;
    const unitPrice = parseFloat(item.unitPrice) || 0;
    return length * width * unitPrice * quantity;
  };

  const calculateGrandTotal = () => {
    return devisItems.reduce((sum, item) => sum + calculateRowTotal(item), 0);
  };

  const calculateVenteRowTotal = (item) => {
    const quantity = parseFloat(item.quantity) || 0;
    const unitPrice = parseFloat(item.unitPrice) || 0;
    return quantity * unitPrice;
  };

  const calculateVenteGrandTotal = () => {
    return venteItems.reduce((sum, item) => sum + calculateVenteRowTotal(item), 0);
  };

  const handleCreateClient = (e) => {
    e.preventDefault();
    
    if (!newClient.nom) {
      alert("Veuillez saisir le nom du client.");
      return;
    }
    
    addClientRecord(newClient);
    
    // Reset form
    setNewClient({
      typeClient: "Particulier",
      nom: "",
      nomCommercial: "",
      responsable: "",
      cin: "",
      matriculeFiscal: "",
      registreCommerce: "",
      tva: "",
      statut: "Actif",
      telephonePrincipal: "",
      telephoneSecondaire: "",
      whatsapp: "",
      email: "",
      siteWeb: "",
      gouvernorat: "",
      ville: "",
      delegation: "",
      codePostal: "",
      adresseComplete: "",
      adresseChantier: "",
      commercialResponsable: "",
      sourceClient: "",
      priorite: "Normale",
      categorie: "Standard",
      plafondCredit: "",
      soldeInitial: "0",
      devise: "EUR",
      conditionsPaiement: "30 jours",
      remiseDefaut: "0",
      projetNom: "",
      projetType: "",
      adresseChantierProjet: "",
      dateDebut: "",
      dateLivraison: "",
      surfaceEstimee: "",
      budgetEstime: "",
      architecte: "",
      entrepriseResponsable: "",
      typePierre: "Marbre",
      couleurPreferee: "",
      finition: "Poli",
      epaisseur: "2 cm",
      documents: [],
      observations: "",
      instructionsParticulieres: ""
    });
    
    setModalType(null);
  };

  // Filter listings based on global search query
  const query = searchQuery.toLowerCase().trim();

  const filteredVentes = ventes.filter(
    (v) =>
      v.facture.toLowerCase().includes(query) ||
      v.client.toLowerCase().includes(query) ||
      v.statut.toLowerCase().includes(query)
  );

  const filteredClients = clients.filter(
    (c) => {
      const matchQuery =
        c.nom.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        c.telephone.includes(query);
      const matchName = !clientNameFilter || c.nom.toLowerCase().includes(clientNameFilter.toLowerCase());
      const matchDate = !clientDateFilter || true; // Date filter would need client creation date in data
      return matchQuery && matchName && matchDate;
    }
  );

  const filteredDevis = devis.filter(
    (d) =>
      d.numero.toLowerCase().includes(query) ||
      d.client.toLowerCase().includes(query) ||
      d.statut.toLowerCase().includes(query)
  );

  const tabs = [
    { id: "ventes", label: "Ventes" },
    { id: "clients", label: "Clients" },
    { id: "devis", label: "Devis" },
    { id: "factures", label: "Factures Émises" }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-3xl tracking-tight text-foreground m-0">
            Ventes & Clientèle
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Gérez vos opportunités d'affaires, devis commerciaux, factures clients et encaissements.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setModalType("vente")}
            className="inline-flex items-center justify-center space-x-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-3.5 py-2.5 rounded-xl shadow-md shadow-indigo-600/10 hover:shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Nouvelle Vente</span>
          </button>
          <button
            onClick={() => setModalType("devis")}
            className="inline-flex items-center justify-center space-x-1.5 bg-secondary hover:bg-secondary/80 text-foreground font-semibold text-xs px-3.5 py-2.5 rounded-xl border border-border shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Nouveau Devis</span>
          </button>
          <button
            onClick={() => setModalType("vente")}
            className="inline-flex items-center justify-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-3.5 py-2.5 rounded-xl shadow-md shadow-emerald-600/10 hover:shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <FileUp className="h-4 w-4" />
            <span>Nouvelle Facture</span>
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center justify-center space-x-1.5 bg-secondary hover:bg-secondary/80 text-foreground font-semibold text-xs px-3.5 py-2.5 rounded-xl border border-border shadow-sm transition-all active:scale-95 cursor-pointer"
            title="Imprimer"
          >
            <Printer className="h-4 w-4" />
            <span>Imprimer</span>
          </button>
        </div>
      </div>

      {/* Tabs list bar */}
      <div className="border-b border-border">
        <nav className="flex space-x-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 text-sm font-semibold tracking-wide transition-all border-b-2 
                ${activeTab === tab.id 
                  ? "border-indigo-600 text-foreground font-bold" 
                  : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content depending on Active Tab */}
      <div className="space-y-4">
        {activeTab === "ventes" && (
          <TableContainer>
            <THead>
              <Tr>
                <Th>Facture</Th>
                <Th>Client</Th>
                <Th>Date d'émission</Th>
                <Th>Total TTC</Th>
                <Th>Statut</Th>
                <th className="text-center">Détails</th>
              </Tr>
            </THead>
            <TBody>
              {filteredVentes.length === 0 ? (
                <Tr>
                  <Td colSpan={6} className="text-center py-8 text-muted-foreground">Aucune vente enregistrée.</Td>
                </Tr>
              ) : (
                filteredVentes.map((v) => (
                  <Tr key={v.id}>
                    <Td className="font-bold tracking-tight text-indigo-600 dark:text-indigo-400">{v.facture}</Td>
                    <Td className="font-medium">{v.client}</Td>
                    <Td className="text-muted-foreground">{v.date}</Td>
                    <Td className="font-semibold text-right sm:text-left">{v.total.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €</Td>
                    <Td><Badge status={v.statut} /></Td>
                    <Td className="text-center">
                      <button 
                        onClick={() => setSelectedVenteDetails(v)}
                        className="p-1.5 bg-secondary hover:bg-indigo-500/10 text-muted-foreground hover:text-indigo-600 rounded-lg transition-colors cursor-pointer"
                        title="Voir les détails"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </Td>
                  </Tr>
                ))
              )}
            </TBody>
          </TableContainer>
        )}

        {activeTab === "clients" && (
          <div className="space-y-4">
            {/* Client filters and add button */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-card border border-border/80 p-4 rounded-xl shadow-sm text-xs">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <span className="font-bold text-foreground">Filtres :</span>
                </div>
                
                <div className="flex items-center space-x-1 bg-secondary px-2 py-1 rounded-lg">
                  <span className="text-muted-foreground font-semibold">Nom :</span>
                  <input
                    type="text"
                    placeholder="Filtrer par nom..."
                    value={clientNameFilter}
                    onChange={(e) => setClientNameFilter(e.target.value)}
                    className="bg-transparent text-foreground font-bold focus:outline-none placeholder-muted-foreground/60 w-32"
                  />
                </div>
              </div>
              
              <button
                onClick={() => setModalType("client")}
                className="inline-flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-3.5 py-2.5 rounded-xl shadow-md shadow-indigo-600/10 hover:shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Nouveau Client</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredClients.length === 0 ? (
                <div className="col-span-full text-center py-8 text-muted-foreground bg-card border border-border rounded-xl">Aucun client trouvé.</div>
              ) : (
              filteredClients.map((c) => (
                <Card key={c.id} className="flex flex-col justify-between" hoverable>
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
                          <User className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-heading font-bold text-base">{c.nom}</h4>
                          <span className="text-[10px] bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Client Actif</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Solde Client</span>
                        <p className={`font-heading font-extrabold text-sm ${c.solde > 0 ? "text-emerald-600" : "text-rose-600"}`}>
                          {c.solde.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2 text-xs text-muted-foreground border-t border-border/50 pt-3">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-3.5 w-3.5" />
                        <span>{c.telephone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="truncate">{c.adresse}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-border/50">
                    <button
                      onClick={() => setSelectedClientHistory(c)}
                      className="w-full py-2 bg-secondary hover:bg-indigo-500/10 text-muted-foreground hover:text-indigo-600 font-semibold rounded-lg transition-colors text-xs flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <History className="h-3.5 w-3.5" />
                      <span>Voir l'historique</span>
                    </button>
                  </div>
                </Card>
              ))
              )}
            </div>
          </div>
        )}

        {activeTab === "devis" && (
          <TableContainer>
            <THead>
              <Tr>
                <Th>Numéro Devis</Th>
                <Th>Client</Th>
                <Th>Date</Th>
                <th>Surface (m²)</th>
                <th>Linéaire (m)</th>
                <th>Métrage (m)</th>
                <th>Type Projet</th>
                <Th>Montant Estimé</Th>
                <Th>Statut</Th>
                <th className="text-center">Détails</th>
              </Tr>
            </THead>
            <TBody>
              {filteredDevis.length === 0 ? (
                <Tr>
                  <Td colSpan={10} className="text-center py-8 text-muted-foreground">Aucun devis disponible.</Td>
                </Tr>
              ) : (
                filteredDevis.map((d) => (
                  <Tr key={d.id}>
                    <Td className="font-bold text-foreground">{d.numero}</Td>
                    <Td className="font-medium">{d.client}</Td>
                    <Td className="text-muted-foreground">{d.date}</Td>
                    <Td className="text-xs text-muted-foreground">{d.surface || "-"}</Td>
                    <Td className="text-xs text-muted-foreground">{d.lineaire || "-"}</Td>
                    <Td className="text-xs text-muted-foreground">{d.metrage || "-"}</Td>
                    <Td className="text-xs text-muted-foreground">{d.typeProjet || "-"}</Td>
                    <Td className="font-semibold text-right sm:text-left">{d.montant.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €</Td>
                    <Td><Badge status={d.statut} /></Td>
                    <Td className="text-center">
                      <button
                        onClick={() => setSelectedDevisDetails(d)}
                        className="p-1.5 bg-secondary hover:bg-indigo-500/10 text-muted-foreground hover:text-indigo-600 rounded-lg transition-colors cursor-pointer"
                        title="Voir les détails"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </Td>
                  </Tr>
                ))
              )}
            </TBody>
          </TableContainer>
        )}

        {activeTab === "factures" && (
          <TableContainer>
            <THead>
              <Tr>
                <Th>Numéro Facture</Th>
                <Th>Client</Th>
                <Th>Montant TTC</Th>
                <Th>Date d'émission</Th>
                <Th className="text-center">Action PDF</Th>
              </Tr>
            </THead>
            <TBody>
              {filteredVentes.length === 0 ? (
                <Tr>
                  <Td colSpan={5} className="text-center py-8 text-muted-foreground">Aucune facture émise.</Td>
                </Tr>
              ) : (
                filteredVentes.map((v) => (
                  <Tr key={v.id}>
                    <Td className="font-semibold text-foreground">{v.facture}</Td>
                    <Td className="font-medium">{v.client}</Td>
                    <Td className="font-bold">{v.total.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €</Td>
                    <Td className="text-muted-foreground">{v.date}</Td>
                    <Td className="text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => setSelectedVentePdf(v)}
                          className="p-1.5 bg-secondary hover:bg-indigo-500/10 text-muted-foreground hover:text-indigo-600 rounded-lg transition-colors"
                          title="Visualiser la facture PDF"
                        >
                          <FileText className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => alert(`Téléchargement de la facture client ${v.facture} en cours...`)}
                          className="p-1.5 bg-secondary hover:bg-emerald-500/10 text-muted-foreground hover:text-emerald-600 rounded-lg transition-colors"
                          title="Télécharger la facture"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </Td>
                  </Tr>
                ))
              )}
            </TBody>
          </TableContainer>
        )}
      </div>

      {/* Nouvelle Vente Modal */}
      <Modal isOpen={modalType === "vente"} onClose={() => setModalType(null)} title="Créer une Nouvelle Vente / Facture">
        <form onSubmit={handleCreateVente} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold mb-1 text-muted-foreground">Sélectionner un Client</label>
            <select
              value={client}
              onChange={(e) => setClient(e.target.value)}
              className="w-full p-2.5 bg-input border border-border rounded-lg text-foreground text-xs focus:ring-1 focus:ring-ring focus:outline-none"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.nom}>{c.nom}</option>
              ))}
            </select>
          </div>

          {/* Items Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block font-semibold text-muted-foreground">Articles / Produits</label>
              <button
                type="button"
                onClick={addVenteItemRow}
                className="inline-flex items-center space-x-1 px-3 py-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-500/20 transition-colors text-xs font-medium"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Ajouter</span>
              </button>
            </div>

            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="px-3 py-2 text-xs font-semibold text-muted-foreground">Article</th>
                    <th className="px-3 py-2 text-xs font-semibold text-muted-foreground w-20">Quantité</th>
                    <th className="px-3 py-2 text-xs font-semibold text-muted-foreground w-24">Prix Unitaire (€)</th>
                    <th className="px-3 py-2 text-xs font-semibold text-muted-foreground w-24">Total (€)</th>
                    <th className="px-3 py-2 text-xs font-semibold text-muted-foreground w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {venteItems.map((item, index) => (
                    <tr key={item.id} className="hover:bg-secondary/30">
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          placeholder="Nom de l'article"
                          value={item.article}
                          onChange={(e) => updateVenteItemRow(item.id, "article", e.target.value)}
                          className="w-full p-1.5 bg-input border border-border rounded text-foreground text-xs focus:ring-1 focus:ring-ring focus:outline-none"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          step="1"
                          placeholder="1"
                          value={item.quantity}
                          onChange={(e) => updateVenteItemRow(item.id, "quantity", e.target.value)}
                          className="w-full p-1.5 bg-input border border-border rounded text-foreground text-xs focus:ring-1 focus:ring-ring focus:outline-none"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={item.unitPrice}
                          onChange={(e) => updateVenteItemRow(item.id, "unitPrice", e.target.value)}
                          className="w-full p-1.5 bg-input border border-border rounded text-foreground text-xs focus:ring-1 focus:ring-ring focus:outline-none"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <span className="font-semibold text-foreground">
                          {calculateVenteRowTotal(item).toLocaleString("fr-FR", { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        {venteItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeVenteItemRow(item.id)}
                            className="p-1 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Grand Total */}
            <div className="flex justify-end items-center space-x-4 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 border border-indigo-500/20 rounded-xl p-4">
              <span className="text-xs font-semibold text-muted-foreground">Total TTC:</span>
              <span className="text-lg font-bold text-foreground">
                {calculateVenteGrandTotal().toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
              </span>
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1 text-muted-foreground">Date de facturation</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2.5 bg-input border border-border rounded-lg text-foreground text-xs focus:ring-1 focus:ring-ring focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-muted-foreground">Statut de Règlement initial</label>
            <select
              value={statut}
              onChange={(e) => setStatut(e.target.value)}
              className="w-full p-2.5 bg-input border border-border rounded-lg text-foreground text-xs focus:ring-1 focus:ring-ring focus:outline-none"
            >
              <option value="Payé">Payé (Encaissé entièrement)</option>
              <option value="En attente">En attente de paiement</option>
              <option value="Partiel">Partiel (Acompte 40% encaissé)</option>
            </select>
          </div>

          <div className="flex space-x-3 pt-4 border-t border-border mt-6">
            <button
              type="submit"
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-sm hover:shadow active:scale-95 transition-all text-xs cursor-pointer"
            >
              Créer la facture
            </button>
            <button
              type="button"
              onClick={() => setModalType(null)}
              className="flex-1 py-2.5 bg-secondary hover:bg-secondary/80 text-foreground font-semibold rounded-lg transition-colors text-xs cursor-pointer"
            >
              Annuler
            </button>
          </div>
        </form>
      </Modal>

      {/* Nouveau Devis Modal */}
      <Modal isOpen={modalType === "devis"} onClose={() => setModalType(null)} title="Préparer un Nouveau Devis">
        <form onSubmit={handleCreateDevis} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold mb-1 text-muted-foreground">Sélectionner un Client</label>
            <select
              value={devisClient}
              onChange={(e) => setDevisClient(e.target.value)}
              className="w-full p-2.5 bg-input border border-border rounded-lg text-foreground text-xs focus:ring-1 focus:ring-ring focus:outline-none"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.nom}>{c.nom}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1 text-muted-foreground">Description du projet</label>
            <textarea
              placeholder="Description détaillée du projet..."
              value={devisDescription}
              onChange={(e) => setDevisDescription(e.target.value)}
              rows="3"
              className="w-full p-2.5 bg-input border border-border rounded-lg text-foreground text-xs focus:ring-1 focus:ring-ring focus:outline-none resize-none"
            />
          </div>

          {/* Items Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block font-semibold text-muted-foreground">Articles / Produits</label>
              <button
                type="button"
                onClick={addItemRow}
                className="inline-flex items-center space-x-1 px-3 py-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-500/20 transition-colors text-xs font-medium"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Ajouter</span>
              </button>
            </div>

            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="px-3 py-2 text-xs font-semibold text-muted-foreground">Article</th>
                    <th className="px-3 py-2 text-xs font-semibold text-muted-foreground w-20">Longueur (m)</th>
                    <th className="px-3 py-2 text-xs font-semibold text-muted-foreground w-20">Largeur (m)</th>
                    <th className="px-3 py-2 text-xs font-semibold text-muted-foreground w-20">Quantité</th>
                    <th className="px-3 py-2 text-xs font-semibold text-muted-foreground w-24">Prix Unitaire (€)</th>
                    <th className="px-3 py-2 text-xs font-semibold text-muted-foreground w-24">Total (€)</th>
                    <th className="px-3 py-2 text-xs font-semibold text-muted-foreground w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {devisItems.map((item, index) => (
                    <tr key={item.id} className="hover:bg-secondary/30">
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          placeholder="Nom de l'article"
                          value={item.article}
                          onChange={(e) => updateItemRow(item.id, "article", e.target.value)}
                          className="w-full p-1.5 bg-input border border-border rounded text-foreground text-xs focus:ring-1 focus:ring-ring focus:outline-none"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={item.length}
                          onChange={(e) => updateItemRow(item.id, "length", e.target.value)}
                          className="w-full p-1.5 bg-input border border-border rounded text-foreground text-xs focus:ring-1 focus:ring-ring focus:outline-none"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={item.width}
                          onChange={(e) => updateItemRow(item.id, "width", e.target.value)}
                          className="w-full p-1.5 bg-input border border-border rounded text-foreground text-xs focus:ring-1 focus:ring-ring focus:outline-none"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          step="1"
                          placeholder="1"
                          value={item.quantity}
                          onChange={(e) => updateItemRow(item.id, "quantity", e.target.value)}
                          className="w-full p-1.5 bg-input border border-border rounded text-foreground text-xs focus:ring-1 focus:ring-ring focus:outline-none"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={item.unitPrice}
                          onChange={(e) => updateItemRow(item.id, "unitPrice", e.target.value)}
                          className="w-full p-1.5 bg-input border border-border rounded text-foreground text-xs focus:ring-1 focus:ring-ring focus:outline-none"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <span className="font-semibold text-foreground">
                          {calculateRowTotal(item).toLocaleString("fr-FR", { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        {devisItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItemRow(item.id)}
                            className="p-1 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Grand Total */}
            <div className="flex justify-end items-center space-x-4 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 border border-indigo-500/20 rounded-xl p-4">
              <span className="font-semibold text-muted-foreground">Total Général:</span>
              <span className="font-bold text-2xl text-foreground">
                {calculateGrandTotal().toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
              </span>
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1 text-muted-foreground">Date du devis</label>
            <input
              type="date"
              required
              value={devisDate}
              onChange={(e) => setDevisDate(e.target.value)}
              className="w-full p-2.5 bg-input border border-border rounded-lg text-foreground text-xs focus:ring-1 focus:ring-ring focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-muted-foreground">Statut du Devis</label>
            <select
              value={devisStatut}
              onChange={(e) => setDevisStatut(e.target.value)}
              className="w-full p-2.5 bg-input border border-border rounded-lg text-foreground text-xs focus:ring-1 focus:ring-ring focus:outline-none"
            >
              <option value="En attente">En attente de validation</option>
              <option value="Accepté">Accepté par le client</option>
              <option value="Refusé">Refusé</option>
            </select>
          </div>

          <div className="flex space-x-3 pt-4 border-t border-border mt-6">
            <button
              type="submit"
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-sm hover:shadow active:scale-95 transition-all text-xs cursor-pointer"
            >
              Générer le devis
            </button>
            <button
              type="button"
              onClick={() => setModalType(null)}
              className="flex-1 py-2.5 bg-secondary hover:bg-secondary/80 text-foreground font-semibold rounded-lg transition-colors text-xs cursor-pointer"
            >
              Annuler
            </button>
          </div>
        </form>
      </Modal>

      {/* Nouveau Client Modal */}
      <Modal isOpen={modalType === "client"} onClose={() => setModalType(null)} title="Nouveau Client">
        <form onSubmit={handleCreateClient} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold mb-1 text-muted-foreground">Nom / Raison Sociale *</label>
            <input
              type="text"
              required
              value={newClient.nom}
              onChange={(e) => setNewClient({...newClient, nom: e.target.value})}
              className="w-full p-2.5 bg-input border border-border rounded-lg text-foreground focus:ring-1 focus:ring-ring focus:outline-none"
              placeholder="Nom du client ou de l'entreprise"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-muted-foreground">Téléphone</label>
            <input
              type="tel"
              value={newClient.telephonePrincipal}
              onChange={(e) => setNewClient({...newClient, telephonePrincipal: e.target.value})}
              className="w-full p-2.5 bg-input border border-border rounded-lg text-foreground focus:ring-1 focus:ring-ring focus:outline-none"
              placeholder="+33 6 12 34 56 78"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-muted-foreground">Email</label>
            <input
              type="email"
              value={newClient.email}
              onChange={(e) => setNewClient({...newClient, email: e.target.value})}
              className="w-full p-2.5 bg-input border border-border rounded-lg text-foreground focus:ring-1 focus:ring-ring focus:outline-none"
              placeholder="client@example.com"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-muted-foreground">Adresse</label>
            <input
              type="text"
              value={newClient.adresseComplete}
              onChange={(e) => setNewClient({...newClient, adresseComplete: e.target.value})}
              className="w-full p-2.5 bg-input border border-border rounded-lg text-foreground focus:ring-1 focus:ring-ring focus:outline-none"
              placeholder="Adresse complète"
            />
          </div>

          <div className="flex space-x-3 pt-4 border-t border-border mt-6">
            <button
              type="submit"
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-sm hover:shadow active:scale-95 transition-all text-xs cursor-pointer"
            >
              Enregistrer
            </button>
            <button
              type="button"
              onClick={() => setModalType(null)}
              className="flex-1 py-2.5 bg-secondary hover:bg-secondary/80 text-foreground font-semibold rounded-lg transition-colors text-xs cursor-pointer"
            >
              Annuler
            </button>
          </div>
        </form>
      </Modal>

      {/* Client Historique Modal */}
      <Modal isOpen={!!selectedClientHistory} onClose={() => setSelectedClientHistory(null)} title={`Historique - ${selectedClientHistory?.nom}`}>
        {selectedClientHistory && (
          <div className="space-y-4 text-xs">
            <div className="bg-secondary/30 p-3 rounded-lg">
              <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                <Clock className="h-4 w-4" />
                <span className="font-semibold">Actions récentes pour ce client</span>
              </div>
              <div className="space-y-2">
                {/* Simulated client history based on ventes and devis */}
                {ventes.filter(v => v.client === selectedClientHistory.nom).map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedHistoryAction({ type: 'vente', data: v })}
                    className="bg-card p-2 rounded border border-border/50 w-full text-left hover:bg-secondary/50 transition-colors cursor-pointer"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-indigo-600">{v.facture}</span>
                        <span className="text-muted-foreground ml-2">Vente</span>
                      </div>
                      <span className="text-muted-foreground">{v.date}</span>
                    </div>
                    <div className="mt-1 text-muted-foreground">
                      Montant: {v.total.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} € - Statut: {v.statut}
                    </div>
                  </button>
                ))}
                {devis.filter(d => d.client === selectedClientHistory.nom).map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setSelectedHistoryAction({ type: 'devis', data: d })}
                    className="bg-card p-2 rounded border border-border/50 w-full text-left hover:bg-secondary/50 transition-colors cursor-pointer"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-foreground">{d.numero}</span>
                        <span className="text-muted-foreground ml-2">Devis</span>
                      </div>
                      <span className="text-muted-foreground">{d.date}</span>
                    </div>
                    <div className="mt-1 text-muted-foreground">
                      Montant: {d.montant.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} € - Statut: {d.statut}
                      {d.surface && <span className="ml-2">- Surface: {d.surface}m²</span>}
                    </div>
                  </button>
                ))}
                {ventes.filter(v => v.client === selectedClientHistory.nom).length === 0 && 
                 devis.filter(d => d.client === selectedClientHistory.nom).length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    Aucune action enregistrée pour ce client.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* History Action Details Modal */}
      <Modal isOpen={!!selectedHistoryAction} onClose={() => setSelectedHistoryAction(null)} title={`Détails : ${selectedHistoryAction?.type === 'vente' ? selectedHistoryAction.data.facture : selectedHistoryAction?.type === 'devis' ? selectedHistoryAction.data.numero : selectedHistoryAction?.data.numero}`}>
        {selectedHistoryAction && (() => {
          const { type, data } = selectedHistoryAction;
          if (type === 'vente') {
            const client = clients.find(c => c.nom === data.client);
            return (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-secondary/30 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                      <User className="h-4 w-4" />
                      <span className="font-semibold">Client</span>
                    </div>
                    <p className="font-bold text-foreground">{data.client}</p>
                  </div>
                  <div className="bg-secondary/30 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                      <FileText className="h-4 w-4" />
                      <span className="font-semibold">Facture</span>
                    </div>
                    <p className="font-bold text-foreground">{data.facture}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-secondary/30 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                      <Calendar className="h-4 w-4" />
                      <span className="font-semibold">Date</span>
                    </div>
                    <p className="font-semibold text-foreground">{data.date}</p>
                  </div>
                  <div className="bg-secondary/30 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-semibold">Total TTC</span>
                    </div>
                    <p className="font-bold text-foreground">{data.total.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €</p>
                  </div>
                </div>
                <div className="bg-secondary/30 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                    <CheckCircle className="h-4 w-4" />
                    <span className="font-semibold">Statut</span>
                  </div>
                  <Badge status={data.statut} />
                </div>
                {client && (
                  <div className="bg-secondary/30 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                      <User className="h-4 w-4" />
                      <span className="font-semibold">Informations Client</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">{client.telephone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">{client.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground truncate">{client.adresse}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          } else if (type === 'devis') {
            const client = clients.find(c => c.nom === data.client);
            return (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-secondary/30 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                      <User className="h-4 w-4" />
                      <span className="font-semibold">Client</span>
                    </div>
                    <p className="font-bold text-foreground">{data.client}</p>
                  </div>
                  <div className="bg-secondary/30 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                      <FileText className="h-4 w-4" />
                      <span className="font-semibold">Numéro Devis</span>
                    </div>
                    <p className="font-bold text-foreground">{data.numero}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-secondary/30 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                      <Calendar className="h-4 w-4" />
                      <span className="font-semibold">Date</span>
                    </div>
                    <p className="font-semibold text-foreground">{data.date}</p>
                  </div>
                  <div className="bg-secondary/30 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-semibold">Montant</span>
                    </div>
                    <p className="font-bold text-foreground">{data.montant.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €</p>
                  </div>
                </div>
                <div className="bg-secondary/30 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                    <CheckCircle className="h-4 w-4" />
                    <span className="font-semibold">Statut</span>
                  </div>
                  <Badge status={data.statut} />
                </div>
                {(data.surface || data.lineaire || data.metrage || data.typeProjet || data.description) && (
                  <div className="bg-secondary/30 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                      <FileText className="h-4 w-4" />
                      <span className="font-semibold">Détails Projet</span>
                    </div>
                    <div className="space-y-1">
                      {data.surface && <p className="text-muted-foreground">Surface: {data.surface} m²</p>}
                      {data.lineaire && <p className="text-muted-foreground">Linéaire: {data.lineaire} m</p>}
                      {data.metrage && <p className="text-muted-foreground">Métrage: {data.metrage} m</p>}
                      {data.typeProjet && <p className="text-muted-foreground">Type: {data.typeProjet}</p>}
                      {data.description && <p className="text-muted-foreground italic">{data.description}</p>}
                    </div>
                  </div>
                )}
                {client && (
                  <div className="bg-secondary/30 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                      <User className="h-4 w-4" />
                      <span className="font-semibold">Informations Client</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">{client.telephone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">{client.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground truncate">{client.adresse}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          } else if (type === 'commande') {
            const client = clients.find(c => c.nom === data.client);
            return (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-secondary/30 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                      <User className="h-4 w-4" />
                      <span className="font-semibold">Client</span>
                    </div>
                    <p className="font-bold text-foreground">{data.client}</p>
                  </div>
                  <div className="bg-secondary/30 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                      <FileText className="h-4 w-4" />
                      <span className="font-semibold">Numéro Commande</span>
                    </div>
                    <p className="font-bold text-foreground">{data.numero}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-secondary/30 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                      <Calendar className="h-4 w-4" />
                      <span className="font-semibold">Date</span>
                    </div>
                    <p className="font-semibold text-foreground">{data.date}</p>
                  </div>
                  <div className="bg-secondary/30 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-semibold">Montant</span>
                    </div>
                    <p className="font-bold text-foreground">{data.montant.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €</p>
                  </div>
                </div>
                <div className="bg-secondary/30 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                    <CheckCircle className="h-4 w-4" />
                    <span className="font-semibold">État</span>
                  </div>
                  <Badge status={data.etat} />
                </div>
                {data.articles && data.articles.length > 0 && (
                  <div className="bg-secondary/30 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                      <Package className="h-4 w-4" />
                      <span className="font-semibold">Articles</span>
                    </div>
                    <div className="space-y-2">
                      {data.articles.map((article, idx) => (
                        <div key={idx} className="border-l-2 border-indigo-500 pl-3 py-1">
                          <p className="font-semibold text-foreground">{article.label}</p>
                          <p className="text-muted-foreground">Quantité: {article.quantite}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {data.factureLiee && (
                  <div className="bg-secondary/30 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                      <FileText className="h-4 w-4" />
                      <span className="font-semibold">Facture liée</span>
                    </div>
                    <p className="font-semibold text-foreground">{data.factureLiee}</p>
                  </div>
                )}
                {client && (
                  <div className="bg-secondary/30 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                      <User className="h-4 w-4" />
                      <span className="font-semibold">Informations Client</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">{client.telephone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">{client.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground truncate">{client.adresse}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          }
          return null;
        })()}
      </Modal>

      {/* Devis Details Modal */}
      <Modal isOpen={!!selectedDevisDetails} onClose={() => setSelectedDevisDetails(null)} title={`Détails Devis : ${selectedDevisDetails?.numero}`}>
        {selectedDevisDetails && (() => {
          const client = clients.find(c => c.nom === selectedDevisDetails.client);
          return (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary/30 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                    <User className="h-4 w-4" />
                    <span className="font-semibold">Client</span>
                  </div>
                  <p className="font-bold text-foreground">{selectedDevisDetails.client}</p>
                </div>
                <div className="bg-secondary/30 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                    <FileText className="h-4 w-4" />
                    <span className="font-semibold">Numéro Devis</span>
                  </div>
                  <p className="font-bold text-foreground">{selectedDevisDetails.numero}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary/30 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4" />
                    <span className="font-semibold">Date</span>
                  </div>
                  <p className="font-semibold text-foreground">{selectedDevisDetails.date}</p>
                </div>
                <div className="bg-secondary/30 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-semibold">Montant Estimé</span>
                  </div>
                  <p className="font-bold text-foreground">{selectedDevisDetails.montant.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €</p>
                </div>
              </div>

              <div className="bg-secondary/30 p-3 rounded-lg">
                <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-semibold">Statut</span>
                </div>
                <Badge status={selectedDevisDetails.statut} />
              </div>

              {(selectedDevisDetails.surface || selectedDevisDetails.lineaire || selectedDevisDetails.metrage || selectedDevisDetails.typeProjet || selectedDevisDetails.description) && (
                <div className="bg-secondary/30 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                    <FileText className="h-4 w-4" />
                    <span className="font-semibold">Détails Projet</span>
                  </div>
                  <div className="space-y-1">
                    {selectedDevisDetails.surface && <p className="text-muted-foreground">Surface: {selectedDevisDetails.surface} m²</p>}
                    {selectedDevisDetails.lineaire && <p className="text-muted-foreground">Linéaire: {selectedDevisDetails.lineaire} m</p>}
                    {selectedDevisDetails.metrage && <p className="text-muted-foreground">Métrage: {selectedDevisDetails.metrage} m</p>}
                    {selectedDevisDetails.typeProjet && <p className="text-muted-foreground">Type: {selectedDevisDetails.typeProjet}</p>}
                    {selectedDevisDetails.description && <p className="text-muted-foreground italic">{selectedDevisDetails.description}</p>}
                  </div>
                </div>
              )}

              {client && (
                <div className="bg-secondary/30 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                    <User className="h-4 w-4" />
                    <span className="font-semibold">Informations Client</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">{client.telephone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">{client.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground truncate">{client.adresse}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Solde: {client.solde.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })()}
      </Modal>

      {/* Sale Details Modal */}
      <Modal isOpen={!!selectedVenteDetails} onClose={() => setSelectedVenteDetails(null)} title={`Détails Vente : ${selectedVenteDetails?.facture}`}>
        {selectedVenteDetails && (() => {
          const client = clients.find(c => c.nom === selectedVenteDetails.client);
          return (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary/30 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                    <User className="h-4 w-4" />
                    <span className="font-semibold">Client</span>
                  </div>
                  <p className="font-bold text-foreground">{selectedVenteDetails.client}</p>
                </div>
                <div className="bg-secondary/30 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                    <FileText className="h-4 w-4" />
                    <span className="font-semibold">Facture</span>
                  </div>
                  <p className="font-bold text-foreground">{selectedVenteDetails.facture}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary/30 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4" />
                    <span className="font-semibold">Date d'émission</span>
                  </div>
                  <p className="font-semibold text-foreground">{selectedVenteDetails.date}</p>
                </div>
                <div className="bg-secondary/30 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-semibold">Total TTC</span>
                  </div>
                  <p className="font-bold text-foreground">{selectedVenteDetails.total.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €</p>
                </div>
              </div>

              <div className="bg-secondary/30 p-3 rounded-lg">
                <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-semibold">Statut</span>
                </div>
                <Badge status={selectedVenteDetails.statut} />
              </div>

              {client && (
                <div className="bg-secondary/30 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                    <User className="h-4 w-4" />
                    <span className="font-semibold">Informations Client</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">{client.telephone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">{client.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground truncate">{client.adresse}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Solde: {client.solde.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Articles achetés section */}
              {selectedVenteDetails.articles && selectedVenteDetails.articles.length > 0 ? (
                <div className="bg-secondary/30 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                    <Package className="h-4 w-4" />
                    <span className="font-semibold">Articles achetés</span>
                  </div>
                  <div className="space-y-2">
                    {selectedVenteDetails.articles.map((article, idx) => (
                      <div key={idx} className="bg-card p-2 rounded border border-border/50">
                        <p className="font-bold text-foreground">{article.nom}</p>
                        <div className="flex items-center space-x-3 text-xs text-muted-foreground mt-1">
                          <span>Quantité: {article.quantite}</span>
                          {article.prixUnitaire && (
                            <span>Prix unitaire: {article.prixUnitaire.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €</span>
                          )}
                          {article.total && (
                            <span className="font-semibold text-foreground">Total: {article.total.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €</span>
                          )}
                        </div>
                        {article.description && (
                          <p className="text-muted-foreground text-xs italic mt-1">{article.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-secondary/30 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                    <Package className="h-4 w-4" />
                    <span className="font-semibold">Articles achetés</span>
                  </div>
                  <p className="text-muted-foreground text-xs">Aucun article détaillé disponible pour cette vente.</p>
                </div>
              )}
            </div>
          );
        })()}
      </Modal>

      {/* PDF View Modal Simulation */}
      <Modal isOpen={!!selectedVentePdf} onClose={() => setSelectedVentePdf(null)} title={`Facture Vente Client : ${selectedVentePdf?.facture}`}>
        {selectedVentePdf && (
          <div className="p-5 bg-white text-slate-900 rounded-xl space-y-6 font-mono text-[11px] leading-relaxed border border-slate-200 shadow">
            {/* Header company logo & name */}
            <div className="flex justify-between border-b border-slate-300 pb-4">
              <div>
                <h4 className="font-bold text-sm tracking-tight text-indigo-600">{societe.nom}</h4>
                <p>{societe.adresse}</p>
                <p>Tel: {societe.telephone}</p>
              </div>
              <div className="text-right">
                <h3 className="text-xs font-bold uppercase tracking-wide">FACTURE CLIENT</h3>
                <p>N°: <span className="font-bold">{selectedVentePdf.facture}</span></p>
                <p>Date: {selectedVentePdf.date}</p>
              </div>
            </div>

            {/* Billing details */}
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-200">
              <div>
                <p className="font-bold text-slate-500 uppercase text-[9px]">Émetteur</p>
                <p className="font-semibold">{societe.nom}</p>
                <p>Service Facturation Ventes</p>
                <p>{societe.email}</p>
              </div>
              <div>
                <p className="font-bold text-slate-500 uppercase text-[9px]">Facturé à</p>
                <p className="font-semibold">{selectedVentePdf.client}</p>
                <p>Adresse de Facturation Client</p>
                <p>France</p>
              </div>
            </div>

            {/* Line items table */}
            <div className="space-y-2">
              <div className="grid grid-cols-5 font-bold border-b border-slate-300 pb-1 text-slate-700">
                <span className="col-span-3">Désignation Prest.</span>
                <span className="text-center">Qte</span>
                <span className="text-right">Total HT</span>
              </div>
              <div className="grid grid-cols-5 border-b border-slate-100 pb-1">
                <span className="col-span-3">Solutions & Services ERP Commercial Logiciel</span>
                <span className="text-center">1</span>
                <span className="text-right">{(selectedVentePdf.total / 1.2).toFixed(2)} €</span>
              </div>
            </div>

            {/* Invoice summaries */}
            <div className="flex justify-end pt-4">
              <div className="w-48 space-y-1.5 text-right">
                <div className="flex justify-between">
                  <span>Sous-Total HT :</span>
                  <span>{(selectedVentePdf.total / 1.2).toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span>TVA (20%) :</span>
                  <span>{(selectedVentePdf.total - (selectedVentePdf.total / 1.2)).toFixed(2)} €</span>
                </div>
                <div className="flex justify-between font-bold text-xs border-t border-slate-300 pt-1 text-indigo-600">
                  <span>Total TTC :</span>
                  <span>{selectedVentePdf.total.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €</span>
                </div>
              </div>
            </div>

            {/* Status Stamp overlay simulation */}
            <div className="flex items-center space-x-2 text-[10px] mt-4 font-bold">
              <span>Statut de Facturation :</span>
              <span className={`px-2 py-0.5 rounded ${selectedVentePdf.statut === "Payé" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                {selectedVentePdf.statut.toUpperCase()}
              </span>
            </div>

            {/* Footer */}
            <div className="text-center text-[9px] text-slate-400 pt-6 border-t border-slate-200">
              IBAN: FR76 3000 2000 1000 1234 5678 901 | BIC: ERPPROXX<br />
              Merci pour votre confiance.
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
