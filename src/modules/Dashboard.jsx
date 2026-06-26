import React from "react";
import { useApp } from "../context/AppContext";
import { Card, Badge } from "../components/ui/SharedUI";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  Briefcase,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  Printer
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

export default function Dashboard() {
  const {
    ventes,
    achats,
    commandes,
    depenses,
    historique,
    clients
  } = useApp();

  // 1. Dynamic Statistics Calculations
  const totalCA = ventes.reduce((sum, v) => sum + v.total, 0);
  const totalAchats = achats.reduce((sum, a) => sum + a.montant, 0);
  const totalExpenses = depenses.reduce((sum, d) => sum + d.montant, 0);
  const benefices = totalCA - totalAchats - totalExpenses;
  
  // Pending payments (Sales outstanding)
  const pendingPayments = ventes
    .filter(v => v.statut === "En attente")
    .reduce((sum, v) => sum + v.total, 0) +
    ventes.filter(v => v.statut === "Partiel").reduce((sum, v) => sum + v.total * 0.6, 0);

  const pendingOrdersCount = commandes.filter(c => c.etat === "En cours").length;

  // Monthly Expenses
  const currentMonthExpenses = depenses.reduce((sum, d) => sum + d.montant, 0);

  const stats = [
    {
      title: "Chiffre d'affaires",
      value: `${totalCA.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €`,
      evolution: "+14.2%",
      isPositive: true,
      icon: TrendingUp,
      color: "from-blue-500/10 to-indigo-500/10 text-blue-600 dark:text-blue-400"
    },
    {
      title: "Total Achats",
      value: `${totalAchats.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €`,
      evolution: "-3.5%",
      isPositive: true,
      icon: TrendingDown,
      color: "from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400"
    },
    {
      title: "Bénéfice Net",
      value: `${benefices.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €`,
      evolution: "+22.1%",
      isPositive: true,
      icon: DollarSign,
      color: "from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400"
    },
    {
      title: "Paiements en attente",
      value: `${pendingPayments.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €`,
      evolution: "-5.8%",
      isPositive: true,
      icon: Clock,
      color: "from-rose-500/10 to-pink-500/10 text-rose-600 dark:text-rose-400"
    },
    {
      title: "Commandes en cours",
      value: `${pendingOrdersCount} Commande${pendingOrdersCount > 1 ? 's' : ''}`,
      evolution: "+8.0%",
      isPositive: true,
      icon: Briefcase,
      color: "from-violet-500/10 to-purple-500/10 text-violet-600 dark:text-violet-400"
    },
    {
      title: "Dépenses du mois",
      value: `${currentMonthExpenses.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €`,
      evolution: "+2.4%",
      isPositive: false,
      icon: AlertCircle,
      color: "from-gray-500/10 to-slate-500/10 text-gray-600 dark:text-gray-400"
    }
  ];

  // 2. Mock Chart Data preparation
  const chartDataArea = [
    { name: "Jan", Ventes: 18000, Achats: 12000 },
    { name: "Fév", Ventes: 22000, Achats: 15000 },
    { name: "Mar", Ventes: 25000, Achats: 11000 },
    { name: "Avr", Ventes: 29000, Achats: 16000 },
    { name: "Mai", Ventes: 32000, Achats: 18000 },
    { name: "Juin", Ventes: totalCA > 0 ? totalCA : 34450, Achats: totalAchats > 0 ? totalAchats : 17450 }
  ];

  const chartDataBar = [
    { name: "Loyer", Montant: depenses.filter(d => d.categorie === "Loyer").reduce((s,d) => s+d.montant, 0) || 3800 },
    { name: "Transport", Montant: depenses.filter(d => d.categorie === "Transport").reduce((s,d) => s+d.montant, 0) || 450 },
    { name: "Salaires", Montant: depenses.filter(d => d.categorie === "Salaires").reduce((s,d) => s+d.montant, 0) || 14500 },
    { name: "Electricité", Montant: depenses.filter(d => d.categorie === "Electricité").reduce((s,d) => s+d.montant, 0) || 620 },
    { name: "Divers", Montant: depenses.filter(d => d.categorie === "Divers").reduce((s,d) => s+d.montant, 0) || 500 }
  ];

  const paidCount = ventes.filter(v => v.statut === "Payé").length;
  const partCount = ventes.filter(v => v.statut === "Partiel").length;
  const pendCount = ventes.filter(v => v.statut === "En attente").length;

  const chartDataPie = [
    { name: "Encaissés", value: paidCount || 4 },
    { name: "Partiels", value: partCount || 1 },
    { name: "En attente", value: pendCount || 2 }
  ];

  const COLORS = ["#10b981", "#f59e0b", "#ef4444"];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-3xl tracking-tight text-foreground m-0">
            Tableau de Bord
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Aperçu en temps réel de votre activité commerciale et financière.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs bg-card border border-border px-3 py-1.5 rounded-lg text-muted-foreground shadow-sm">
            Dernière synchronisation : <span className="font-bold text-foreground">En direct</span>
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-sm transition-all text-xs cursor-pointer"
            title="Imprimer le tableau de bord"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="flex flex-col justify-between" hoverable>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                  {stat.title}
                </span>
                <div className={`p-2.5 rounded-xl bg-gradient-to-tr ${stat.color} shadow-inner`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="font-heading font-extrabold text-2xl tracking-tight">
                  {stat.value}
                </h3>
                <div className="flex items-center mt-2">
                  <span className={`flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${stat.isPositive ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-rose-500/10 text-rose-600 dark:text-rose-400"}`}>
                    {stat.isPositive ? (
                      <ArrowUpRight className="h-3 w-3 mr-0.5" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-0.5" />
                    )}
                    {stat.evolution}
                  </span>
                  <span className="text-[10px] text-muted-foreground ml-2 font-medium">
                    vs mois dernier
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales & Purchases evolution */}
        <Card className="lg:col-span-2 flex flex-col justify-between">
          <div className="flex justify-between items-center pb-4 border-b border-border/60">
            <h3 className="font-heading font-bold text-base">Évolution des Flux</h3>
            <span className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">Ventes vs Achats (K€)</span>
          </div>
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartDataArea} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVentes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorAchats" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--card)", borderColor: "var(--border)", borderRadius: "12px" }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                <Area type="monotone" dataKey="Ventes" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorVentes)" />
                <Area type="monotone" dataKey="Achats" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorAchats)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Payment distribution (Donut chart) */}
        <Card className="flex flex-col justify-between">
          <div className="flex justify-between items-center pb-4 border-b border-border/60">
            <h3 className="font-heading font-bold text-base">Factures Clients</h3>
            <span className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">Répartition</span>
          </div>
          <div className="h-56 w-full flex items-center justify-center relative mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartDataPie}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartDataPie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--card)", borderColor: "var(--border)", borderRadius: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <span className="text-2xl font-extrabold">{chartDataPie.reduce((acc, curr) => acc + curr.value, 0)}</span>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Factures</p>
            </div>
          </div>
          {/* Custom legend */}
          <div className="flex justify-around text-xs mt-2">
            {chartDataPie.map((entry, index) => (
              <div key={index} className="flex flex-col items-center">
                <span className="flex items-center font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full mr-1.5 inline-block" style={{ backgroundColor: COLORS[index] }}></span>
                  {entry.name}
                </span>
                <span className="text-muted-foreground text-[10px] mt-0.5">{entry.value} dossier(s)</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Under Section: Expenses & Activity logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Expenses categories distribution */}
        <Card className="lg:col-span-1 flex flex-col justify-between">
          <div className="flex justify-between items-center pb-4 border-b border-border/60">
            <h3 className="font-heading font-bold text-base">Dépenses de Fonctionnement</h3>
            <span className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">Top Postes</span>
          </div>
          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartDataBar} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                <XAxis type="number" stroke="var(--muted-foreground)" fontSize={10} hide />
                <YAxis dataKey="name" type="category" stroke="var(--muted-foreground)" fontSize={11} width={75} />
                <Tooltip contentStyle={{ background: "var(--card)", borderColor: "var(--border)", borderRadius: "12px" }} />
                <Bar dataKey="Montant" fill="#6366f1" radius={[0, 4, 4, 0]}>
                  {chartDataBar.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 2 ? "#f43f5e" : "#6366f1"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Timeline of events (Activité Récente) */}
        <Card className="lg:col-span-2 flex flex-col justify-between">
          <div className="flex justify-between items-center pb-4 border-b border-border/60">
            <h3 className="font-heading font-bold text-base">Activité Récente</h3>
            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold cursor-pointer hover:underline flex items-center gap-1">
              Historique complet <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
          
          <div className="flow-root mt-6 flex-1 px-2">
            <ul className="-mb-8">
              {historique.slice(0, 4).map((event, eventIdx) => (
                <li key={event.id}>
                  <div className="relative pb-8">
                    {eventIdx !== 3 ? (
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-border" aria-hidden="true" />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-4 ring-card
                          ${event.action.includes("Vente") || event.action.includes("Devis") ? "bg-indigo-500/10 text-indigo-600" : ""}
                          ${event.action.includes("Achat") ? "bg-amber-500/10 text-amber-600" : ""}
                          ${event.action.includes("Paiement") ? "bg-emerald-500/10 text-emerald-600" : ""}
                          ${event.action.includes("Commande") ? "bg-blue-500/10 text-blue-600" : ""}
                          ${event.action.includes("Dépense") ? "bg-rose-500/10 text-rose-600" : ""}
                          ${event.action.includes("Paramètres") || event.action.includes("Permissions") ? "bg-slate-500/10 text-slate-600" : ""}
                        `}>
                          <span className="text-xs font-bold">{event.action.substring(0, 2)}</span>
                        </span>
                      </div>
                      <div className="flex-1 min-w-0 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-xs text-foreground font-medium">
                            {event.description}{" "}
                            <span className="font-normal text-muted-foreground">par {event.utilisateur}</span>
                          </p>
                        </div>
                        <div className="text-right text-[10px] whitespace-nowrap text-muted-foreground font-semibold">
                          {event.date}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}
