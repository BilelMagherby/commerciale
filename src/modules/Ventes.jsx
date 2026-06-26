import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Card, Badge, Modal, TableContainer, THead, TBody, Tr, Th, Td } from "../components/ui/SharedUI";
import { Plus, FileText, Download, User, Phone, MapPin, CheckCircle, FileUp, History, Clock, Filter, Printer, Eye, DollarSign, Calendar, Package, Mail } from "lucide-react";

export default function Ventes() {
  const {
    ventes,
    clients,
    devis,
    commandes,
    searchQuery,
    addVenteRecord,
    addDevisRecord,
    societe
  } = useApp();

  const [activeTab, setActiveTab] = useState("ventes");
  const [modalType, setModalType] = useState(null); // 'vente', 'devis', or null
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

  const [devisClient, setDevisClient] = useState(clients[0]?.nom || "");
  const [devisMontant, setDevisMontant] = useState("");
  const [devisDate, setDevisDate] = useState(new Date().toISOString().split("T")[0]);
  const [devisStatut, setDevisStatut] = useState("En attente");
  const [devisSurface, setDevisSurface] = useState("");
  const [devisLineaire, setDevisLineaire] = useState("");
  const [devisMetrage, setDevisMetrage] = useState("");
  const [devisTypeProjet, setDevisTypeProjet] = useState("");
  const [devisDescription, setDevisDescription] = useState("");

  const handleCreateVente = (e) => {
    e.preventDefault();
    if (!total || parseFloat(total) <= 0) {
      alert("Veuillez saisir un total valide.");
      return;
    }
    addVenteRecord({ client, total, date, statut });
    setModalType(null);
    setTotal("");
    setStatut("En attente");
  };

  const handleCreateDevis = (e) => {
    e.preventDefault();
    if (!devisMontant || parseFloat(devisMontant) <= 0) {
      alert("Veuillez saisir un montant de devis valide.");
      return;
    }
    addDevisRecord({ 
      client: devisClient, 
      montant: devisMontant, 
      date: devisDate, 
      statut: devisStatut,
      surface: parseFloat(devisSurface) || 0,
      lineaire: parseFloat(devisLineaire) || 0,
      metrage: parseFloat(devisMetrage) || 0,
      typeProjet: devisTypeProjet,
      description: devisDescription
    });
    setModalType(null);
    setDevisMontant("");
    setDevisStatut("En attente");
    setDevisSurface("");
    setDevisLineaire("");
    setDevisMetrage("");
    setDevisTypeProjet("");
    setDevisDescription("");
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
            {/* Client filters */}
            <div className="flex flex-wrap items-center gap-4 bg-card border border-border/80 p-4 rounded-xl shadow-sm text-xs">
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

          <div>
            <label className="block font-semibold mb-1 text-muted-foreground">Total de la transaction TTC (€)</label>
            <input
              type="number"
              step="0.01"
              required
              placeholder="Ex: 5000.00"
              value={total}
              onChange={(e) => setTotal(e.target.value)}
              className="w-full p-2.5 bg-input border border-border rounded-lg text-foreground text-xs focus:ring-1 focus:ring-ring focus:outline-none"
            />
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

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold mb-1 text-muted-foreground">Surface (m²)</label>
              <input
                type="number"
                step="0.01"
                placeholder="Ex: 250"
                value={devisSurface}
                onChange={(e) => setDevisSurface(e.target.value)}
                className="w-full p-2.5 bg-input border border-border rounded-lg text-foreground text-xs focus:ring-1 focus:ring-ring focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-muted-foreground">Linéaire (m)</label>
              <input
                type="number"
                step="0.01"
                placeholder="Ex: 50"
                value={devisLineaire}
                onChange={(e) => setDevisLineaire(e.target.value)}
                className="w-full p-2.5 bg-input border border-border rounded-lg text-foreground text-xs focus:ring-1 focus:ring-ring focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-muted-foreground">Métrage (m)</label>
              <input
                type="number"
                step="0.01"
                placeholder="Ex: 100"
                value={devisMetrage}
                onChange={(e) => setDevisMetrage(e.target.value)}
                className="w-full p-2.5 bg-input border border-border rounded-lg text-foreground text-xs focus:ring-1 focus:ring-ring focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1 text-muted-foreground">Type de Projet</label>
            <select
              value={devisTypeProjet}
              onChange={(e) => setDevisTypeProjet(e.target.value)}
              className="w-full p-2.5 bg-input border border-border rounded-lg text-foreground text-xs focus:ring-1 focus:ring-ring focus:outline-none"
            >
              <option value="">Sélectionner...</option>
              <option value="Rénovation">Rénovation</option>
              <option value="Construction">Construction</option>
              <option value="Installation">Installation</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Extension">Extension</option>
              <option value="Réparation">Réparation</option>
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

          <div>
            <label className="block font-semibold mb-1 text-muted-foreground">Montant estimatif HT (€)</label>
            <input
              type="number"
              step="0.01"
              required
              placeholder="Ex: 8500.00"
              value={devisMontant}
              onChange={(e) => setDevisMontant(e.target.value)}
              className="w-full p-2.5 bg-input border border-border rounded-lg text-foreground text-xs focus:ring-1 focus:ring-ring focus:outline-none"
            />
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
                {/* Simulated client history based on ventes, devis, and commandes */}
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
                {commandes.filter(cmd => cmd.client === selectedClientHistory.nom).map((cmd) => (
                  <button
                    key={cmd.id}
                    onClick={() => setSelectedHistoryAction({ type: 'commande', data: cmd })}
                    className="bg-card p-2 rounded border border-border/50 w-full text-left hover:bg-secondary/50 transition-colors cursor-pointer"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-foreground">{cmd.numero}</span>
                        <span className="text-muted-foreground ml-2">Commande</span>
                      </div>
                      <span className="text-muted-foreground">{cmd.date}</span>
                    </div>
                    <div className="mt-1 text-muted-foreground">
                      Montant: {cmd.montant.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} € - État: {cmd.etat}
                    </div>
                  </button>
                ))}
                {ventes.filter(v => v.client === selectedClientHistory.nom).length === 0 && 
                 devis.filter(d => d.client === selectedClientHistory.nom).length === 0 && 
                 commandes.filter(cmd => cmd.client === selectedClientHistory.nom).length === 0 && (
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
