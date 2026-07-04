import React from 'react';

/**
 * Reusable Tabs component
 */
export const Tabs = ({ tabs, activeTab, onTabChange, className = '' }) => {
  return (
    <div className={className}>
      <div className="border-b border-border">
        <nav className="flex space-x-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                pb-4 text-sm font-semibold tracking-wide transition-all border-b-2
                ${activeTab === tab.id
                  ? 'border-indigo-600 text-foreground font-bold'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
                }
              `}
            >
              {tab.icon && (
                <span className="inline-flex items-center gap-2">
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </span>
              )}
              {!tab.icon && tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Tabs;
