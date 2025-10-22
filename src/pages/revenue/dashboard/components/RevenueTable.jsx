import React from 'react';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/AppIcon';

const RevenueTable = ({ revenue, isLoading, onView }) => {
    const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);

    return (
        <div className="bg-card rounded-lg border overflow-hidden">
            <table className="w-full">
                <thead className="bg-muted/50 border-b">
                <tr>
                    <th className="p-3 text-left font-medium text-sm">Order #</th>
                    <th className="p-3 text-left font-medium text-sm">Date</th>
                    <th className="p-3 text-right font-medium text-sm">Total Commission</th>
                    <th className="p-3 text-right font-medium text-sm">Gateway Fee</th>
                    <th className="p-3 text-right font-medium text-sm">Net Margin</th>
                    <th className="p-3 text-center font-medium text-sm">Actions</th>
                </tr>
                </thead>
                <tbody>
                {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i} className="border-b last:border-b-0">
                            <td className="p-3" colSpan={6}><div className="h-6 bg-gray-200 rounded animate-pulse"></div></td>
                        </tr>
                    ))
                ) : revenue.length === 0 ? (
                    <tr>
                        <td colSpan={6} className="text-center py-12">
                            <Icon name="DollarSign" size={48} className="mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold">No Revenue Data Found</h3>
                            <p className="text-muted-foreground">Try adjusting your filter criteria.</p>
                        </td>
                    </tr>
                ) : (
                    revenue.map((item) => (
                        <tr key={item.order_id} className="border-b last:border-b-0 hover:bg-muted/25">
                            <td className="p-3 font-mono text-xs">{item.order_number}</td>
                            <td className="p-3 text-sm text-muted-foreground">{new Date(item.date).toLocaleDateString()}</td>
                            <td className="p-3 text-right font-semibold">{formatCurrency(item.commission_total)}</td>
                            <td className="p-3 text-right text-sm text-red-600">{formatCurrency(item.pg_fee)}</td>
                            <td className="p-3 text-right font-bold text-green-600">{formatCurrency(item.net_margin)}</td>
                            <td className="p-3 text-center">
                                <Button size="sm" variant="outline" onClick={() => onView(item.order_id)}>View</Button>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
};

export default RevenueTable;