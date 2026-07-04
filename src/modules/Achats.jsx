import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Card, Badge, Modal, TableContainer, THead, TBody, Tr, Th, Td } from "../components/ui/SharedUI";
import { Plus, Search, FileText, Download, Building, Phone, Mail, MapPin, Filter, Eye, Calendar, Truck, User, AlertCircle, Printer, DollarSign, CheckCircle, Package } from "lucide-react";
import { usePrint } from "../components/print/usePrint";
import {
  AchatsListPrintTemplate,
  AchatDetailPrintTemplate,
  BonCommandePrintTemplate,
  FournisseurDetailPrintTemplate,
  FactureAchatPrintTemplate
} from "../components/print/templates/AchatsPrintTemplate";

export default function Achats() {
  const {
    achats,
    fournisseurs,
    bonsCommande,
    facturesAchat,
    searchQuery,
    addAchatRecord
  } = useApp();

  const { printDocument } = usePrint();

  const [activeTab, setActiveTab] = useState("achats");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [selectedBonDetails, setSelectedBonDetails] = useState(null);
  const [selectedAchatDetails, setSelectedAchatDetails] = useState(null);
  const [selectedFournisseurDetails, setSelectedFournisseurDetails] = useState(null);
  const [selectedFactureDetails, setSelectedFactureDetails] = useState(null);

  const handlePrint = () => {
    const printContent = AchatsListPrintTemplate({
      achats: filteredAchats,
      period: "Tout",
      documentNumber: `ACH-${new Date().toISOString().split('T')[0]}`
    });
    printDocument(printContent, 'Rapport des Achats');
  };

  const handlePrintAchatDetails = () => {
    if (!selectedAchatDetails) return;
    const fournisseur = fournisseurs.find(f => f.nom === selectedAchatDetails.fournisseur);
    const printContent = AchatDetailPrintTemplate({
      achat: selectedAchatDetails,
      fournisseur
    });
    printDocument(printContent, `Achat-${selectedAchatDetails.reference}`);
  };

  const handlePrintBonCommande = () => {
    if (!selectedBonDetails) return;
    const printContent = BonCommandePrintTemplate({ bonCommande: selectedBonDetails });
    printDocument(printContent, `BonCommande-${selectedBonDetails.numero}`);
  };

  const handlePrintFournisseurDetails = () => {
    if (!selectedFournisseurDetails) return;
    const fournisseurAchats = achats.filter(a => a.fournisseur === selectedFournisseurDetails.nom);
    const printContent = FournisseurDetailPrintTemplate({
      fournisseur: selectedFournisseurDetails,
      achats: fournisseurAchats
    });
    printDocument(printContent, `Fournisseur-${selectedFournisseurDetails.nom}`);
  };

  const handlePrintFactureDetails = () => {
    if (!selectedFactureDetails) return;
    const achat = achats.find(a => a.fournisseur === selectedFactureDetails.fournisseur && a.date === selectedFactureDetails.date);
    const printContent = FactureAchatPrintTemplate({
      facture: selectedFactureDetails,
      achat
    });
    printDocument(printContent, `Facture-${selectedFactureDetails.numero}`);
  };

  // Filter States for Achats
  const [selectedFournisseur, setSelectedFournisseur] = useState("Tous");
  const [searchProduct, setSearchProduct] = useState("");

  // New purchase form state
  const [fournisseur, setFournisseur] = useState("Thala Beige");
  const [fournisseurNom, setFournisseurNom] = useState("");
  const [matriculeFiscale, setMatriculeFiscale] = useState("");
  const [montant, setMontant] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [statut, setStatut] = useState("En attente");
  
  // Multiple articles state
  const [achatItems, setAchatItems] = useState([
    { id: 1, nom: "", quantite: "", largeur: "", longueur: "", prixUnitaire: "", description: "" }
  ]);

  // Helper functions for items management
  const addAchatItemRow = () => {
    setAchatItems([...achatItems, { id: Date.now(), nom: "", quantite: "", largeur: "", longueur: "", prixUnitaire: "", description: "" }]);
  };

  const removeAchatItemRow = (id) => {
    if (achatItems.length > 1) {
      setAchatItems(achatItems.filter(item => item.id !== id));
    }
  };

  const updateAchatItemRow = (id, field, value) => {
    setAchatItems(achatItems.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  // Calculate row total (quantite * largeur * longueur * prixUnitaire for marble)
  const calculateAchatRowTotal = (item) => {
    const quantite = parseFloat(item.quantite) || 0;
    const largeur = parseFloat(item.largeur) || 0;
    const longueur = parseFloat(item.longueur) || 0;
    const prixUnitaire = parseFloat(item.prixUnitaire) || 0;
    return quantite * largeur * longueur * prixUnitaire;
  };

  // Calculate grand total
  const calculateAchatGrandTotal = () => {
    return achatItems.reduce((sum, item) => sum + calculateAchatRowTotal(item), 0);
  };

  const handleCreateAchat = (e) => {
    e.preventDefault();
    const grandTotal = calculateAchatGrandTotal();
    if (grandTotal <= 0) {
      alert("Veuillez saisir au moins un article avec des valeurs valides.");
      return;
    }
    
    const selectedFournisseur = fournisseurs.find(f => f.nom === fournisseur);
    const articles = achatItems.filter(item => item.nom && item.prixUnitaire).map(item => ({
      nom: item.nom,
      quantite: parseFloat(item.quantite) || 0,
      largeur: parseFloat(item.largeur) || 0,
      longueur: parseFloat(item.longueur) || 0,
      prixUnitaire: parseFloat(item.prixUnitaire) || 0,
      total: calculateAchatRowTotal(item),
      description: item.description
    }));

    addAchatRecord({
      fournisseur,
      montant: grandTotal,
      date,
      statut,
      fournisseurNom: fournisseurNom || selectedFournisseur?.nom || "",
      matriculeFiscale: matriculeFiscale || selectedFournisseur?.matriculeFiscale || "",
      articles
    });
    setIsModalOpen(false);
    // Reset form
    setMontant("");
    setStatut("En attente");
    setFournisseurNom("");
    setMatriculeFiscale("");
    setAchatItems([{ id: 1, nom: "", quantite: "", largeur: "", longueur: "", prixUnitaire: "", description: "" }]);
  };

  // Filter listings based on global search query
  const query = searchQuery.toLowerCase().trim();

  const filteredAchats = achats.filter((a) => {
    const matchQuery =
      a.reference.toLowerCase().includes(query) ||
      a.fournisseur.toLowerCase().includes(query) ||
      a.statut.toLowerCase().includes(query);
    const matchFourn = selectedFournisseur === "Tous" || a.fournisseur === selectedFournisseur;

    // Simulating "product" match in reference code or description (mocking reference match as product link)
    const matchProd = !searchProduct ||
      a.reference.toLowerCase().includes(searchProduct.toLowerCase()) ||
      a.fournisseur.toLowerCase().includes(searchProduct.toLowerCase());

    return matchQuery && matchFourn && matchProd;
  });

  const filteredFourn = fournisseurs.filter(
    (f) =>
      f.nom.toLowerCase().includes(query) ||
      f.email.toLowerCase().includes(query) ||
      f.telephone.includes(query)
  );

  const filteredBc = bonsCommande.filter(
    (bc) =>
      bc.numero.toLowerCase().includes(query) ||
      bc.fournisseur.toLowerCase().includes(query) ||
      bc.statut.toLowerCase().includes(query)
  );

  const filteredFa = facturesAchat.filter(
    (fa) =>
      fa.numero.toLowerCase().includes(query) ||
      fa.fournisseur.toLowerCase().includes(query)
  );

  const tabs = [
    { id: "achats", label: "Achats" },
    { id: "fournisseurs", label: "Fournisseurs" },
    { id: "bons", label: "Bons de commande" },
    { id: "factures", label: "Factures Achat" }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-3xl tracking-tight text-foreground m-0">
            Achats & Logistique
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Gérez vos commandes fournisseurs, factures de frais et catalogues partenaires.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs px-4 py-2.5 rounded-xl shadow-md shadow-indigo-600/10 hover:shadow-lg transition-all duration-150 active:scale-95 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Nouvel Achat</span>
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center justify-center space-x-2 bg-secondary hover:bg-secondary/80 text-foreground font-medium text-xs px-4 py-2.5 rounded-xl border border-border transition-all duration-150 cursor-pointer"
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
        {activeTab === "achats" && (
          <div className="space-y-4">
            {/* Purchase filters bar */}
            <div className="flex flex-wrap items-center gap-4 bg-card border border-border/80 p-4 rounded-xl shadow-sm text-xs">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="font-bold text-foreground">Filtres :</span>
              </div>

              {/* Fournisseur select */}
              <div className="flex items-center space-x-1 bg-secondary px-2 py-1 rounded-lg">
                <span className="text-muted-foreground font-semibold">Fournisseur :</span>
                <select
                  value={selectedFournisseur}
                  onChange={(e) => setSelectedFournisseur(e.target.value)}
                  className="bg-transparent text-foreground font-bold focus:outline-none cursor-pointer"
                >
                  <option value="Tous">Tous</option>
                  {fournisseurs.map(f => (
                    <option key={f.id} value={f.nom}>{f.nom}</option>
                  ))}
                </select>
              </div>

              {/* Product text filter */}
              <div className="flex items-center space-x-1 bg-secondary px-2 py-1 rounded-lg">
                <span className="text-muted-foreground font-semibold">Produit / Réf :</span>
                <input
                  type="text"
                  placeholder="Chercher produit..."
                  value={searchProduct}
                  onChange={(e) => setSearchProduct(e.target.value)}
                  className="bg-transparent text-foreground font-bold focus:outline-none placeholder-muted-foreground/60 w-32"
                />
              </div>
            </div>

            <TableContainer>
              <THead>
                <Tr>
                  <Th>Référence</Th>
                  <Th>Fournisseur</Th>
                  <Th>Date d'enregistrement</Th>
                  <Th>Montant Net</Th>
                  <Th>Statut</Th>
                  <th className="text-center">Détails</th>
                </Tr>
              </THead>
              <TBody>
                {filteredAchats.length === 0 ? (
                  <Tr>
                    <Td colSpan={6} className="text-center py-8 text-muted-foreground">Aucun achat trouvé.</Td>
                  </Tr>
                ) : (
                  filteredAchats.map((a) => (
                    <Tr key={a.id}>
                      <Td className="font-bold tracking-tight text-indigo-600 dark:text-indigo-400">{a.reference}</Td>
                      <Td className="font-medium">{a.fournisseur}</Td>
                      <Td className="text-muted-foreground">{a.date}</Td>
                      <Td className="font-semibold text-right sm:text-left">{a.montant.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €</Td>
                      <Td><Badge status={a.statut} /></Td>
                      <Td className="text-center">
                        <button
                          onClick={() => setSelectedAchatDetails(a)}
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
          </div>
        )}

        {activeTab === "fournisseurs" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredFourn.length === 0 ? (
              <div className="col-span-full text-center py-8 text-muted-foreground bg-card border border-border rounded-xl">Aucun fournisseur trouvé.</div>
            ) : (
              filteredFourn.map((f) => (
                <Card key={f.id} className="flex flex-col justify-between" hoverable>
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2.5 bg-secondary rounded-xl text-foreground">
                          <Building className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-heading font-bold text-base">{f.nom}</h4>
                          <span className="text-[10px] bg-slate-500/10 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Partenaire</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Solde Dû</span>
                        <p className={`font-heading font-extrabold text-sm ${f.solde > 0 ? "text-amber-600" : "text-emerald-600"}`}>
                          {f.solde.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2 text-xs text-muted-foreground border-t border-border/50 pt-3">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-3.5 w-3.5" />
                        <span>{f.telephone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-3.5 w-3.5" />
                        <span>{f.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="truncate">{f.adresse}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-border/50">
                    <button
                      onClick={() => setSelectedFournisseurDetails(f)}
                      className="w-full py-2 bg-secondary hover:bg-indigo-500/10 text-muted-foreground hover:text-indigo-600 font-semibold rounded-lg transition-colors text-xs flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Voir détails</span>
                    </button>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {activeTab === "bons" && (
          <TableContainer>
            <THead>
              <Tr>
                <Th>Numéro Bon</Th>
                <Th>Fournisseur</Th>
                <Th>Date d'émission</Th>
                <Th>Priorité</Th>
                <th>Date Livraison</th>
                <th>Montant</th>
                <Th>Statut Livraison</Th>
                <th className="text-center">Détails</th>
              </Tr>
            </THead>
            <TBody>
              {filteredBc.length === 0 ? (
                <Tr>
                  <Td colSpan={8} className="text-center py-8 text-muted-foreground">Aucun bon de commande.</Td>
                </Tr>
              ) : (
                filteredBc.map((bc) => (
                  <Tr key={bc.id}>
                    <Td className="font-bold text-foreground">{bc.numero}</Td>
                    <Td className="font-medium">{bc.fournisseur}</Td>
                    <Td className="text-muted-foreground">{bc.date}</Td>
                    <Td>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${bc.priorite === "Urgente" ? "bg-rose-500/10 text-rose-600" :
                          bc.priorite === "Haute" ? "bg-amber-500/10 text-amber-600" :
                            bc.priorite === "Normale" ? "bg-blue-500/10 text-blue-600" :
                              "bg-slate-500/10 text-slate-600"
                        }`}>
                        {bc.priorite}
                      </span>
                    </Td>
                    <Td className="text-xs text-muted-foreground">{bc.dateLivraisonPrevue || "-"}</Td>
                    <Td className="font-semibold text-right sm:text-left">{bc.montant?.toLocaleString("fr-FR", { minimumFractionDigits: 2 }) || "-"} €</Td>
                    <Td><Badge status={bc.statut} /></Td>
                    <Td className="text-center">
                      <button
                        onClick={() => setSelectedBonDetails(bc)}
                        className="p-1.5 bg-secondary hover:bg-indigo-500/10 text-muted-foreground hover:text-indigo-600 rounded-lg transition-colors"
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
                <Th>Fournisseur</Th>
                <Th>Montant TTC</Th>
                <Th>Date</Th>
                <Th className="text-center">Détails</Th>
                <Th className="text-center">Action PDF</Th>
              </Tr>
            </THead>
            <TBody>
              {filteredFa.length === 0 ? (
                <Tr>
                  <Td colSpan={6} className="text-center py-8 text-muted-foreground">Aucune facture enregistrée.</Td>
                </Tr>
              ) : (
                filteredFa.map((fa) => (
                  <Tr key={fa.id}>
                    <Td className="font-semibold text-foreground">{fa.numero}</Td>
                    <Td className="font-medium">{fa.fournisseur}</Td>
                    <Td className="font-bold">{fa.montant.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €</Td>
                    <Td className="text-muted-foreground">{fa.date || "2026-06-20"}</Td>
                    <Td className="text-center">
                      <button
                        onClick={() => setSelectedFactureDetails(fa)}
                        className="p-1.5 bg-secondary hover:bg-indigo-500/10 text-muted-foreground hover:text-indigo-600 rounded-lg transition-colors cursor-pointer"
                        title="Voir les détails"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </Td>
                    <Td className="text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => setSelectedPdf(fa)}
                          className="p-1.5 bg-secondary hover:bg-indigo-500/10 text-muted-foreground hover:text-indigo-600 rounded-lg transition-colors"
                          title="Aperçu Facture PDF"
                        >
                          <FileText className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => alert(`Téléchargement simulé de la facture ${fa.numero}`)}
                          className="p-1.5 bg-secondary hover:bg-emerald-500/10 text-muted-foreground hover:text-emerald-600 rounded-lg transition-colors"
                          title="Télécharger Facture"
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

      {/* Nouvel Achat Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Enregistrer un Nouvel Achat">
        <form onSubmit={handleCreateAchat} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold mb-1 text-muted-foreground">Fournisseur</label>
            <select
              value={fournisseur}
              onChange={(e) => {
                setFournisseur(e.target.value);
                const selected = fournisseurs.find(f => f.nom === e.target.value);
                if (selected) {
                  setFournisseurNom(selected.nom);
                  setMatriculeFiscale(selected.matriculeFiscale || "");
                }
              }}
              className="w-full p-2.5 bg-input border border-border rounded-lg text-foreground text-xs focus:ring-1 focus:ring-ring focus:outline-none"
            >
              <option value="Thala Beige">Thala Beige</option>
              <option value="Thala Gris">Thala Gris</option>
              <option value="Gris Foussana">Gris Foussana</option>
              <option value="Noir Aziza">Noir Aziza</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1 text-muted-foreground">Nom du Fournisseur</label>
            <input
              type="text"
              placeholder="Nom complet du fournisseur"
              value={fournisseurNom}
              onChange={(e) => setFournisseurNom(e.target.value)}
              className="w-full p-2.5 bg-input border border-border rounded-lg text-foreground text-xs focus:ring-1 focus:ring-ring focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-muted-foreground">Matricule Fiscale</label>
            <input
              type="text"
              placeholder="Ex: FR12345678901"
              value={matriculeFiscale}
              onChange={(e) => setMatriculeFiscale(e.target.value)}
              className="w-full p-2.5 bg-input border border-border rounded-lg text-foreground text-xs focus:ring-1 focus:ring-ring focus:outline-none"
            />
          </div>

          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-foreground">Détails de l'article</h4>
              <button
                type="button"
                onClick={addAchatItemRow}
                className="inline-flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-2 py-1 rounded cursor-pointer"
              >
                <Plus className="h-3 w-3" />
                <span>Ajouter</span>
              </button>
            </div>
            <div className="space-y-3">
              {achatItems.map((item, index) => (
                <div key={item.id} className="bg-secondary/30 p-3 rounded-lg border border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-muted-foreground">Article {index + 1}</span>
                    {achatItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeAchatItemRow(item.id)}
                        className="text-red-500 hover:text-red-600 cursor-pointer"
                      >
                        <span className="text-xs">Supprimer</span>
                      </button>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div>
                      <label className="block font-semibold mb-1 text-muted-foreground">Nom de l'article</label>
                      <input
                        type="text"
                        placeholder="Ex: Matériaux construction"
                        value={item.nom}
                        onChange={(e) => updateAchatItemRow(item.id, 'nom', e.target.value)}
                        className="w-full p-2 bg-input border border-border rounded-lg text-foreground text-xs focus:ring-1 focus:ring-ring focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      <div>
                        <label className="block font-semibold mb-1 text-muted-foreground">Quantité</label>
                        <input
                          type="number"
                          placeholder="Ex: 100"
                          value={item.quantite}
                          onChange={(e) => updateAchatItemRow(item.id, 'quantite', e.target.value)}
                          className="w-full p-2 bg-input border border-border rounded-lg text-foreground text-xs focus:ring-1 focus:ring-ring focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1 text-muted-foreground">Largeur (m)</label>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Ex: 2.5"
                          value={item.largeur}
                          onChange={(e) => updateAchatItemRow(item.id, 'largeur', e.target.value)}
                          className="w-full p-2 bg-input border border-border rounded-lg text-foreground text-xs focus:ring-1 focus:ring-ring focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1 text-muted-foreground">Longueur (m)</label>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Ex: 1.5"
                          value={item.longueur}
                          onChange={(e) => updateAchatItemRow(item.id, 'longueur', e.target.value)}
                          className="w-full p-2 bg-input border border-border rounded-lg text-foreground text-xs focus:ring-1 focus:ring-ring focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1 text-muted-foreground">Prix Unitaire (€)</label>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Ex: 45.00"
                          value={item.prixUnitaire}
                          onChange={(e) => updateAchatItemRow(item.id, 'prixUnitaire', e.target.value)}
                          className="w-full p-2 bg-input border border-border rounded-lg text-foreground text-xs focus:ring-1 focus:ring-ring focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-semibold mb-1 text-muted-foreground">Description</label>
                      <textarea
                        placeholder="Description détaillée de l'article"
                        value={item.description}
                        onChange={(e) => updateAchatItemRow(item.id, 'description', e.target.value)}
                        rows="2"
                        className="w-full p-2 bg-input border border-border rounded-lg text-foreground text-xs focus:ring-1 focus:ring-ring focus:outline-none resize-none"
                      />
                    </div>
                    <div className="flex items-center justify-between bg-card p-2 rounded border border-border/50">
                      <span className="text-muted-foreground">Total ligne:</span>
                      <span className="font-bold text-foreground">{calculateAchatRowTotal(item).toFixed(2)} €</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg border border-indigo-200 dark:border-indigo-800">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground">Montant Total (€)</span>
              <span className="font-extrabold text-lg text-indigo-600 dark:text-indigo-400">{calculateAchatGrandTotal().toFixed(2)} €</span>
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1 text-muted-foreground">Date d'opération</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2.5 bg-input border border-border rounded-lg text-foreground text-xs focus:ring-1 focus:ring-ring focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-muted-foreground">Statut de Règlement</label>
            <select
              value={statut}
              onChange={(e) => setStatut(e.target.value)}
              className="w-full p-2.5 bg-input border border-border rounded-lg text-foreground text-xs focus:ring-1 focus:ring-ring focus:outline-none"
            >
              <option value="Payé">Payé (Encaissé)</option>
              <option value="En attente">En attente (Non payé)</option>
              <option value="Partiel">Partiel (Acompte 40%)</option>
            </select>
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
              onClick={() => setIsModalOpen(false)}
              className="flex-1 py-2.5 bg-secondary hover:bg-secondary/80 text-foreground font-semibold rounded-lg transition-colors text-xs cursor-pointer"
            >
              Annuler
            </button>
          </div>
        </form>
      </Modal>

      {/* Bon de Commande Details Modal */}
      <Modal isOpen={!!selectedBonDetails} onClose={() => setSelectedBonDetails(null)} title={`Détails Bon de Commande : ${selectedBonDetails?.numero}`}>
        <div className="flex justify-end mb-4">
          <button
            onClick={handlePrintBonCommande}
            className="inline-flex items-center space-x-2 bg-secondary hover:bg-secondary/80 text-foreground font-medium text-xs px-3 py-2 rounded-lg border border-border transition-colors cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>Imprimer</span>
          </button>
        </div>
        {selectedBonDetails && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-secondary/30 p-3 rounded-lg">
                <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                  <Building className="h-4 w-4" />
                  <span className="font-semibold">Fournisseur</span>
                </div>
                <p className="font-bold text-foreground">{selectedBonDetails.fournisseur}</p>
              </div>
              <div className="bg-secondary/30 p-3 rounded-lg">
                <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-semibold">Priorité</span>
                </div>
                <span className={`font-bold px-2 py-0.5 rounded ${selectedBonDetails.priorite === "Urgente" ? "bg-rose-500/10 text-rose-600" :
                    selectedBonDetails.priorite === "Haute" ? "bg-amber-500/10 text-amber-600" :
                      selectedBonDetails.priorite === "Normale" ? "bg-blue-500/10 text-blue-600" :
                        "bg-slate-500/10 text-slate-600"
                  }`}>
                  {selectedBonDetails.priorite}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-secondary/30 p-3 rounded-lg">
                <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4" />
                  <span className="font-semibold">Date d'émission</span>
                </div>
                <p className="font-semibold">{selectedBonDetails.date}</p>
              </div>
              <div className="bg-secondary/30 p-3 rounded-lg">
                <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4" />
                  <span className="font-semibold">Date livraison prévue</span>
                </div>
                <p className="font-semibold">{selectedBonDetails.dateLivraisonPrevue || "Non définie"}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-secondary/30 p-3 rounded-lg">
                <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                  <Truck className="h-4 w-4" />
                  <span className="font-semibold">Mode de transport</span>
                </div>
                <p className="font-semibold">{selectedBonDetails.modeTransport}</p>
              </div>
              <div className="bg-secondary/30 p-3 rounded-lg">
                <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                  <span className="font-semibold">Délai de livraison</span>
                </div>
                <p className="font-semibold">{selectedBonDetails.delaiLivraison}</p>
              </div>
            </div>

            <div className="bg-secondary/30 p-3 rounded-lg">
              <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                <User className="h-4 w-4" />
                <span className="font-semibold">Contact personne</span>
              </div>
              <p className="font-semibold">{selectedBonDetails.contactPersonne || "Non spécifié"}</p>
            </div>

            <div className="bg-secondary/30 p-3 rounded-lg">
              <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                <MapPin className="h-4 w-4" />
                <span className="font-semibold">Adresse de livraison</span>
              </div>
              <p className="font-semibold">{selectedBonDetails.adresseLivraison || "Non spécifiée"}</p>
            </div>

            <div className="bg-secondary/30 p-3 rounded-lg">
              <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                <span className="font-semibold">Conditions de paiement</span>
              </div>
              <p className="font-semibold">{selectedBonDetails.conditionsPaiement || "Non spécifiées"}</p>
            </div>

            <div className="bg-secondary/30 p-3 rounded-lg">
              <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                <span className="font-semibold">Montant</span>
              </div>
              <p className="font-bold text-lg text-foreground">{selectedBonDetails.montant?.toLocaleString("fr-FR", { minimumFractionDigits: 2 }) || "-"} €</p>
            </div>

            {selectedBonDetails.articles && selectedBonDetails.articles.length > 0 && (
              <div className="bg-secondary/30 p-3 rounded-lg">
                <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                  <span className="font-semibold">Articles</span>
                </div>
                <div className="space-y-2">
                  {selectedBonDetails.articles.map((article, idx) => (
                    <div key={idx} className="bg-card p-2 rounded border border-border/50">
                      <p className="font-bold">{article.nom}</p>
                      <p className="text-muted-foreground">Quantité: {article.quantite}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedBonDetails.notes && (
              <div className="bg-secondary/30 p-3 rounded-lg">
                <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                  <span className="font-semibold">Notes</span>
                </div>
                <p className="text-muted-foreground">{selectedBonDetails.notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Purchase Details Modal */}
      <Modal isOpen={!!selectedAchatDetails} onClose={() => setSelectedAchatDetails(null)} title={`Détails Achat : ${selectedAchatDetails?.reference}`}>
        <div className="flex justify-end mb-4">
          <button
            onClick={handlePrintAchatDetails}
            className="inline-flex items-center space-x-2 bg-secondary hover:bg-secondary/80 text-foreground font-medium text-xs px-3 py-2 rounded-lg border border-border transition-colors cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>Imprimer</span>
          </button>
        </div>
        {selectedAchatDetails && (() => {
          const fournisseur = fournisseurs.find(f => f.nom === selectedAchatDetails.fournisseur);
          return (
            <div className="space-y-5">
              {/* Primary Information Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border border-indigo-500/20 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 mb-2">
                    <Building className="h-4 w-4" />
                    <span className="font-semibold text-xs uppercase tracking-wider">Fournisseur</span>
                  </div>
                  <p className="font-bold text-lg text-foreground">{selectedAchatDetails.fournisseur}</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border border-emerald-500/20 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 mb-2">
                    <FileText className="h-4 w-4" />
                    <span className="font-semibold text-xs uppercase tracking-wider">Référence</span>
                  </div>
                  <p className="font-bold text-lg text-foreground">{selectedAchatDetails.reference}</p>
                </div>
              </div>

              {/* Secondary Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-secondary/50 border border-border/60 rounded-xl p-4">
                  <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4" />
                    <span className="font-semibold text-xs uppercase tracking-wider">Date</span>
                  </div>
                  <p className="font-semibold text-foreground">{selectedAchatDetails.date}</p>
                </div>
                <div className="bg-secondary/50 border border-border/60 rounded-xl p-4">
                  <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-semibold text-xs uppercase tracking-wider">Montant Net</span>
                  </div>
                  <p className="font-bold text-lg text-foreground">{selectedAchatDetails.montant.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €</p>
                </div>
                <div className="bg-secondary/50 border border-border/60 rounded-xl p-4">
                  <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                    <CheckCircle className="h-4 w-4" />
                    <span className="font-semibold text-xs uppercase tracking-wider">Statut</span>
                  </div>
                  <Badge status={selectedAchatDetails.statut} />
                </div>
              </div>

              {/* Articles Section */}
              {selectedAchatDetails.articles && selectedAchatDetails.articles.length > 0 && (
                <div className="bg-gradient-to-br from-slate-500/5 to-slate-500/10 border border-border/60 rounded-xl p-5 shadow-sm">
                  <div className="flex items-center space-x-2 text-foreground mb-4 pb-3 border-b border-border/50">
                    <Package className="h-5 w-5 text-indigo-500" />
                    <h4 className="font-bold text-sm uppercase tracking-wider">Articles Commandés</h4>
                    <span className="ml-auto text-xs bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full font-semibold">
                      {selectedAchatDetails.articles.length}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {selectedAchatDetails.articles.map((article, idx) => (
                      <div key={idx} className="bg-card/50 border border-border/40 rounded-lg p-4 hover:border-indigo-500/30 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-bold text-foreground text-sm">{article.nom}</p>
                          {article.surface && (
                            <span className="text-xs bg-slate-500/10 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full font-medium">
                              {article.surface} m²
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="flex items-center space-x-2 text-muted-foreground">
                            <span className="font-medium">Quantité:</span>
                            <span className="font-semibold text-foreground">{article.quantite}</span>
                          </div>
                          {article.prixUnitaire && (
                            <div className="flex items-center space-x-2 text-muted-foreground">
                              <span className="font-medium">Prix unitaire:</span>
                              <span className="font-semibold text-foreground">{article.prixUnitaire.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €</span>
                            </div>
                          )}
                        </div>
                        {article.description && (
                          <p className="text-muted-foreground text-xs italic mt-2 pt-2 border-t border-border/30">{article.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Supplier Information */}
              {fournisseur && (
                <div className="bg-gradient-to-br from-amber-500/5 to-orange-500/5 border border-amber-500/20 rounded-xl p-5 shadow-sm">
                  <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400 mb-4 pb-3 border-b border-amber-500/20">
                    <Building className="h-5 w-5" />
                    <h4 className="font-bold text-sm uppercase tracking-wider">Informations Fournisseur</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3 bg-card/50 rounded-lg p-3">
                      <div className="p-2 bg-indigo-500/10 rounded-lg">
                        <Phone className="h-4 w-4 text-indigo-500" />
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Téléphone</p>
                        <p className="font-semibold text-foreground text-sm">{fournisseur.telephone}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 bg-card/50 rounded-lg p-3">
                      <div className="p-2 bg-indigo-500/10 rounded-lg">
                        <Mail className="h-4 w-4 text-indigo-500" />
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Email</p>
                        <p className="font-semibold text-foreground text-sm">{fournisseur.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 bg-card/50 rounded-lg p-3 md:col-span-2">
                      <div className="p-2 bg-indigo-500/10 rounded-lg">
                        <MapPin className="h-4 w-4 text-indigo-500" />
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Adresse</p>
                        <p className="font-semibold text-foreground text-sm">{fournisseur.adresse}</p>
                      </div>
                    </div>
                    {fournisseur.matriculeFiscale && (
                      <div className="flex items-center space-x-3 bg-card/50 rounded-lg p-3 md:col-span-2">
                        <div className="p-2 bg-indigo-500/10 rounded-lg">
                          <FileText className="h-4 w-4 text-indigo-500" />
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Matricule Fiscale</p>
                          <p className="font-semibold text-foreground text-sm">{fournisseur.matriculeFiscale}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })()}
      </Modal>

      {/* Fournisseur Details Modal */}
      <Modal isOpen={!!selectedFournisseurDetails} onClose={() => setSelectedFournisseurDetails(null)} title={`Détails Fournisseur : ${selectedFournisseurDetails?.nom}`}>
        <div className="flex justify-end mb-4">
          <button
            onClick={handlePrintFournisseurDetails}
            className="inline-flex items-center space-x-2 bg-secondary hover:bg-secondary/80 text-foreground font-medium text-xs px-3 py-2 rounded-lg border border-border transition-colors cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>Imprimer</span>
          </button>
        </div>
        {selectedFournisseurDetails && (() => {
          const fournisseurAchats = achats.filter(a => a.fournisseur === selectedFournisseurDetails.nom);
          return (
            <div className="space-y-5">
              {/* Supplier Name Card */}
              <div className="bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border border-indigo-500/20 rounded-xl p-5 shadow-sm">
                <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 mb-2">
                  <Building className="h-5 w-5" />
                  <span className="font-semibold text-xs uppercase tracking-wider">Nom du fournisseur</span>
                </div>
                <p className="font-bold text-2xl text-foreground">{selectedFournisseurDetails.nom}</p>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 bg-secondary/50 border border-border/60 rounded-xl p-4">
                  <div className="p-2.5 bg-indigo-500/10 rounded-lg">
                    <Phone className="h-5 w-5 text-indigo-500" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Téléphone</p>
                    <p className="font-semibold text-foreground">{selectedFournisseurDetails.telephone}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 bg-secondary/50 border border-border/60 rounded-xl p-4">
                  <div className="p-2.5 bg-indigo-500/10 rounded-lg">
                    <Mail className="h-5 w-5 text-indigo-500" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Email</p>
                    <p className="font-semibold text-foreground">{selectedFournisseurDetails.email}</p>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="bg-secondary/50 border border-border/60 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-indigo-500/10 rounded-lg">
                    <MapPin className="h-5 w-5 text-indigo-500" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Adresse</p>
                    <p className="font-semibold text-foreground">{selectedFournisseurDetails.adresse}</p>
                  </div>
                </div>
              </div>

              {/* Fiscal Number */}
              {selectedFournisseurDetails.matriculeFiscale && (
                <div className="bg-secondary/50 border border-border/60 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-indigo-500/10 rounded-lg">
                      <FileText className="h-5 w-5 text-indigo-500" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Matricule Fiscale</p>
                      <p className="font-semibold text-foreground">{selectedFournisseurDetails.matriculeFiscale}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Balance */}
              <div className="bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border border-emerald-500/20 rounded-xl p-5 shadow-sm">
                <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 mb-2">
                  <DollarSign className="h-5 w-5" />
                  <span className="font-semibold text-xs uppercase tracking-wider">Solde Dû</span>
                </div>
                <p className={`font-bold text-3xl ${selectedFournisseurDetails.solde > 0 ? "text-amber-600" : "text-emerald-600"}`}>
                  {selectedFournisseurDetails.solde.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                </p>
              </div>

              {/* Purchase History */}
              {fournisseurAchats.length > 0 && (
                <div className="bg-gradient-to-br from-slate-500/5 to-slate-500/10 border border-border/60 rounded-xl p-5 shadow-sm">
                  <div className="flex items-center space-x-2 text-foreground mb-4 pb-3 border-b border-border/50">
                    <Package className="h-5 w-5 text-indigo-500" />
                    <h4 className="font-bold text-sm uppercase tracking-wider">Achats effectués</h4>
                    <span className="ml-auto text-xs bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full font-semibold">
                      {fournisseurAchats.length}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {fournisseurAchats.map((achat) => (
                      <div key={achat.id} className="bg-card/50 border border-border/40 rounded-lg p-4 hover:border-indigo-500/30 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-bold text-foreground text-sm">{achat.reference}</p>
                          <span className="text-xs bg-slate-500/10 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full font-medium">
                            {achat.date}
                          </span>
                        </div>
                        {achat.articles && achat.articles.length > 0 && (
                          <div className="space-y-1 mt-2 pt-2 border-t border-border/30">
                            {achat.articles.map((article, idx) => (
                              <div key={idx} className="text-muted-foreground text-xs flex items-center space-x-2">
                                <span className="font-medium text-foreground">• {article.nom}</span>
                                {article.quantite && <span className="text-xs">({article.quantite} unités)</span>}
                                {article.prixUnitaire && <span className="text-xs">- {article.prixUnitaire.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €/unité</span>}
                                {article.surface && <span className="text-xs bg-slate-500/10 px-2 py-0.5 rounded-full">- {article.surface} m²</span>}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })()}
      </Modal>

      {/* Facture Details Modal */}
      <Modal isOpen={!!selectedFactureDetails} onClose={() => setSelectedFactureDetails(null)} title={`Détails Facture : ${selectedFactureDetails?.numero}`}>
        <div className="flex justify-end mb-4">
          <button
            onClick={handlePrintFactureDetails}
            className="inline-flex items-center space-x-2 bg-secondary hover:bg-secondary/80 text-foreground font-medium text-xs px-3 py-2 rounded-lg border border-border transition-colors cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>Imprimer</span>
          </button>
        </div>
        {selectedFactureDetails && (() => {
          const fournisseur = fournisseurs.find(f => f.nom === selectedFactureDetails.fournisseur);
          const achat = achats.find(a => a.fournisseur === selectedFactureDetails.fournisseur && a.date === selectedFactureDetails.date);
          return (
            <div className="space-y-5">
              {/* Primary Information Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border border-indigo-500/20 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 mb-2">
                    <FileText className="h-4 w-4" />
                    <span className="font-semibold text-xs uppercase tracking-wider">Numéro Facture</span>
                  </div>
                  <p className="font-bold text-lg text-foreground">{selectedFactureDetails.numero}</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border border-emerald-500/20 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 mb-2">
                    <Building className="h-4 w-4" />
                    <span className="font-semibold text-xs uppercase tracking-wider">Fournisseur</span>
                  </div>
                  <p className="font-bold text-lg text-foreground">{selectedFactureDetails.fournisseur}</p>
                </div>
              </div>

              {/* Secondary Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-secondary/50 border border-border/60 rounded-xl p-4">
                  <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4" />
                    <span className="font-semibold text-xs uppercase tracking-wider">Date</span>
                  </div>
                  <p className="font-semibold text-foreground">{selectedFactureDetails.date || "2026-06-20"}</p>
                </div>
                <div className="bg-secondary/50 border border-border/60 rounded-xl p-4">
                  <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-semibold text-xs uppercase tracking-wider">Montant TTC</span>
                  </div>
                  <p className="font-bold text-lg text-foreground">{selectedFactureDetails.montant.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €</p>
                </div>
              </div>

              {/* Articles Section */}
              {achat && achat.articles && achat.articles.length > 0 && (
                <div className="bg-gradient-to-br from-slate-500/5 to-slate-500/10 border border-border/60 rounded-xl p-5 shadow-sm">
                  <div className="flex items-center space-x-2 text-foreground mb-4 pb-3 border-b border-border/50">
                    <Package className="h-5 w-5 text-indigo-500" />
                    <h4 className="font-bold text-sm uppercase tracking-wider">Articles Achetés</h4>
                    <span className="ml-auto text-xs bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full font-semibold">
                      {achat.articles.length}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {achat.articles.map((article, idx) => (
                      <div key={idx} className="bg-card/50 border border-border/40 rounded-lg p-4 hover:border-indigo-500/30 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-bold text-foreground text-sm">{article.nom}</p>
                          {article.surface && (
                            <span className="text-xs bg-slate-500/10 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full font-medium">
                              {article.surface} m²
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="flex items-center space-x-2 text-muted-foreground">
                            <span className="font-medium">Quantité:</span>
                            <span className="font-semibold text-foreground">{article.quantite}</span>
                          </div>
                          {article.prixUnitaire && (
                            <div className="flex items-center space-x-2 text-muted-foreground">
                              <span className="font-medium">Prix unitaire:</span>
                              <span className="font-semibold text-foreground">{article.prixUnitaire.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €</span>
                            </div>
                          )}
                        </div>
                        {article.description && (
                          <p className="text-muted-foreground text-xs italic mt-2 pt-2 border-t border-border/30">{article.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Supplier Information */}
              {fournisseur && (
                <div className="bg-gradient-to-br from-amber-500/5 to-orange-500/5 border border-amber-500/20 rounded-xl p-5 shadow-sm">
                  <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400 mb-4 pb-3 border-b border-amber-500/20">
                    <Building className="h-5 w-5" />
                    <h4 className="font-bold text-sm uppercase tracking-wider">Informations Fournisseur</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3 bg-card/50 rounded-lg p-3">
                      <div className="p-2 bg-indigo-500/10 rounded-lg">
                        <Phone className="h-4 w-4 text-indigo-500" />
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Téléphone</p>
                        <p className="font-semibold text-foreground text-sm">{fournisseur.telephone}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 bg-card/50 rounded-lg p-3">
                      <div className="p-2 bg-indigo-500/10 rounded-lg">
                        <Mail className="h-4 w-4 text-indigo-500" />
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Email</p>
                        <p className="font-semibold text-foreground text-sm">{fournisseur.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 bg-card/50 rounded-lg p-3 md:col-span-2">
                      <div className="p-2 bg-indigo-500/10 rounded-lg">
                        <MapPin className="h-4 w-4 text-indigo-500" />
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Adresse</p>
                        <p className="font-semibold text-foreground text-sm">{fournisseur.adresse}</p>
                      </div>
                    </div>
                    {fournisseur.matriculeFiscale && (
                      <div className="flex items-center space-x-3 bg-card/50 rounded-lg p-3 md:col-span-2">
                        <div className="p-2 bg-indigo-500/10 rounded-lg">
                          <FileText className="h-4 w-4 text-indigo-500" />
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Matricule Fiscale</p>
                          <p className="font-semibold text-foreground text-sm">{fournisseur.matriculeFiscale}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })()}
      </Modal>

      {/* PDF View Modal Simulation */}
      <Modal isOpen={!!selectedPdf} onClose={() => setSelectedPdf(null)} title={`Aperçu Facture Achat : ${selectedPdf?.numero}`}>
        {selectedPdf && (
          <div className="p-4 bg-white text-slate-900 rounded-xl space-y-6 font-mono text-[11px] leading-relaxed border border-slate-200">
            {/* Header company logo & name */}
            <div className="flex justify-between border-b border-slate-300 pb-4">
              <div>
                <h4 className="font-bold text-sm tracking-tight text-indigo-600">{selectedPdf.fournisseur}</h4>
                <p>Fournisseur Agréé ERP PRO</p>
                <p>Service Facturation & Logistique</p>
              </div>
              <div className="text-right">
                <h3 className="text-xs font-bold uppercase">FACTURE ACHAT</h3>
                <p>N°: <span className="font-bold">{selectedPdf.numero}</span></p>
                <p>Date: {selectedPdf.date || "2026-06-20"}</p>
              </div>
            </div>

            {/* Billing details */}
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-200">
              <div>
                <p className="font-bold text-slate-500 uppercase text-[9px]">Émetteur</p>
                <p className="font-semibold">{selectedPdf.fournisseur}</p>
                <p>Zone Industrielle Logistique</p>
                <p>France</p>
              </div>
              <div>
                <p className="font-bold text-slate-500 uppercase text-[9px]">Destinataire</p>
                <p className="font-semibold">ERP PRO SAS</p>
                <p>75 Avenue de la République</p>
                <p>75011 Paris, France</p>
              </div>
            </div>

            {/* Line items table */}
            <div className="space-y-2">
              <div className="grid grid-cols-5 font-bold border-b border-slate-300 pb-1 text-slate-700">
                <span className="col-span-3">Description Article</span>
                <span className="text-center">Qte</span>
                <span className="text-right">Total HT</span>
              </div>
              <div className="grid grid-cols-5 border-b border-slate-100 pb-1">
                <span className="col-span-3">Prestations matériels informatiques et serveurs</span>
                <span className="text-center">1</span>
                <span className="text-right">{(selectedPdf.montant / 1.2).toFixed(2)} €</span>
              </div>
            </div>

            {/* Invoice summaries */}
            <div className="flex justify-end pt-4">
              <div className="w-48 space-y-1.5 text-right">
                <div className="flex justify-between">
                  <span>Total HT :</span>
                  <span>{(selectedPdf.montant / 1.2).toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span>TVA (20%) :</span>
                  <span>{(selectedPdf.montant - (selectedPdf.montant / 1.2)).toFixed(2)} €</span>
                </div>
                <div className="flex justify-between font-bold text-xs border-t border-slate-300 pt-1 text-indigo-600">
                  <span>Total TTC :</span>
                  <span>{selectedPdf.montant.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-[9px] text-slate-400 pt-6 border-t border-slate-200">
              Conditions de règlement: 30 jours net à réception. Merci pour votre collaboration commerciale.
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
