import React, { useState, useEffect, useCallback } from 'react';
import Icon from '../../../../components/AppIcon';
import Pagination from '../../../../components/ui/Pagination';
import { getTrainerInvoices, downloadTrainerSubscriptionInvoice  } from '../../../../api/trainerService';
import { cn } from '../../../../utils/cn';
import Button from "../../../../components/ui/Button.jsx";

const InvoicesTab = ({ trainerId }) => {
    const [invoices, setInvoices] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [downloadingId, setDownloadingId] = useState(null);

    const fetchInvoices = useCallback(async () => {
        if (!trainerId) return;
        setIsLoading(true);
        try {
            const response = await getTrainerInvoices(trainerId, { page: currentPage });
            if (response.success) {
                setInvoices(response.data);
                setPagination(response.meta);
            }
        } catch (error) {
            console.error("Failed to fetch invoices", error);
        } finally {
            setIsLoading(false);
        }
    }, [trainerId, currentPage]);

    useEffect(() => {
        fetchInvoices();
    }, [fetchInvoices]);

    const handleDownload = async (e, invoice) => {
        e.stopPropagation();
        const subscriptionId = invoice.purchasable?.id;
        if (!subscriptionId) {
            console.error("No associated subscription ID found for this invoice.");
            return;
        }

        setDownloadingId(invoice.id);
        try {
            await downloadTrainerSubscriptionInvoice(trainerId, subscriptionId);
        } catch (error) {
            console.error(error);
        } finally {
            setDownloadingId(null);
        }
    };


    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'paid':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
    const formatDate = (dateString) => new Date(dateString).toLocaleString();

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground">Invoice History</h3>

            {isLoading ? (
                <div className="flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading details...</p>
                    </div>
                </div>
            ) : invoices.length === 0 ? (
                <div className="text-center py-12">
                    <Icon name="FileText" size={48} className="mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">This trainer has no invoice history.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {invoices.map(invoice => (
                        <div key={invoice.id} className="bg-muted/30 rounded-lg p-4 border border-border/50">
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-4 mb-2">
                                        <h4 className="font-semibold text-foreground text-lg">{invoice.invoice_number}</h4>
                                        <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border', getStatusColor(invoice.status))}>
                                            {invoice.status}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-muted-foreground">
                                        <div><span className="font-medium">Item:</span> {invoice.purchasable?.subscription_plan?.plan_tier || 'N/A'} Plan</div>
                                        <div><span className="font-medium">Payment Method:</span> {invoice.payment_method}</div>
                                        <div><span className="font-medium">Issue Date:</span> {formatDate(invoice.created_at)}</div>
                                        <div><span className="font-medium">Paid At:</span> {invoice.paid_at ? formatDate(invoice.paid_at) : 'N/A'}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 flex-shrink-0">
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-foreground">{formatCurrency(invoice.amount)}</p>
                                        <p className="text-xs text-muted-foreground">TRX: {invoice.transaction?.transaction_number}</p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) => handleDownload(e, invoice)}
                                        disabled={downloadingId === invoice.id}
                                        iconName={downloadingId === invoice.id ? 'Loader' : 'Download'}
                                    >
                                        Download
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Pagination meta={pagination} onPageChange={setCurrentPage} />
        </div>
    );
};

export default InvoicesTab;