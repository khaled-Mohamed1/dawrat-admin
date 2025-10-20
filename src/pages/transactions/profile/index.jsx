import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../../components/ui/DashboardLayout.jsx";
import Button from "../../../components/ui/Button.jsx";
import Icon from "../../../components/AppIcon.jsx";
import { getTransactionDetails } from '../../../api/transactionService';

const InfoItem = ({ label, value }) => (
    <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium text-foreground">{value}</span>
    </div>
);

const TransactionDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [transaction, setTransaction] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getTransactionDetails(id).then(res => {
            if (res.success) setTransaction(res.data);
        }).finally(() => setIsLoading(false));
    }, [id]);

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="space-y-6 animate-pulse">
                    <div className="h-9 w-40 bg-gray-200 rounded-md"></div>
                    <div className="bg-card rounded-lg border p-6 space-y-4">
                        <div className="h-7 w-1/2 bg-gray-200 rounded"></div>
                        <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
                        <div className="grid grid-cols-2 gap-6 pt-6 border-t">
                            <div className="h-10 bg-gray-200 rounded"></div>
                            <div className="h-10 bg-gray-200 rounded"></div>
                            <div className="h-10 bg-gray-200 rounded"></div>
                            <div className="h-10 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (!transaction) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center text-center py-20">
                    <Icon name="SearchX" size={48} className="mx-auto text-destructive mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">Transaction Not Found</h3>
                    <p className="text-muted-foreground mb-6">
                        The transaction you are looking for does not exist or could not be loaded.
                    </p>
                    <Button
                        variant="outline"
                        onClick={() => navigate('/transactions/dashboard')}
                        className="flex items-center gap-2"
                    >
                        <Icon name="ArrowLeft" size={16} />
                        Back to Transactions
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
    const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleString() : 'N/A';

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <Button variant="ghost" onClick={() => navigate('/transactions/dashboard')}><Icon name="ArrowLeft"/> Back to Transactions</Button>
                    {transaction.purchasable_link && (
                        <Button onClick={() => navigate(transaction.purchasable_link)}>
                            View {transaction.purchasable_type}
                        </Button>
                    )}
                </div>

                <div className="bg-card rounded-lg border p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold mb-1">Transaction #{transaction.transaction_number}</h2>
                            <p className="text-sm text-muted-foreground">Created on {formatDate(transaction.created_at)}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-primary">{formatCurrency(transaction.amount)}</p>
                            <p className="text-sm font-medium text-muted-foreground">{transaction.status}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6 pt-6 border-t">
                        {/* Transaction Details */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-foreground">Transaction Details</h3>
                            <InfoItem label="Payment Method" value={transaction.payment_method} />
                            <InfoItem label="Transaction Type" value={transaction.type} />
                            <InfoItem label="Currency" value={transaction.currency} />
                            <InfoItem label="Callback Time" value={formatDate(transaction.callback_time)} />
                        </div>

                        {/* Related Items */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-foreground">Related Items</h3>
                            <InfoItem label="Related To" value={transaction.purchasable_type} />
                            <InfoItem label="Invoice #" value={transaction.invoice_number} />
                            <InfoItem label="Order #" value={transaction.order_number} />
                        </div>

                        {/* Gateway Info */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-foreground">Gateway Info</h3>
                            <InfoItem label="Gateway Fee" value={formatCurrency(transaction.pg_fee_amount)} />
                            <InfoItem label="Gateway Fee (%)" value={`${transaction.pg_fee_percentage}%`} />
                            <InfoItem label="Result Code" value={transaction.result_code} />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default TransactionDetails;