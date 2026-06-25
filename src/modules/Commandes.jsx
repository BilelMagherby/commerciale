import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Card, Badge, TableContainer, THead, TBody, Tr, Th, Td } from "../components/ui/SharedUI";
import { 
  LayoutGrid, 
  Table, 
  ArrowLeft, 
  ArrowRight, 
  Calendar, 
  User, 
  Package, 
  FileText, 
  CheckCircle,
  Filter
} from "lucide-react";

export default function Commandes() {
  const {
    commandes,
    updateOrderStatus,
    searchQuery,
    generateInvoiceFromOrder,
    clients
  } = useApp();

  const [viewType, setViewType] = useState("kanban"); // 'kanban' or 'table'
  const [selectedClient, setSelectedClient] = useState("Tous");

  // Kanban columns configuration
  const columns = [
    { id: "En attente", label: "En attente", color: "border-t-amber-500 bg-amber-500/5 text-amber-700 dark:text-amber-400" },
    { id: "En cours", label: "En cours", color: "border-t-blue-500 bg-blue-500/5 text-blue-700 dark:text-blue-400" },
    { id: "Livrée", label: "Livrée", color: "border-t-emerald-500 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400" },
    { id: "Annulée", label: "Annulée", color: "border-t-rose-500 bg-rose-500/5 text-rose-700 dark:text-rose-400" }
  ];

  // Drag and Drop handlers
  const handleDragStart = (e, orderId) => {
    e.dataTransfer.setData("orderId", orderId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetColumnId) => {
    e.preventDefault();
    const orderId = e.dataTransfer.getData("orderId");
    if (orderId) {
      updateOrderStatus(orderId, targetColumnId);
    }
  };

  // Quick move handler for touch devices or simple clicks
  const moveOrder = (orderId, currentStatus, direction) => {
    const statusOrder = ["En attente", "En cours", "Livrée", "Annulée"];
    const currentIndex = statusOrder.indexOf(currentStatus);
    let nextIndex = currentIndex + direction;
    if (nextIndex >= 0 && nextIndex < statusOrder.length) {
      updateOrderStatus(orderId, statusOrder[nextIndex]);
    }
  };

  // Filter listings based on global search query and selected client filter
  const query = searchQuery.toLowerCase().trim();
  const filteredCommandes = commandes.filter((c) => {
    const matchQuery =
      c.numero.toLowerCase().includes(query) ||
      c.client.toLowerCase().includes(query) ||
      c.etat.toLowerCase().includes(query);
    const matchClient = selectedClient === "Tous" || c.client === selectedClient;
    return matchQuery && matchClient;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-3xl tracking-tight text-foreground m-0">
            Suivi des Commandes
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Pilotez le flux logistique, filtrez par client et liez automatiquement vos commandes aux factures de vente.
          </p>
        </div>

        {/* View Switcher and filter buttons */}
        <div className="flex items-center space-x-3 self-start sm:self-auto">
          {/* Client Filter Dropdown */}
          <div className="flex items-center space-x-1.5 bg-card border border-border px-2.5 py-1.5 rounded-xl shadow-sm text-xs text-muted-foreground">
            <Filter className="w-3.5 h-3.5" />
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="bg-transparent text-foreground font-semibold focus:outline-none cursor-pointer"
            >
              <option value="Tous">Tous les clients</option>
              {clients.map(c => (
                <option key={c.id} value={c.nom}>{c.nom}</option>
              ))}
            </select>
          </div>

          <div className="inline-flex bg-secondary p-1 rounded-xl border border-border">
            <button
              onClick={() => setViewType("kanban")}
              className={`p-2 rounded-lg flex items-center space-x-1.5 text-xs font-semibold transition-all duration-150 cursor-pointer
                ${viewType === "kanban" 
                  ? "bg-card text-foreground shadow-sm font-bold" 
                  : "text-muted-foreground hover:text-foreground"}`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewType("table")}
              className={`p-2 rounded-lg flex items-center space-x-1.5 text-xs font-semibold transition-all duration-150 cursor-pointer
                ${viewType === "table" 
                  ? "bg-card text-foreground shadow-sm font-bold" 
                  : "text-muted-foreground hover:text-foreground"}`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Tableau</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main View Area */}
      <div className="min-h-[60vh]">
        {viewType === "kanban" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
            {columns.map((col) => {
              const colOrders = filteredCommandes.filter((c) => c.etat === col.id);
              
              return (
                <div
                  key={col.id}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, col.id)}
                  className={`border border-border/60 border-t-4 rounded-2xl p-4 space-y-4 shadow-sm min-h-[450px] transition-all ${col.color}`}
                >
                  {/* Column Header */}
                  <div className="flex justify-between items-center pb-2 border-b border-border/40">
                    <span className="font-heading font-bold text-sm">{col.label}</span>
                    <span className="text-xs bg-card/60 border border-border px-2 py-0.5 rounded-full font-bold text-foreground">
                      {colOrders.length}
                    </span>
                  </div>

                  {/* Cards container */}
                  <div className="space-y-3">
                    {colOrders.length === 0 ? (
                      <p className="text-[10px] text-muted-foreground text-center py-8 bg-card/20 rounded-xl border border-dashed border-border/30">
                        Glisser une commande ici
                      </p>
                    ) : (
                      colOrders.map((order) => (
                        <div
                          key={order.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, order.id)}
                          className="bg-card border border-border/70 rounded-xl p-3.5 shadow-sm space-y-3 cursor-grab active:cursor-grabbing hover:shadow transition-all duration-150 text-xs text-card-foreground select-none"
                        >
                          <div className="flex justify-between items-start">
                            <span className="font-bold tracking-tight text-indigo-600 dark:text-indigo-400">{order.numero}</span>
                            <span className="font-extrabold text-foreground">{order.montant.toLocaleString("fr-FR")} €</span>
                          </div>

                          <div className="space-y-1 text-muted-foreground">
                            <div className="flex items-center space-x-1.5">
                              <User className="w-3 h-3 text-muted-foreground/80" />
                              <span className="font-semibold text-foreground/80 truncate">{order.client}</span>
                            </div>
                            <div className="flex items-center space-x-1.5">
                              <Calendar className="w-3 h-3 text-muted-foreground/80" />
                              <span>{order.date}</span>
                            </div>
                          </div>

                          {/* Articles list summary */}
                          {order.articles && order.articles.length > 0 && (
                            <div className="bg-secondary/40 p-2 rounded-lg text-[10px] flex items-center space-x-1">
                              <Package className="w-3 h-3 text-muted-foreground/80 flex-shrink-0" />
                              <span className="truncate text-muted-foreground leading-none">{order.articles[0].label}</span>
                              {order.articles.length > 1 && (
                                <span className="font-bold text-foreground">+{order.articles.length - 1}</span>
                              )}
                            </div>
                          )}

                          {/* Automated Invoice Link (Liaison commande / facture automatique) */}
                          <div className="pt-2 border-t border-border/40 flex items-center justify-between">
                            {order.factureLiee ? (
                              <div className="flex items-center text-[10px] text-emerald-600 font-semibold space-x-1">
                                <CheckCircle className="w-3 h-3" />
                                <span>Facture : {order.factureLiee}</span>
                              </div>
                            ) : order.etat !== "Annulée" ? (
                              <button
                                onClick={() => generateInvoiceFromOrder(order.id)}
                                className="w-full py-1 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-600 hover:text-white font-bold rounded text-[10px] transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                              >
                                <FileText className="w-3 h-3" />
                                <span>Générer Facture Auto</span>
                              </button>
                            ) : (
                              <span className="text-[9px] text-rose-500 font-semibold">Annulée - Non facturable</span>
                            )}
                          </div>

                          {/* Interactive column mover triggers (Tablet/Mobile support) */}
                          <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[10px]">
                            <button
                              onClick={() => moveOrder(order.id, order.etat, -1)}
                              disabled={order.etat === "En attente"}
                              className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors"
                              title="Déplacer à gauche"
                            >
                              <ArrowLeft className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-[9px] text-muted-foreground/60 uppercase tracking-widest font-bold">Déplacer</span>
                            <button
                              onClick={() => moveOrder(order.id, order.etat, 1)}
                              disabled={order.etat === "Annulée"}
                              className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors"
                              title="Déplacer à droite"
                            >
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <TableContainer>
            <THead>
              <Tr>
                <Th>Numéro</Th>
                <Th>Client / Tiers</Th>
                <Th>Date de création</Th>
                <Th>Valeur TTC</Th>
                <Th>État d'avancement</Th>
                <Th>Articles</Th>
                <Th>Facture liée</Th>
              </Tr>
            </THead>
            <TBody>
              {filteredCommandes.length === 0 ? (
                <Tr>
                  <Td colSpan={7} className="text-center py-8 text-muted-foreground">Aucune commande répertoriée.</Td>
                </Tr>
              ) : (
                filteredCommandes.map((c) => (
                  <Tr key={c.id}>
                    <Td className="font-bold text-foreground">{c.numero}</Td>
                    <Td className="font-medium">{c.client}</Td>
                    <Td className="text-muted-foreground">{c.date}</Td>
                    <Td className="font-semibold text-right sm:text-left">{c.montant.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €</Td>
                    <Td><Badge status={c.etat} /></Td>
                    <Td className="text-xs text-muted-foreground">
                      {c.articles && c.articles.length > 0 ? (
                        <div className="max-w-[150px] truncate">
                          {c.articles[0].label} {c.articles.length > 1 && `(+${c.articles.length - 1})`}
                        </div>
                      ) : (
                        <span>-</span>
                      )}
                    </Td>
                    <Td>
                      {c.factureLiee ? (
                        <span className="font-bold text-emerald-600">{c.factureLiee}</span>
                      ) : c.etat !== "Annulée" ? (
                        <button
                          onClick={() => generateInvoiceFromOrder(c.id)}
                          className="px-2.5 py-1 bg-indigo-500/10 hover:bg-indigo-600 text-indigo-600 hover:text-white rounded text-[10px] font-bold transition-all cursor-pointer"
                        >
                          Facturer
                        </button>
                      ) : (
                        <span className="text-[10px] text-muted-foreground italic">Aucune</span>
                      )}
                    </Td>
                  </Tr>
                ))
              )}
            </TBody>
          </TableContainer>
        )}
      </div>
    </div>
  );
}
