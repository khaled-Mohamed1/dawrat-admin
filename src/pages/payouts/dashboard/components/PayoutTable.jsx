import React from 'react';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/AppIcon';
import { cn } from '../../../../utils/cn';

const PayoutTable = ({ payouts, isLoading, onView }) => {
    const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
    const getStatusColor = (status) => {
        const colors = {
            draft: 'bg-gray-100 text-gray-800', locked: 'bg-blue-100 text-blue-800',
            sent: 'bg-purple-100 text-purple-800', processing: 'bg-yellow-100 text-yellow-800',
            completed: 'bg-green-100 text-green-800', failed: 'bg-red-100 text-red-800',
        };
        return colors[status?.toLowerCase()] || 'bg-gray-100';
    };

    return (
        <div className="bg-card rounded-lg border overflow-hidden">
            <table className="w-full">
                <thead className="bg-muted/50 border-b">
                <tr>
                    <th className="p-3 text-left font-medium text-sm">Batch ID</th>
                    <th className="p-3 text-left font-medium text-sm">Cutoff Date</th>
                    <th className="p-3 text-center font-medium text-sm">Trainers</th>
                    <th className="p-3 text-right font-medium text-sm">Total Amount</th>
                    <th className="p-3 text-center font-medium text-sm">Status</th>
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
                ) : payouts.length === 0 ? (
                    <tr>
                        <td colSpan={6} className="text-center py-12">
                            <Icon name="DollarSign" size={48} className="mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold">No Payout Batches Found</h3>
                            <p className="text-muted-foreground">Try adjusting your filter criteria.</p>
                        </td>
                    </tr>
                ) : (
                    payouts.map((batch) => (
                        <tr key={batch.id} className="border-b last:border-b-0 hover:bg-muted/25">
                            <td className="p-3 font-mono text-xs">{batch.batch_id}</td>
                            <td className="p-3 text-sm text-muted-foreground">{new Date(batch.cutoff_date).toLocaleDateString()}</td>
                            <td className="p-3 text-center text-sm">{batch.trainers}</td>
                            <td className="p-3 text-right font-semibold">{formatCurrency(batch.total_amount)}</td>
                            <td className="p-3 text-center"><span className={cn('px-2 py-1 text-xs font-medium rounded-full', getStatusColor(batch.status))}>{batch.status}</span></td>
                            <td className="p-3 text-center">
                                <Button size="sm" variant="outline" onClick={() => onView(batch.id)}>View</Button>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
};

export default PayoutTable;