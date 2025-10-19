import React from 'react';
import ActionsDropdown from '../../../../components/ui/ActionsDropdown';
import Icon from "../../../../components/AppIcon.jsx";

const InvoiceTable = ({ invoices, isLoading, onView, onResend, resendingId }) => {

    if (isLoading) {
        return (
            <div className="bg-card rounded-lg border p-4">
                <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    if (invoices.length === 0) {
        return (
            <div className="bg-card rounded-lg border text-center py-12">
                <Icon name="FileText" size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">No Invoices Found</h3>
                <p className="text-muted-foreground">Try adjusting your filter criteria.</p>
            </div>
        );
    }

    const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);

    return (
        <div className="bg-card rounded-lg border overflow-hidden">
            <table className="w-full">
                <thead className="bg-muted/50">
                <tr>
                    <th className="p-3 text-left font-medium text-sm">Invoice #</th>
                    <th className="p-3 text-left font-medium text-sm">User</th>
                    <th className="p-3 text-left font-medium text-sm">Date</th>
                    <th className="p-3 text-left font-medium text-sm">Type</th>
                    <th className="p-3 text-right font-medium text-sm">Amount</th>
                    <th className="p-3 text-center font-medium text-sm">Status</th>
                    <th className="p-3 text-center font-medium text-sm">Actions</th>
                </tr>
                </thead>
                <tbody>
                {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b last:border-b-0 hover:bg-muted/25">
                        <td className="p-3 font-mono text-xs">{invoice.invoice_number}</td>
                        <td className="p-3 font-medium">{invoice.user}</td>
                        <td className="p-3 text-sm text-muted-foreground">{new Date(invoice.created_at).toLocaleDateString()}</td>
                        <td className="p-3 text-sm capitalize">{invoice.type}</td>
                        <td className="p-3 text-right font-semibold">{formatCurrency(invoice.amount)}</td>
                        <td className="p-3 text-center text-sm">{invoice.status}</td>
                        <td className="p-3">
                            <div className="flex items-center justify-center">
                                <ActionsDropdown item={invoice} onView={onView} onResend={onResend} resendingId={resendingId} />
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default InvoiceTable;