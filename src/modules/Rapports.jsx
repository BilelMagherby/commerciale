import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Card } from "../components/ui/SharedUI";
import { staticRapports } from "../data/mockData";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Briefcase,
  AlertTriangle,
  Calendar,
  Layers,
  ArrowRight,
  FileDown
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";

export default function Rapports() {
  const {
    ventes,
    achats,
    depenses,
    paiementsClients
  } = useApp();

  const [timeframe, setTimeframe] = useState("mensuel"); // 'mensuel', 'trimestriel', 'annuel'

  // Dynamic values calculation (June 2026 / current state)
  const totalCA = ventes.reduce((sum, v) => sum + v.total, 0);
  const totalAchats = achats.reduce((sum, a) => sum + a.montant, 0);
  const totalExpenses = depenses.reduce((sum, d) => sum + d.montant, 0);
  const netProfit = totalCA - totalAchats - totalExpenses;
  const totalCollected = paiementsClients.reduce((sum, p) => sum + p.montant, 0);

  // Link dynamic current month state into static reports June item
  const getChartData = () => {
    const rawData = staticRapports[timeframe];
    if (timeframe === "mensuel") {
      // Replace June data dynamically
      return rawData.map(item => {
        if (item.name === "Juin") {
          return {
            ...item,
            ventes: totalCA > 0 ? totalCA : item.ventes,
            achats: totalAchats > 0 ? totalAchats : item.achats,
            depenses: totalExpenses > 0 ? totalExpenses : item.depenses,
            benefices: netProfit !== 0 ? netProfit : item.benefices
          };
        }
        return item;
      });
    }
    return rawData;
  };

  const currentChartData = getChartData();

  // Summary Metrics Cards
  const reportCards = [
    {
      title: "Rapport des Ventes",
      desc: "Analyse du chiffre d'affaires",
      value: `${totalCA.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €`,
      icon: TrendingUp,
      color: "text-blue-600 dark:text-blue-400 bg-blue-500/10"
    },
    {
      title: "Rapport des Achats",
      desc: "Suivi des acquisitions fournisseurs",
      value: `${totalAchats.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €`,
      icon: TrendingDown,
      color: "text-amber-600 dark:text-amber-400 bg-amber-500/10"
    },
    {
      title: "Rapport Financier",
      desc: "Trésorerie client réellement encaissée",
      value: `${totalCollected.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €`,
      icon: Briefcase,
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
    },
    {
      title: "Rapport des Dépenses",
      desc: "Charges d'exploitation et salaires",
      value: `${totalExpenses.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €`,
      icon: AlertTriangle,
      color: "text-rose-600 dark:text-rose-400 bg-rose-500/10"
    },
    {
      title: "Marge Bénéficiaire",
      desc: "Bénéfice net d'exploitation calculé",
      value: `${netProfit.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €`,
      icon: DollarSign,
      color: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10"
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
        <div>
          <h1 className="font-heading font-extrabold text-3xl tracking-tight text-foreground m-0">
            Rapports & Statistiques
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Analysez vos marges bénéficiaires, comparez vos ventes vs achats et auditez la structure de vos coûts généraux.
            Toutes les données du mois en cours s'adaptent automatiquement.
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center justify-center space-x-2 bg-card hover:bg-secondary border border-border text-foreground font-semibold text-xs px-3.5 py-2.5 rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <FileDown className="w-4 h-4 text-indigo-600" />
          <span>Exporter le Rapport PDF</span>
        </button>
      </div>

      {/* Cards list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {reportCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} hoverable className="flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{card.title}</span>
                <div className={`p-2 rounded-xl ${card.color} shadow-inner`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <h4 className="font-heading font-extrabold text-lg text-foreground truncate">{card.value}</h4>
                <p className="text-[10px] text-muted-foreground mt-0.5">{card.desc}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Chart Section Container */}
      <Card className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border/60 pb-4 gap-4">
          <div>
            <h3 className="font-heading font-bold text-base">Graphique Analytique de Synthèse</h3>
            <p className="text-muted-foreground text-xs">Comparatif global ventes, achats, bénéfices et charges.</p>
          </div>

          {/* Timeframe switchers */}
          <div className="inline-flex bg-secondary p-1 rounded-xl border border-border">
            <button
              onClick={() => setTimeframe("mensuel")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer
                ${timeframe === "mensuel" 
                  ? "bg-card text-foreground shadow-sm font-bold" 
                  : "text-muted-foreground hover:text-foreground"}`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setTimeframe("trimestriel")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer
                ${timeframe === "trimestriel" 
                  ? "bg-card text-foreground shadow-sm font-bold" 
                  : "text-muted-foreground hover:text-foreground"}`}
            >
              Trimestriel
            </button>
            <button
              onClick={() => setTimeframe("annuel")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer
                ${timeframe === "annuel" 
                  ? "bg-card text-foreground shadow-sm font-bold" 
                  : "text-muted-foreground hover:text-foreground"}`}
            >
              Annuel
            </button>
          </div>
        </div>

        {/* Dynamic Graph */}
        <div className="h-96 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={currentChartData} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} />
              <Tooltip contentStyle={{ background: "var(--card)", borderColor: "var(--border)", borderRadius: "12px" }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
              
              <Bar dataKey="ventes" name="Chiffre d'Affaires" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              <Bar dataKey="achats" name="Total Achats" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="depenses" name="Dépenses" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="benefices" name="Bénéfice Net" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
