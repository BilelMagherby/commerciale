import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Reusable Button component with variants and sizes
 */
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  ...props
}) => {
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/10',
    secondary: 'bg-secondary hover:bg-secondary/80 text-foreground border border-border',
    danger: 'bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-600/10',
    success: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/10',
    ghost: 'bg-transparent hover:bg-secondary text-foreground',
    outline: 'bg-transparent border border-border hover:bg-secondary text-foreground',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-xs',
    lg: 'px-6 py-3 text-sm',
  };

  return (
    <button
      className={`
        inline-flex items-center justify-center space-x-2
        font-medium rounded-xl transition-all duration-150
        active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {!loading && Icon && iconPosition === 'left' && <Icon className="w-4 h-4" />}
      {children}
      {!loading && Icon && iconPosition === 'right' && <Icon className="w-4 h-4" />}
    </button>
  );
};

export default Button;
