import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const KPICard = ({
                     title,
                     value,
                     breakdown,
                     change,
                     changeType,
                     icon,
                     color,
                     action
                 }) => {
    return (
        <div className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}>
                    <Icon name={icon} size={24} color="white" />
                </div>
                <div className={`text-sm font-medium ${
                    changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                    {change}
                </div>
            </div>

            <div className="mb-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">{title}</h3>
                <div className="text-3xl font-bold text-foreground mb-2">{value}</div>
                {breakdown && (
                    <p className="text-sm text-muted-foreground">{breakdown}</p>
                )}
            </div>

            {action && (
                <Button variant="outline" size="sm" className="w-full">
                    {action}
                </Button>
            )}
        </div>
    );
};

export default KPICard;