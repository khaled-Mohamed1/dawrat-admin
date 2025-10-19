import React from 'react';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/AppIcon';
import { cn } from '../../../../utils/cn';
import ActionsDropdown from '../../../../components/ui/ActionsDropdown';

const TransactionTable = ({ transactions, isLoading, onView }) => {

    const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'succeeded': return 'bg-green-100 text-green-800';
            case 'failed': return 'bg-red-100 text-red-800';
            case 'pending':
            default: return 'bg-yellow-100 text-yellow-800';
        }
    };

    return (
        <div className="bg-card rounded-lg border overflow-hidden">
            <table className="w-full">
                <thead className="bg-muted/50">
                <tr>
                    <th className="p-3 text-left font-medium text-sm">Transaction #</th>
                    <th className="p-3 text-left font-medium text-sm">Related To</th>
                    <th className="p-3 text-left font-medium text-sm">Date</th>
                    <th className="p-3 text-right font-medium text-sm">Amount</th>
                    <th className="p-3 text-center font-medium text-sm">Status</th>
                    <th className="p-3 text-center font-medium text-sm">Actions</th>
                </tr>
                </thead>
                <tbody>
                {isLoading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                        <tr key={i} className="border-b last:border-b-0">
                            <td className="p-3" colSpan={6}><div className="h-5 bg-gray-200 rounded animate-pulse"></div></td>
                        </tr>
                    ))
                ) : transactions.length === 0 ? (
                    <tr>
                        <td colSpan={6} className="text-center py-12">
                            <Icon name="SearchX" size={48} className="mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold">No Transactions Found</h3>
                            <p className="text-muted-foreground">Try adjusting your filter criteria.</p>
                        </td>
                    </tr>
                ) : (
                    transactions.map((trx) => (
                        <tr key={trx.id} className="border-b last:border-b-0 hover:bg-muted/25">
                            <td className="p-3 font-mono text-xs">{trx.transaction_number}</td>
                            <td className="p-3 text-sm">
                                <p className="font-medium capitalize">{trx.purchasable_type}</p>
                                <p className="text-muted-foreground text-xs">{trx.invoice_number}</p>
                            </td>
                            <td className="p-3 text-sm text-muted-foreground">{new Date(trx.created_at).toLocaleDateString()}</td>
                            <td className="p-3 text-right font-semibold">{formatCurrency(trx.amount)}</td>
                            <td className="p-3 text-center"><span className={cn('px-2 py-1 text-xs font-medium rounded-full', getStatusColor(trx.status))}>{trx.status}</span></td>
                            <td className="p-3">
                                <div className="flex items-center justify-center">
                                    <ActionsDropdown
                                        item={trx}
                                        onView={onView}
                                    />
                                </div>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionTable;