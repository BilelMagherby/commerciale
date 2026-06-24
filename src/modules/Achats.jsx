import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Card, Badge, Modal, TableContainer, THead, TBody, Tr, Th, Td } from "../components/ui/SharedUI";
import { Plus, Search, FileText, Download, Building, Phone, Mail, MapPin, Filter } from "lucide-react";

export default function Achats() {
  const {
    achats,
    fournisseurs,
    bonsCommande,
    facturesAchat,
    searchQuery,
    addAchatRecord
  } = useApp();

  const [activeTab, setActiveTab] = useState("achats");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(null);

  // Filter States for Achats
  const [selectedFournisseur, setSelectedFournisseur] = useState("Tous");
  const [searchProduct, setSearchProduct] = useState("");

  // New purchase form state
  const [fournisseur, setFournisseur] = useState(fournisseurs[0]?.nom || "");
  const [montant, setMontant] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [statut, setStatut] = useState("En attente");

  const handleCreateAchat = (e) => {
    e.preventDefault();
    if (!montant || parseFloat(montant) <= 0) {
      alert("Veuillez saisir un montant valide.");
      return;
    }
    addAchatRecord({ fournisseur, montant, date, statut });
    setIsModalOpen(false);
    // Reset form
    setMontant("");
    setStatut("En attente");
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
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs px-4 py-2.5 rounded-xl shadow-md shadow-indigo-600/10 hover:shadow-lg transition-all duration-150 active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Nouvel Achat</span>
        </button>
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
                </Tr>
              </THead>
              <TBody>
                {filteredAchats.length === 0 ? (
                  <Tr>
                    <Td colSpan={5} className="text-center py-8 text-muted-foreground">Aucun achat trouvé.</Td>
                  </Tr>
                ) : (
                  filteredAchats.map((a) => (
                    <Tr key={a.id}>
                      <Td className="font-bold tracking-tight text-indigo-600 dark:text-indigo-400">{a.reference}</Td>
                      <Td className="font-medium">{a.fournisseur}</Td>
                      <Td className="text-muted-foreground">{a.date}</Td>
                      <Td className="font-semibold text-right sm:text-left">{a.montant.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €</Td>
                      <Td><Badge status={a.statut} /></Td>
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
                <Th>Statut Livraison</Th>
              </Tr>
            </THead>
            <TBody>
              {filteredBc.length === 0 ? (
                <Tr>
                  <Td colSpan={4} className="text-center py-8 text-muted-foreground">Aucun bon de commande.</Td>
                </Tr>
              ) : (
                filteredBc.map((bc) => (
                  <Tr key={bc.id}>
                    <Td className="font-bold text-foreground">{bc.numero}</Td>
                    <Td className="font-medium">{bc.fournisseur}</Td>
                    <Td className="text-muted-foreground">{bc.date}</Td>
                    <Td><Badge status={bc.statut} /></Td>
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
                <Th className="text-center">Action PDF</Th>
              </Tr>
            </THead>
            <TBody>
              {filteredFa.length === 0 ? (
                <Tr>
                  <Td colSpan={5} className="text-center py-8 text-muted-foreground">Aucune facture enregistrée.</Td>
                </Tr>
              ) : (
                filteredFa.map((fa) => (
                  <Tr key={fa.id}>
                    <Td className="font-semibold text-foreground">{fa.numero}</Td>
                    <Td className="font-medium">{fa.fournisseur}</Td>
                    <Td className="font-bold">{fa.montant.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €</Td>
                    <Td className="text-muted-foreground">{fa.date || "2026-06-20"}</Td>
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
              onChange={(e) => setFournisseur(e.target.value)}
              className="w-full p-2.5 bg-input border border-border rounded-lg text-foreground text-xs focus:ring-1 focus:ring-ring focus:outline-none"
            >
              {fournisseurs.map((f) => (
                <option key={f.id} value={f.nom}>{f.nom}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1 text-muted-foreground">Montant Total (€)</label>
            <input
              type="number"
              step="0.01"
              required
              placeholder="Ex: 1250.00"
              value={montant}
              onChange={(e) => setMontant(e.target.value)}
              className="w-full p-2.5 bg-input border border-border rounded-lg text-foreground text-xs focus:ring-1 focus:ring-ring focus:outline-none"
            />
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
