import React from 'react';

/**
 * Reusable Badge component for status indicators
 */
export const Badge = ({ status, className = '' }) => {
  const statusStyles = {
    'Payé': 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    'En attente': 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    'Partiel': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    'Annulé': 'bg-red-500/10 text-red-600 border-red-500/20',
    'Actif': 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    'Inactif': 'bg-slate-500/10 text-slate-600 border-slate-500/20',
    'Urgente': 'bg-rose-500/10 text-rose-600 border-rose-500/20',
    'Haute': 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    'Normale': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    'Basse': 'bg-slate-500/10 text-slate-600 border-slate-500/20',
    'Livré': 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    'En cours': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    'En retard': 'bg-red-500/10 text-red-600 border-red-500/20',
  };

  const style = statusStyles[status] || 'bg-slate-500/10 text-slate-600 border-slate-500/20';

  return (
    <span
      className={`
        inline-flex items-center px-2 py-0.5 rounded-full
        text-[10px] font-bold uppercase tracking-wider border
        ${style}
        ${className}
      `}
    >
      {status}
    </span>
  );
};

export default Badge;
