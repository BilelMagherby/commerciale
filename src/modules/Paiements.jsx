import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Card, Badge, TableContainer, THead, TBody, Tr, Th, Td } from "../components/ui/SharedUI";
import { DollarSign, Inbox, Percent, ArrowUpRight, ArrowDownRight, FileText, Download } from "lucide-react";

export default function Paiements() {
  const {
    paiementsClients,
    paiementsFournisseurs,
    transactions,
    searchQuery,
    ventes
  } = useApp();

  const [activeTab, setActiveTab] = useState("clients");

  // Dynamic Statistics
  const totalEncaisse = paiementsClients.reduce((sum, p) => sum + p.montant, 0);
  
  const totalEnAttente = ventes
    .filter(v => v.statut === "En attente")
    .reduce((sum, v) => sum + v.total, 0) + 
    ventes.filter(v => v.statut === "Partiel").reduce((sum, v) => sum + v.total * 0.6, 0);

  const totalPartiel = paiementsClients
    .filter(p => p.statut === "Partiel")
    .reduce((sum, p) => sum + p.montant, 0);

  const stats = [
    {
      title: "Total Encaissé",
      value: `${totalEncaisse.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €`,
      desc: "Trésorerie client reçue",
      icon: DollarSign,
      color: "from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400"
    },
    {
      title: "En Attente",
      value: `${totalEnAttente.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €`,
      desc: "Règlements factures à percevoir",
      icon: Inbox,
      color: "from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400"
    },
    {
      title: "Encaissements Partiels",
      value: `${totalPartiel.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €`,
      desc: "Somme des acomptes validés",
      icon: Percent,
      color: "from-blue-500/10 to-indigo-500/10 text-blue-600 dark:text-blue-400"
    }
  ];

  // Filters based on global search query
  const query = searchQuery.toLowerCase().trim();

  const filteredClientPays = paiementsClients.filter(
    (p) =>
      p.client.toLowerCase().includes(query) ||
      p.facture.toLowerCase().includes(query) ||
      p.statut.toLowerCase().includes(query)
  );

  const filteredFournPays = paiementsFournisseurs.filter(
    (p) =>
      p.fournisseur.toLowerCase().includes(query) ||
      p.statut.toLowerCase().includes(query)
  );

  const filteredTrans = transactions.filter(
    (t) =>
      t.description.toLowerCase().includes(query) ||
      t.type.toLowerCase().includes(query) ||
      t.statut.toLowerCase().includes(query)
  );

  const tabs = [
    { id: "clients", label: "Paiements Clients" },
    { id: "fournisseurs", label: "Paiements Fournisseurs" },
    { id: "transactions", label: "Journal des Transactions" },
    { id: "recus", label: "Reçus & Quittances" }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-heading font-extrabold text-3xl tracking-tight text-foreground m-0">
          Trésorerie & Règlements
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Suivez les flux de caisse, les encaissements clients, les décaissements fournisseurs et auditez les pièces de caisse.
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} hoverable>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.title}</span>
                <div className={`p-2.5 bg-gradient-to-tr ${stat.color} rounded-xl shadow-inner`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="font-heading font-extrabold text-2xl tracking-tight">{stat.value}</h3>
                <p className="text-[11px] text-muted-foreground mt-1 font-medium">{stat.desc}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Tabs */}
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

      {/* Main grids */}
      <div className="space-y-4">
        {activeTab === "clients" && (
          <TableContainer>
            <THead>
              <Tr>
                <Th>Client</Th>
                <Th>Facture Liée</Th>
                <Th>Montant Perçu</Th>
                <Th>Date Règlement</Th>
                <Th>Statut</Th>
              </Tr>
            </THead>
            <TBody>
              {filteredClientPays.length === 0 ? (
                <Tr>
                  <Td colSpan={5} className="text-center py-8 text-muted-foreground">Aucun règlement client enregistré.</Td>
                </Tr>
              ) : (
                filteredClientPays.map((p) => (
                  <Tr key={p.id}>
                    <Td className="font-semibold">{p.client}</Td>
                    <Td className="font-bold text-indigo-600 dark:text-indigo-400">{p.facture}</Td>
                    <Td className="font-bold text-emerald-600">+{p.montant.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €</Td>
                    <Td className="text-muted-foreground">{p.date}</Td>
                    <Td><Badge status={p.statut} /></Td>
                  </Tr>
                ))
              )}
            </TBody>
          </TableContainer>
        )}

        {activeTab === "fournisseurs" && (
          <TableContainer>
            <THead>
              <Tr>
                <Th>Fournisseur</Th>
                <Th>Montant Réglé</Th>
                <Th>Date Décaissement</Th>
                <Th>État Règl.</Th>
              </Tr>
            </THead>
            <TBody>
              {filteredFournPays.length === 0 ? (
                <Tr>
                  <Td colSpan={4} className="text-center py-8 text-muted-foreground">Aucun règlement fournisseur enregistré.</Td>
                </Tr>
              ) : (
                filteredFournPays.map((p) => (
                  <Tr key={p.id}>
                    <Td className="font-semibold">{p.fournisseur}</Td>
                    <Td className="font-bold text-rose-600">-{p.montant.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €</Td>
                    <Td className="text-muted-foreground">{p.date}</Td>
                    <Td><Badge status={p.statut} /></Td>
                  </Tr>
                ))
              )}
            </TBody>
          </TableContainer>
        )}

        {activeTab === "transactions" && (
          <TableContainer>
            <THead>
              <Tr>
                <Th>Date</Th>
                <Th>Type de flux</Th>
                <Th>Description de l'écriture</Th>
                <Th>Montant net</Th>
                <Th>Vérifié</Th>
              </Tr>
            </THead>
            <TBody>
              {filteredTrans.length === 0 ? (
                <Tr>
                  <Td colSpan={5} className="text-center py-8 text-muted-foreground">Aucune transaction bancaire.</Td>
                </Tr>
              ) : (
                filteredTrans.map((t) => (
                  <Tr key={t.id}>
                    <Td className="text-muted-foreground">{t.date}</Td>
                    <Td>
                      <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full 
                        ${t.type === "Encaissement" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-rose-500/10 text-rose-600 dark:text-rose-400"}`}>
                        {t.type === "Encaissement" ? (
                          <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" />
                        ) : (
                          <ArrowDownRight className="h-3.5 w-3.5 mr-0.5" />
                        )}
                        {t.type}
                      </span>
                    </Td>
                    <Td className="font-medium text-foreground">{t.description}</Td>
                    <Td className={`font-bold ${t.type === "Encaissement" ? "text-emerald-600" : "text-rose-600"}`}>
                      {t.type === "Encaissement" ? "+" : "-"}
                      {t.montant.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                    </Td>
                    <Td><Badge status={t.statut} /></Td>
                  </Tr>
                ))
              )}
            </TBody>
          </TableContainer>
        )}

        {activeTab === "recus" && (
          <TableContainer>
            <THead>
              <Tr>
                <Th>Numéro Reçu</Th>
                <Th>Tiers / Client</Th>
                <Th>Montant Certifié</Th>
                <Th>Date Certificat</Th>
                <Th className="text-center">Action Reçu</Th>
              </Tr>
            </THead>
            <TBody>
              {filteredClientPays.length === 0 ? (
                <Tr>
                  <Td colSpan={5} className="text-center py-8 text-muted-foreground">Aucun reçu de caisse disponible.</Td>
                </Tr>
              ) : (
                filteredClientPays.map((p, idx) => {
                  const recNum = `REC-2026-${String(idx + 1).padStart(3, "0")}`;
                  return (
                    <Tr key={p.id}>
                      <Td className="font-semibold text-foreground">{recNum}</Td>
                      <Td className="font-medium">{p.client}</Td>
                      <Td className="font-bold text-emerald-600">{p.montant.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €</Td>
                      <Td className="text-muted-foreground">{p.date}</Td>
                      <Td className="text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => alert(`Aperçu PDF du reçu ${recNum} en cours...`)}
                            className="p-1.5 bg-secondary hover:bg-indigo-500/10 text-muted-foreground hover:text-indigo-600 rounded-lg transition-colors"
                            title="Consulter le reçu PDF"
                          >
                            <FileText className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => alert(`Téléchargement de la quittance de règlement ${recNum}...`)}
                            className="p-1.5 bg-secondary hover:bg-emerald-500/10 text-muted-foreground hover:text-emerald-600 rounded-lg transition-colors"
                            title="Télécharger la quittance"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </Td>
                    </Tr>
                  );
                })
              )}
            </TBody>
          </TableContainer>
        )}
      </div>
    </div>
  );
}
