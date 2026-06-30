import React from "react";
import { X } from "lucide-react";

// Card Component
export const Card = ({ children, className = "", onClick, hoverable = false }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-card text-card-foreground border border-border/70 rounded-2xl p-5 shadow-sm transition-all duration-200 
        ${hoverable ? "hover:shadow-md hover:translate-y-[-2px] cursor-pointer" : ""} 
        ${className}`}
    >
      {children}
    </div>
  );
};

// Custom Badge Component
export const Badge = ({ status }) => {
  const norm = String(status).toLowerCase().trim();
  
  let bg = "bg-slate-500/10 text-slate-600 dark:text-slate-400";
  
  if (norm === "payé" || norm === "encaissé" || norm === "livré" || norm === "livrée" || norm === "accepté") {
    bg = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold";
  } else if (norm === "en attente" || norm === "validé" || norm === "partiel") {
    bg = "bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold";
  } else if (norm === "en cours") {
    bg = "bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold";
  } else if (norm === "annulé" || norm === "annulée" || norm === "refusé") {
    bg = "bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold";
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide ${bg}`}>
      {status}
    </span>
  );
};

// Modal Dialog Component
export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-gradient-to-br from-card to-card/95 text-card-foreground border border-border/80 rounded-2xl shadow-2xl overflow-hidden animate-scale-up">
        {/* Modal Header with gradient accent */}
        <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-transparent border-b border-border/80">
          <div className="flex items-center space-x-3">
            <div className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></div>
            <h3 className="font-heading font-bold text-lg text-foreground tracking-tight">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary/80 rounded-xl transition-all duration-200 text-muted-foreground hover:text-foreground hover:shadow-md"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Content with improved spacing */}
        <div className="p-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {children}
        </div>

        {/* Modal Footer with subtle accent */}
        <div className="px-6 py-4 bg-secondary/30 border-t border-border/50">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/80 rounded-lg transition-all duration-200"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Custom Table Primitives
export const TableContainer = ({ children, className = "" }) => (
  <div className={`overflow-x-auto w-full border border-border/60 rounded-xl bg-card shadow-sm ${className}`}>
    <table className="w-full text-left border-collapse">{children}</table>
  </div>
);

export const THead = ({ children }) => (
  <thead className="bg-secondary/40 border-b border-border text-muted-foreground text-xs uppercase tracking-wider font-semibold">
    {children}
  </thead>
);

export const TBody = ({ children }) => (
  <tbody className="divide-y divide-border text-xs text-foreground/90">{children}</tbody>
);

export const Tr = ({ children, className = "" }) => (
  <tr className={`hover:bg-secondary/20 transition-colors duration-150 ${className}`}>{children}</tr>
);

export const Th = ({ children, className = "" }) => (
  <th className={`px-4 py-3.5 font-semibold ${className}`}>{children}</th>
);

export const Td = ({ children, className = "" }) => (
  <td className={`px-4 py-3.5 align-middle ${className}`}>{children}</td>
);
