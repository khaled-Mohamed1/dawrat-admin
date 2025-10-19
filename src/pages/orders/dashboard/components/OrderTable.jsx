import React from 'react';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/AppIcon';
import ActionsDropdown from '../../../../components/ui/ActionsDropdown';

const OrderTable = ({ orders, isLoading, onView, onDelete }) => {
    if (isLoading) {
        return <div className="bg-card rounded-lg border p-4"><div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />)}</div></div>;
    }
    if (orders.length === 0) {
        return <div className="bg-card rounded-lg border text-center py-12"><Icon name="ShoppingCart" size={48} className="mx-auto text-muted-foreground mb-4" /><h3 className="text-lg font-semibold">No Orders Found</h3></div>;
    }

    const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);

    return (
        <div className="bg-card rounded-lg border overflow-hidden">
            <table className="w-full">
                <thead className="bg-muted/50">
                <tr>
                    <th className="p-3 text-left font-medium text-sm">Order #</th>
                    <th className="p-3 text-left font-medium text-sm">User</th>
                    <th className="p-3 text-left font-medium text-sm">Date</th>
                    <th className="p-3 text-center font-medium text-sm">Items</th>
                    <th className="p-3 text-right font-medium text-sm">Total</th>
                    <th className="p-3 text-center font-medium text-sm">Status</th>
                    <th className="p-3 text-center font-medium text-sm">Actions</th>
                </tr>
                </thead>
                <tbody>
                {orders.map((order) => (
                    <tr key={order.id} className="border-b last:border-b-0 hover:bg-muted/25">
                        <td className="p-3 font-mono text-xs">{order.order_number}</td>
                        <td className="p-3 font-medium">{order.user_name}</td>
                        <td className="p-3 text-sm text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</td>
                        <td className="p-3 text-center text-sm">{order.items_count}</td>
                        <td className="p-3 text-right font-semibold">{formatCurrency(order.grand_total_price)}</td>
                        <td className="p-3 text-center text-sm">{order.status}</td>
                        <td className="p-3">
                            <div className="flex items-center justify-center">
                                <ActionsDropdown
                                    item={order}
                                    onView={onView}
                                    onDelete={onDelete}
                                />
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrderTable;