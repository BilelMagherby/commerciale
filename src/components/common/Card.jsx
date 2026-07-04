import React from 'react';

/**
 * Reusable Card component
 */
export const Card = ({
  children,
  title,
  subtitle,
  icon: Icon,
  action,
  hoverable = false,
  className = '',
  headerClassName = '',
  bodyClassName = '',
}) => {
  return (
    <div
      className={`
        bg-card border border-border rounded-xl p-4
        ${hoverable ? 'hover:border-indigo-500/30 hover:shadow-lg transition-all duration-200' : ''}
        ${className}
      `}
    >
      {(title || subtitle || Icon || action) && (
        <div className={`flex items-start justify-between mb-4 ${headerClassName}`}>
          <div className="flex items-center space-x-3">
            {Icon && (
              <div className="p-2.5 bg-secondary rounded-xl text-foreground">
                <Icon className="h-5 w-5" />
              </div>
            )}
            <div>
              {title && (
                <h4 className="font-heading font-bold text-base text-foreground">
                  {title}
                </h4>
              )}
              {subtitle && (
                <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </div>
  );
};

/**
 * Stat Card component for displaying metrics
 */
export const StatCard = ({
  title,
  value,
  change,
  changeType = 'positive',
  icon: Icon,
  className = '',
}) => {
  const changeColor = changeType === 'positive' ? 'text-emerald-600' : 'text-red-600';
  const changeIcon = changeType === 'positive' ? '↑' : '↓';

  return (
    <Card className={className}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground font-semibold">{title}</p>
          <p className="text-2xl font-extrabold text-foreground mt-1">{value}</p>
          {change && (
            <p className={`text-xs font-semibold mt-1 ${changeColor}`}>
              {changeIcon} {change}
            </p>
          )}
        </div>
        {Icon && (
          <div className="p-3 bg-indigo-500/10 rounded-xl">
            <Icon className="h-6 w-6 text-indigo-600" />
          </div>
        )}
      </div>
    </Card>
  );
};

export default Card;
