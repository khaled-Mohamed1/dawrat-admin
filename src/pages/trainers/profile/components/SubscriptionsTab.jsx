import React, { useState, useEffect, useCallback } from 'react';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/AppIcon';
import Pagination from '../../../../components/ui/Pagination';
import { getTrainerSubscriptions, downloadTrainerSubscriptionInvoice } from '../../../../api/trainerService';
import { cn } from '../../../../utils/cn';

const SubscriptionsTab = ({ trainerId }) => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [downloadingId, setDownloadingId] = useState(null);

    const fetchSubscriptions = useCallback(async () => {
        if (!trainerId) return;
        setIsLoading(true);
        try {
            const response = await getTrainerSubscriptions(trainerId, { page: currentPage });
            if (response.success) {
                setSubscriptions(response.data);
                setPagination(response.meta);
            }
        } catch (error) {
            console.error("Failed to fetch subscriptions", error);
        } finally {
            setIsLoading(false);
        }
    }, [trainerId, currentPage]);

    useEffect(() => {
        fetchSubscriptions();
    }, [fetchSubscriptions]);

    const handleDownload = async (e, subscription) => {
        e.stopPropagation();
        if (!subscription.invoice_number) return;

        setDownloadingId(subscription.id);
        try {
            // The API call correctly uses the subscription ID
            await downloadTrainerSubscriptionInvoice(trainerId, subscription.id);
        } catch (error) {
            console.error(error);
        } finally {
            setDownloadingId(null);
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'active':
            case 'trial':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelled':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'expired':
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground">Subscription History</h3>

            {isLoading ? (
                <div className="flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading details...</p>
                    </div>
                </div>
            ) : subscriptions.length === 0 ? (
                <div className="text-center py-12">
                    <Icon name="CreditCard" size={48} className="mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">This trainer has no subscription history.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {subscriptions.map(sub => (
                        <div key={sub.id} className="bg-muted/30 rounded-lg p-4 border border-border/50">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <Icon name="CreditCard" size={20} className="text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground">
                                            {sub.subscription_plan.plan_tier} - {sub.subscription_plan.plan_level} ({sub.subscription_plan.plan_type})
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            Started: {formatDate(sub.start_date)} • Renews: {formatDate(sub.renewal_date)}
                                        </p>
                                        {/* **UPDATED**: Display Invoice Number */}
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Invoice: <span className="font-medium text-foreground">{sub.invoice_number || 'N/A'}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                     <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize', getStatusColor(sub.status))}>
                                        {sub.status}
                                    </span>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-foreground">{formatCurrency(sub.subscription_plan.price)}</p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) => handleDownload(e, sub)}
                                        disabled={!sub.invoice_number || downloadingId === sub.id}
                                        iconName={downloadingId === sub.id ? 'Loader' : 'Download'}
                                    >
                                        Invoice
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

export default SubscriptionsTab;