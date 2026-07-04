import React from 'react';

/**
 * Reusable Input component
 */
export const Input = ({
  label,
  error,
  icon: Icon,
  className = '',
  containerClassName = '',
  ...props
}) => {
  return (
    <div className={`space-y-1 ${containerClassName}`}>
      {label && (
        <label className="block text-xs font-semibold text-muted-foreground">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          className={`
            w-full p-2.5 bg-input border border-border rounded-lg
            text-foreground text-xs focus:ring-1 focus:ring-ring
            focus:outline-none transition-colors
            ${error ? 'border-red-500' : ''}
            ${Icon ? 'pl-10' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
};

/**
 * Reusable Select component
 */
export const Select = ({
  label,
  error,
  options,
  className = '',
  containerClassName = '',
  ...props
}) => {
  return (
    <div className={`space-y-1 ${containerClassName}`}>
      {label && (
        <label className="block text-xs font-semibold text-muted-foreground">
          {label}
        </label>
      )}
      <select
        className={`
          w-full p-2.5 bg-input border border-border rounded-lg
          text-foreground text-xs focus:ring-1 focus:ring-ring
          focus:outline-none transition-colors cursor-pointer
          ${error ? 'border-red-500' : ''}
          ${className}
        `}
        {...props}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
};

/**
 * Reusable Textarea component
 */
export const Textarea = ({
  label,
  error,
  className = '',
  containerClassName = '',
  ...props
}) => {
  return (
    <div className={`space-y-1 ${containerClassName}`}>
      {label && (
        <label className="block text-xs font-semibold text-muted-foreground">
          {label}
        </label>
      )}
      <textarea
        className={`
          w-full p-2.5 bg-input border border-border rounded-lg
          text-foreground text-xs focus:ring-1 focus:ring-ring
          focus:outline-none transition-colors resize-none
          ${error ? 'border-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
};

export default Input;
