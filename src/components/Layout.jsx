import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useApp } from "../context/AppContext";
import {
  Bell,
  Sun,
  Moon,
  Search,
  User,
  Settings,
  LogOut,
  Check,
  TrendingUp,
  LayoutDashboard,
  ShoppingCart,
  TrendingDown,
  DollarSign,
  ClipboardList,
  Wallet,
  History,
  BarChart3,
  Users
} from "lucide-react";

export default function Layout({ children }) {
  const {
    theme,
    toggleTheme,
    searchQuery,
    setSearchQuery,
    notifications,
    markAllNotificationsRead,
    societe
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const navLinks = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/achats", label: "Achats", icon: ShoppingCart },
    { path: "/ventes", label: "Ventes", icon: TrendingUp },
    { path: "/paiements", label: "Paiements", icon: DollarSign },
    { path: "/rh", label: "RH", icon: Users },
    { path: "/depenses", label: "Dépenses", icon: TrendingDown },
    { path: "/historique", label: "Historique", icon: History },
    { path: "/rapports", label: "Rapports", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-200">
      {/* Fixed Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-border bg-card/80 backdrop-blur-md flex items-center justify-between px-6 transition-colors duration-200">

        {/* Left Side: Logo & Title */}
        <div className="flex items-center space-x-6">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-indigo-500/20 transform group-hover:scale-105 transition-transform duration-200">
              EP
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-lg tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                ERP PRO
              </span>
              <span className="text-[10px] text-muted-foreground font-semibold tracking-widest uppercase -mt-1">
                COMMERCIAL
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) => `
                    flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150
                    ${isActive
                      ? "bg-secondary text-foreground shadow-sm font-semibold border-b-2 border-indigo-600 lg:border-b-0"
                      : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"}
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Right Side Tools */}
        <div className="flex items-center space-x-4">

          {/* Search bar */}
          <div className="relative hidden md:block w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Recherche globale..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-input border border-border/80 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-ring focus:border-border transition-all duration-150 text-foreground"
            />
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary/60 transition-colors duration-150"
            title="Changer le thème"
          >
            {theme === "dark" ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfile(false);
              }}
              className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary/60 transition-colors duration-150 relative"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-destructive text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-xl z-50 p-4 transition-all duration-200">
                <div className="flex items-center justify-between border-b border-border pb-2 mb-2">
                  <h4 className="font-heading font-semibold text-sm">Notifications</h4>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => {
                        markAllNotificationsRead();
                        setShowNotifications(false);
                      }}
                      className="text-xs text-indigo-600 hover:text-indigo-500 font-medium flex items-center gap-1"
                    >
                      <Check className="h-3 w-3" /> Tout lire
                    </button>
                  )}
                </div>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-4">Aucune notification.</p>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} className={`p-2 rounded-lg text-xs leading-normal ${n.read ? "opacity-60" : "bg-secondary/40 border-l-2 border-indigo-600 font-medium"}`}>
                        <div className="flex justify-between font-semibold">
                          <span>{n.title}</span>
                          <span className="text-[10px] text-muted-foreground font-normal">{n.time}</span>
                        </div>
                        <p className="text-muted-foreground text-[11px] mt-0.5">{n.desc}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile User Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfile(!showProfile);
                setShowNotifications(false);
              }}
              className="flex items-center space-x-2 p-1.5 hover:bg-secondary/60 rounded-lg transition-colors duration-150"
            >
              <img
                src={societe.logo || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100"}
                alt="Logo ERP PRO"
                className="h-8 w-8 rounded-lg object-cover ring-1 ring-border shadow-inner"
              />
              <span className="text-sm font-semibold hidden md:inline-block">Bilel C.</span>
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-xl z-50 p-2">
                <div className="px-3 py-2 border-b border-border mb-1">
                  <p className="text-xs font-semibold text-foreground">Bilel Connor</p>
                  <p className="text-[10px] text-muted-foreground truncate">{societe.email}</p>
                  <span className="inline-block mt-1 text-[9px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded">
                    Super-Administrateur
                  </span>
                </div>
                <div className="border-t border-border my-1"></div>
                <button
                  onClick={() => alert("Simulation de déconnexion. ERP PRO reste actif.")}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-destructive hover:bg-destructive/10 rounded-lg transition-colors text-left"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Se déconnecter</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 pt-20 pb-10 px-4 md:px-8 max-w-7xl mx-auto w-full">
        {/* Tablet view banner if menu is wrapped/hidden */}
        <div className="lg:hidden flex items-center overflow-x-auto space-x-1 py-2 mb-4 border-b border-border no-scrollbar">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => `
                  flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors
                  ${isActive
                    ? "bg-secondary text-foreground shadow-sm border border-border"
                    : "text-muted-foreground hover:bg-secondary/40"}
                `}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Route content */}
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 backdrop-blur-sm py-4 px-4 md:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <a
            href="https://mainportfolio-ebon.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Développé Par Bilel Magherby
          </a>
        </div>
      </footer>

      {/* Toast Notification Container */}
      <ToastContainer />
    </div>
  );
}

// Mini inline Toast Container component to show application alerts
function ToastContainer() {
  const { toasts, removeToast } = useApp();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2 w-80 max-w-full">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`p-4 rounded-xl shadow-lg border text-xs flex justify-between items-start transition-all duration-300 animate-slide-in
            ${t.type === "success" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-400" : ""}
            ${t.type === "destructive" ? "bg-red-500/10 border-red-500/30 text-red-800 dark:text-red-400" : ""}
            ${t.type === "info" ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-800 dark:text-indigo-400" : ""}
          `}
        >
          <div>
            <h5 className="font-semibold mb-0.5">{t.title}</h5>
            <p className="opacity-90 leading-relaxed">{t.message}</p>
          </div>
          <button
            onClick={() => removeToast(t.id)}
            className="text-[10px] font-bold ml-3 opacity-60 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
