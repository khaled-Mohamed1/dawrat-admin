import React from 'react';
import Icon from '../../../../components/AppIcon';
import { cn } from '../../../../utils/cn';
import ActionsDropdown from '../../../../components/ui/ActionsDropdown';

const StatusBadge = ({ isActive }) => (
    <span className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        isActive ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'
    )}>
        {isActive ? 'Active' : 'Inactive'}
    </span>
);

const SubscriptionPlanTable = ({ plans, isLoading, onEdit, onDelete, onView }) => {

    const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);

    if (isLoading) {
        return <div className="bg-card rounded-lg border p-4"><div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />)}</div></div>;
    }

    if (plans.length === 0) {
        return (
            <div className="bg-card rounded-lg border text-center py-12">
                <Icon name="CreditCard" size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">No Subscription Plans Found</h3>
                <p className="text-muted-foreground">Click "Add New Plan" to get started.</p>
            </div>
        );
    }

    return (
        <div className="bg-card rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-muted/50 border-b">
                    <tr>
                        <th className="p-4 text-left font-medium text-sm">Plan Name</th>
                        <th className="p-4 text-left font-medium text-sm">Type</th>
                        <th className="p-4 text-right font-medium text-sm">Price</th>
                        <th className="p-4 text-center font-medium text-sm">Trial Period</th>
                        <th className="p-4 text-center font-medium text-sm">Is Default?</th>
                        <th className="p-4 text-center font-medium text-sm">Status</th>
                        <th className="p-4 text-center font-medium text-sm">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {plans.map((plan) => (
                        <tr key={plan.id} className="border-b last:border-b-0 hover:bg-muted/25">
                            <td className="p-4">
                                <p className="font-semibold text-foreground">{plan.plan_tier} - {plan.plan_level}</p>
                                <p className="text-xs text-muted-foreground">v{plan.version}</p>
                            </td>
                            <td className="p-4 text-sm text-muted-foreground">{plan.plan_type}</td>
                            <td className="p-4 text-right">
                                <p className="font-semibold text-foreground">{formatCurrency(plan.price)}</p>
                                {plan.discount > 0 && (
                                    <p className="text-xs text-green-600">-{formatCurrency(plan.discount)} discount</p>
                                )}
                            </td>
                            <td className="p-4 text-center text-sm text-muted-foreground">
                                {plan.trial_period_days > 0 ? `${plan.trial_period_days} days` : 'None'}
                            </td>
                            <td className="p-4 text-center text-sm font-medium">
                                {plan.is_default ? (
                                    <span className="text-blue-600">Yes</span>
                                ) : (
                                    <span className="text-muted-foreground">No</span>
                                )}
                            </td>
                            <td className="p-4 text-center">
                                <StatusBadge isActive={plan.status} />
                            </td>
                            <td className="p-4">
                                <div className="flex items-center justify-center">
                                    <ActionsDropdown
                                        item={plan}
                                        onEdit={onEdit}
                                        onDelete={onDelete}
                                        onView={onView}
                                    />
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

export default SubscriptionPlanTable;