import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Card, Badge, TableContainer, THead, TBody, Tr, Th, Td } from "../components/ui/SharedUI";
import { FileSpreadsheet, FileDown, Calendar, User, Search, Filter, Printer } from "lucide-react";
import { usePrint } from "../components/print/usePrint";
import { HistoriquePrintTemplate } from "../components/print/templates/HistoriquePrintTemplate";

export default function Historique() {
  const {
    historique,
    clients,
    fournisseurs,
    searchQuery,
    addToast
  } = useApp();

  const { printDocument } = usePrint();

  // Advanced Filters States
  const [filterDateDebut, setFilterDateDebut] = useState("");
  const [filterDateFin, setFilterDateFin] = useState("");
  const [filterClient, setFilterClient] = useState("Tous");
  const [filterFournisseur, setFilterFournisseur] = useState("Tous");
  const [filterTypeOp, setFilterTypeOp] = useState("Tous");
  const [filterProduct, setFilterProduct] = useState("");

  // Instant dynamic filter logic
  const filteredLogs = historique.filter((log) => {
    // 1. Global Search Query Filter
    const query = searchQuery.toLowerCase().trim();
    if (query) {
      const matchQuery =
        log.description.toLowerCase().includes(query) ||
        log.action.toLowerCase().includes(query) ||
        log.utilisateur.toLowerCase().includes(query);
      if (!matchQuery) return false;
    }

    // 2. Date Range Filter
    if (filterDateDebut) {
      const logDate = log.date.substring(0, 10); // "YYYY-MM-DD"
      if (logDate < filterDateDebut) return false;
    }
    if (filterDateFin) {
      const logDate = log.date.substring(0, 10);
      if (logDate > filterDateFin) return false;
    }

    // 3. Client Filter
    if (filterClient !== "Tous") {
      if (!log.description.toLowerCase().includes(filterClient.toLowerCase())) return false;
    }

    // 4. Fournisseur Filter
    if (filterFournisseur !== "Tous") {
      if (!log.description.toLowerCase().includes(filterFournisseur.toLowerCase())) return false;
    }

    // 5. Type of Operation Filter
    if (filterTypeOp !== "Tous") {
      const act = log.action.toLowerCase();
      if (filterTypeOp === "Ventes" && !act.includes("vente") && !act.includes("devis")) return false;
      if (filterTypeOp === "Achats" && !act.includes("achat")) return false;
      if (filterTypeOp === "Paiements" && !act.includes("paiement")) return false;
      if (filterTypeOp === "Dépenses" && !act.includes("dépense")) return false;
      if (filterTypeOp === "Paramètres" && !act.includes("paramètres") && !act.includes("permissions")) return false;
    }

    // 6. Product Filter (custom search term in description)
    if (filterProduct) {
      if (!log.description.toLowerCase().includes(filterProduct.toLowerCase())) return false;
    }

    return true;
  });

  // Export to Excel (Generates a clean CSV file trigger)
  const handleExportExcel = () => {
    if (filteredLogs.length === 0) {
      addToast("destructive", "Export Impossible", "Aucune donnée à exporter.");
      return;
    }
    
    // Header line
    let csvContent = "data:text/csv;charset=utf-8,Date;Action;Utilisateur;Description\r\n";
    
    // Add row details
    filteredLogs.forEach((log) => {
      const row = `"${log.date}";"${log.action}";"${log.utilisateur}";"${log.description.replace(/"/g, '""')}"`;
      csvContent += row + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `erp_export_historique_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();

    addToast("success", "Export Excel Réussi", "Fichier CSV téléchargé.");
  };

  // Export to PDF with dedicated print template
  const handleExportPdf = () => {
    if (filteredLogs.length === 0) {
      addToast("destructive", "Export Impossible", "Aucune donnée à imprimer.");
      return;
    }

    const period = filterDateDebut || filterDateFin
      ? `${filterDateDebut || 'Début'} - ${filterDateFin || 'Fin'}`
      : "Toutes les périodes";

    const printContent = HistoriquePrintTemplate({
      historique: filteredLogs,
      period,
      documentNumber: `HIST-${new Date().toISOString().split('T')[0]}`
    });

    addToast("info", "Export PDF", "Le document d'impression est prêt.");
    printDocument(printContent, 'Rapport Historique');
  };

  return (
    <div className="space-y-6 animate-fade-in print:p-0">
      {/* Header (Hidden when printing) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
        <div>
          <h1 className="font-heading font-extrabold text-3xl tracking-tight text-foreground m-0">
            Historique & Audit
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Visualisez et filtrez le journal d'audit complet de toutes les écritures et modifications de l'ERP.
          </p>
        </div>
        
        {/* Export buttons */}
        <div className="flex space-x-2">
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center justify-center space-x-1.5 bg-card hover:bg-secondary border border-border text-foreground font-semibold text-xs px-3.5 py-2.5 rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
            <span>Export Excel</span>
          </button>
          <button
            onClick={handleExportPdf}
            className="inline-flex items-center justify-center space-x-1.5 bg-card hover:bg-secondary border border-border text-foreground font-semibold text-xs px-3.5 py-2.5 rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <FileDown className="h-4 w-4 text-indigo-600" />
            <span>Export PDF / Imprimer</span>
          </button>
        </div>
      </div>

      {/* Advanced Filters Card (Hidden when printing) */}
      <Card className="p-4 space-y-4 print:hidden">
        <div className="flex items-center space-x-2 text-xs font-bold text-foreground">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span>Filtres Avancés d'Audit</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 text-xs">
          {/* Date Debut */}
          <div>
            <label className="block font-semibold mb-1 text-muted-foreground">Date Début</label>
            <input
              type="date"
              value={filterDateDebut}
              onChange={(e) => setFilterDateDebut(e.target.value)}
              className="w-full p-2 bg-input border border-border rounded-lg text-foreground focus:ring-1 focus:ring-ring focus:outline-none"
            />
          </div>

          {/* Date Fin */}
          <div>
            <label className="block font-semibold mb-1 text-muted-foreground">Date Fin</label>
            <input
              type="date"
              value={filterDateFin}
              onChange={(e) => setFilterDateFin(e.target.value)}
              className="w-full p-2 bg-input border border-border rounded-lg text-foreground focus:ring-1 focus:ring-ring focus:outline-none"
            />
          </div>

          {/* Client Filter */}
          <div>
            <label className="block font-semibold mb-1 text-muted-foreground">Client</label>
            <select
              value={filterClient}
              onChange={(e) => setFilterClient(e.target.value)}
              className="w-full p-2 bg-input border border-border rounded-lg text-foreground focus:ring-1 focus:ring-ring focus:outline-none"
            >
              <option value="Tous">Tous</option>
              {clients.map((c) => (
                <option key={c.id} value={c.nom}>{c.nom}</option>
              ))}
            </select>
          </div>

          {/* Fournisseur Filter */}
          <div>
            <label className="block font-semibold mb-1 text-muted-foreground">Fournisseur</label>
            <select
              value={filterFournisseur}
              onChange={(e) => setFilterFournisseur(e.target.value)}
              className="w-full p-2 bg-input border border-border rounded-lg text-foreground focus:ring-1 focus:ring-ring focus:outline-none"
            >
              <option value="Tous">Tous</option>
              {fournisseurs.map((f) => (
                <option key={f.id} value={f.nom}>{f.nom}</option>
              ))}
            </select>
          </div>

          {/* Operation type */}
          <div>
            <label className="block font-semibold mb-1 text-muted-foreground">Opération</label>
            <select
              value={filterTypeOp}
              onChange={(e) => setFilterTypeOp(e.target.value)}
              className="w-full p-2 bg-input border border-border rounded-lg text-foreground focus:ring-1 focus:ring-ring focus:outline-none"
            >
              <option value="Tous">Toutes opérations</option>
              <option value="Ventes">Ventes & Devis</option>
              <option value="Achats">Achats</option>
              <option value="Paiements">Trésorerie</option>
              <option value="Dépenses">Dépenses</option>
              <option value="Paramètres">Système / Config</option>
            </select>
          </div>

          {/* Product name Custom tag */}
          <div>
            <label className="block font-semibold mb-1 text-muted-foreground">Recherche mot-clé</label>
            <input
              type="text"
              placeholder="Ex: Licences..."
              value={filterProduct}
              onChange={(e) => setFilterProduct(e.target.value)}
              className="w-full p-2 bg-input border border-border rounded-lg text-foreground focus:ring-1 focus:ring-ring focus:outline-none"
            />
          </div>
        </div>
      </Card>

      {/* Audit Log Table */}
      <div className="space-y-2">
        <div className="flex justify-between items-center pb-2 border-b border-border/60 print:border-b-2 print:border-slate-800">
          <h4 className="font-heading font-bold text-sm text-foreground print:text-lg">Journal des Événements ERP</h4>
          <span className="text-xs text-muted-foreground font-semibold print:text-black">
            Total : <span className="font-extrabold text-foreground">{filteredLogs.length}</span> enregistrement(s)
          </span>
        </div>

        <TableContainer className="print:border-none print:shadow-none print:rounded-none">
          <THead>
            <Tr className="print:border-b-2 print:border-slate-800">
              <Th>Date & Heure</Th>
              <Th>Nature Action</Th>
              <Th>Opérateur</Th>
              <Th>Description des modifications</Th>
            </Tr>
          </THead>
          <TBody>
            {filteredLogs.length === 0 ? (
              <Tr>
                <Td colSpan={4} className="text-center py-8 text-muted-foreground">Aucune écriture d'audit ne correspond à vos filtres.</Td>
              </Tr>
            ) : (
              filteredLogs.map((log) => (
                <Tr key={log.id} className="print:break-inside-avoid">
                  <Td className="text-muted-foreground whitespace-nowrap">{log.date}</Td>
                  <Td>
                    <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full
                      ${log.action.includes("Créée") || log.action.includes("Vente") || log.action.includes("Devis") ? "bg-indigo-500/10 text-indigo-600" : ""}
                      ${log.action.includes("Achat") ? "bg-amber-500/10 text-amber-600" : ""}
                      ${log.action.includes("Paiement") ? "bg-emerald-500/10 text-emerald-600" : ""}
                      ${log.action.includes("Dépense") ? "bg-rose-500/10 text-rose-600" : ""}
                      ${log.action.includes("Modifiée") || log.action.includes("Paramètres") || log.action.includes("Permissions") ? "bg-slate-500/10 text-slate-600" : ""}
                    `}>
                      {log.action}
                    </span>
                  </Td>
                  <Td className="font-semibold text-slate-700 dark:text-slate-300">{log.utilisateur}</Td>
                  <Td className="font-medium text-foreground">{log.description}</Td>
                </Tr>
              ))
            )}
          </TBody>
        </TableContainer>
      </div>
    </div>
  );
}
