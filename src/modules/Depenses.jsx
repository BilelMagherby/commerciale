import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Card, Badge, Modal, TableContainer, THead, TBody, Tr, Th, Td } from "../components/ui/SharedUI";
import { Plus, DollarSign, Wallet } from "lucide-react";

export default function Depenses() {
  const {
    depenses,
    addExpenseRecord,
    searchQuery
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [categorie, setCategorie] = useState("Divers");
  const [description, setDescription] = useState("");
  const [montant, setMontant] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const categories = ["Loyer", "Transport", "Salaires", "Electricité", "Divers"];

  const handleCreateExpense = (e) => {
    e.preventDefault();
    if (!montant || parseFloat(montant) <= 0) {
      alert("Veuillez saisir un montant valide.");
      return;
    }
    addExpenseRecord({ categorie, description, montant, date });
    setIsModalOpen(false);
    // Reset form
    setDescription("");
    setMontant("");
    setCategorie("Divers");
  };

  // Calculations
  const monthlyTotal = depenses.reduce((sum, d) => sum + d.montant, 0);
  const annualTotal = monthlyTotal * 12 - 4000; // Simulated scaling for annual projections

  // Category distributions
  const categoryTotals = categories.reduce((acc, cat) => {
    acc[cat] = depenses.filter(d => d.categorie === cat).reduce((sum, d) => sum + d.montant, 0);
    return acc;
  }, {});

  // Global search filtering
  const query = searchQuery.toLowerCase().trim();
  const filteredDepenses = depenses.filter(
    (d) =>
      d.categorie.toLowerCase().includes(query) ||
      d.description.toLowerCase().includes(query) ||
      d.montant.toString().includes(query)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-3xl tracking-tight text-foreground m-0">
            Dépenses de Fonctionnement
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Gérez et classifiez vos frais généraux, loyers, abonnements informatiques et rémunérations.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs px-4 py-2.5 rounded-xl shadow-md shadow-indigo-600/10 hover:shadow-lg transition-all active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Nouvelle Dépense</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card hoverable className="flex items-center space-x-4">
          <div className="p-3 bg-rose-500/10 text-rose-600 rounded-2xl shadow-inner">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Dépenses Mensuelles</span>
            <h3 className="font-heading font-extrabold text-2xl tracking-tight mt-0.5">
              {monthlyTotal.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
            </h3>
            <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">Cumulé du mois en cours</p>
          </div>
        </Card>

        <Card hoverable className="flex items-center space-x-4">
          <div className="p-3 bg-slate-500/10 text-slate-600 rounded-2xl shadow-inner">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Projection Annuelle</span>
            <h3 className="font-heading font-extrabold text-2xl tracking-tight mt-0.5">
              {annualTotal.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
            </h3>
            <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">Basé sur les flux trimestriels</p>
          </div>
        </Card>
      </div>

      {/* Category breakdown visual badges */}
      <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-4">
        <h4 className="font-heading font-bold text-sm text-foreground">Répartition par Catégorie</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => {
            const val = categoryTotals[cat] || 0;
            return (
              <div key={cat} className="p-3.5 bg-secondary/50 border border-border/60 rounded-xl space-y-1 text-center">
                <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{cat}</span>
                <p className="font-heading font-bold text-sm text-foreground">
                  {val.toLocaleString("fr-FR")} €
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expense Listing Table */}
      <div className="space-y-3">
        <h4 className="font-heading font-bold text-sm text-foreground">Détail des Écritures de Frais</h4>
        <TableContainer>
          <THead>
            <Tr>
              <Th>Catégorie</Th>
              <Th>Description / Motif</Th>
              <Th>Montant TTC</Th>
              <Th>Date Règlement</Th>
            </Tr>
          </THead>
          <TBody>
            {filteredDepenses.length === 0 ? (
              <Tr>
                <Td colSpan={4} className="text-center py-8 text-muted-foreground">Aucune dépense enregistrée.</Td>
              </Tr>
            ) : (
              filteredDepenses.map((d) => (
                <Tr key={d.id}>
                  <Td>
                    <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full 
                      ${d.categorie === "Loyer" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" : ""}
                      ${d.categorie === "Transport" ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" : ""}
                      ${d.categorie === "Salaires" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : ""}
                      ${d.categorie === "Electricité" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" : ""}
                      ${d.categorie === "Divers" ? "bg-slate-500/10 text-slate-600 dark:text-slate-400" : ""}
                    `}>
                      {d.categorie}
                    </span>
                  </Td>
                  <Td className="font-medium text-foreground">{d.description}</Td>
                  <Td className="font-bold text-rose-600">-{d.montant.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €</Td>
                  <Td className="text-muted-foreground">{d.date}</Td>
                </Tr>
              ))
            )}
          </TBody>
        </TableContainer>
      </div>

      {/* Nouvelle Dépense Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Enregistrer une Dépense Opérationnelle">
        <form onSubmit={handleCreateExpense} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold mb-1 text-muted-foreground">Catégorie de charge</label>
            <select
              value={categorie}
              onChange={(e) => setCategorie(e.target.value)}
              className="w-full p-2.5 bg-input border border-border rounded-lg text-foreground text-xs focus:ring-1 focus:ring-ring focus:outline-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1 text-muted-foreground">Description / Motif</label>
            <input
              type="text"
              required
              placeholder="Ex: Facture EDF bureau Juin 2026"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 bg-input border border-border rounded-lg text-foreground text-xs focus:ring-1 focus:ring-ring focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-muted-foreground">Montant TTC (€)</label>
            <input
              type="number"
              step="0.01"
              required
              placeholder="Ex: 450.00"
              value={montant}
              onChange={(e) => setMontant(e.target.value)}
              className="w-full p-2.5 bg-input border border-border rounded-lg text-foreground text-xs focus:ring-1 focus:ring-ring focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-muted-foreground">Date de paiement</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2.5 bg-input border border-border rounded-lg text-foreground text-xs focus:ring-1 focus:ring-ring focus:outline-none"
            />
          </div>

          <div className="flex space-x-3 pt-4 border-t border-border mt-6">
            <button
              type="submit"
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-sm hover:shadow active:scale-95 transition-all text-xs cursor-pointer"
            >
              Ajouter la charge
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
    </div>
  );
}
