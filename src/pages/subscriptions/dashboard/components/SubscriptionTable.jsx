import React, { useState } from 'react';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/AppIcon';
import { cn } from '../../../../utils/cn';

// Sub-components
const StatusBadge = ({ status }) => {
    const colorMap = {
        trial: 'bg-blue-100 text-blue-800', active: 'bg-green-100 text-green-800',
        expired: 'bg-gray-100 text-gray-800', paused: 'bg-yellow-100 text-yellow-800',
    };
    return <span className={cn('px-2 py-1 text-xs font-medium rounded-full', colorMap[status?.toLowerCase()] || 'bg-gray-100')}>{status}</span>;
};

const ActionsDropdown = ({ subscription, onViewDetails, onTogglePause }) => {
    const [isOpen, setIsOpen] = useState(false);
    const handleAction = (action) => { setIsOpen(false); action(); };

    const isPaused = subscription.status?.toLowerCase() === 'paused';
    const canBeToggled = ['active', 'trial', 'paused'].includes(subscription.status?.toLowerCase());

    return (
        <div className="relative">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="h-8 w-8"><Icon name="MoreVertical" /></Button>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 top-full mt-1 z-20 w-40 bg-card border rounded-md shadow-lg py-1">
                        <button onClick={() => handleAction(() => onViewDetails(subscription.id))} className="w-full px-4 py-2 text-left text-sm hover:bg-accent flex items-center gap-2">
                            <Icon name="Eye" size={14} /> View
                        </button>

                        {canBeToggled && (
                            <button
                                onClick={() => handleAction(() => onTogglePause(subscription))}
                                className={cn(
                                    "w-full px-4 py-2 text-left text-sm hover:bg-accent flex items-center gap-2",
                                    isPaused ? "text-green-600" : "text-red-600"
                                )}
                            >
                                <Icon name={isPaused ? "Play" : "Pause"} size={14} />
                                {isPaused ? "Unpause" : "Pause"}
                            </button>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

// Main Table Component
const SubscriptionTable = ({ subscriptions, isLoading, onViewDetails, onTogglePause }) => {
    const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

    if (isLoading) {
        return <div className="bg-card rounded-lg border p-4"><div className="space-y-2">{Array.from({ length: 10 }).map((_, i) => <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />)}</div></div>;
    }
    if (subscriptions.length === 0) {
        return <div className="bg-card rounded-lg border text-center py-12"><Icon name="CreditCard" size={48} className="mx-auto text-muted-foreground mb-4" /><h3 className="text-lg font-semibold">No Subscriptions Found</h3><p className="text-muted-foreground">Try adjusting your filter criteria.</p></div>;
    }

    return (
        <div className="bg-card rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-muted/50">
                    <tr>
                        <th className="p-4 text-left font-medium text-sm">User</th>
                        <th className="p-4 text-left font-medium text-sm">Plan</th>
                        <th className="p-4 text-left font-medium text-sm">Dates</th>
                        <th className="p-4 text-right font-medium text-sm">Price</th>
                        <th className="p-4 text-center font-medium text-sm">Status</th>
                        <th className="p-4 text-center font-medium text-sm">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {subscriptions.map((sub) => (
                        <tr key={sub.id} className="border-b last:border-b-0 hover:bg-muted/25">
                            <td className="p-4 font-medium text-foreground">{sub.user}</td>
                            <td className="p-4 text-sm">
                                <p className="font-semibold text-foreground">{sub.subscription_plan.plan_tier} - {sub.subscription_plan.plan_level}</p>
                                <p className="text-muted-foreground">{sub.subscription_plan.plan_type}</p>
                            </td>
                            <td className="p-4 text-sm text-muted-foreground">
                                <p>Start: {formatDate(sub.start_date)}</p>
                                <p>Renews: {formatDate(sub.renewal_date)}</p>
                            </td>
                            <td className="p-4 text-right font-semibold text-foreground">{formatCurrency(sub.subscription_plan.price)}</td>
                            <td className="p-4 text-center"><StatusBadge status={sub.status} /></td>
                            <td className="p-4">
                                <div className="flex items-center justify-center">
                                    <ActionsDropdown subscription={sub} onViewDetails={onViewDetails} onTogglePause={onTogglePause} />
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SubscriptionTable;