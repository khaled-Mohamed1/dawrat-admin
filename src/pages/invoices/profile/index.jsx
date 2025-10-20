import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../../components/ui/DashboardLayout.jsx";
import Button from "../../../components/ui/Button.jsx";
import Icon from "../../../components/AppIcon.jsx";
import { getInvoiceDetails, downloadInvoice } from '../../../api/invoiceService';

const InvoiceDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [invoice, setInvoice] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false);
    const [notification, setNotification] = useState({ message: '', type: '' });

    useEffect(() => {
        getInvoiceDetails(id).then(res => {
            if (res.success) setInvoice(res.data);
        }).catch(console.error).finally(() => setIsLoading(false));
    }, [id]);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: '', type: '' }), 5000);
    };

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            await downloadInvoice(id);
            // Success is assumed if no error is thrown
        } catch (error) {
            console.error("Download failed:", error);
            showNotification('Failed to download invoice. Please try again.', 'error');
        } finally {
            setIsDownloading(false);
        }
    };

    const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="space-y-6 animate-pulse">
                    <div className="flex justify-between items-center">
                        <div className="h-9 w-40 bg-gray-200 rounded-md"></div>
                        <div className="h-9 w-44 bg-gray-200 rounded-md"></div>
                    </div>
                    <div className="bg-card rounded-lg border p-8 sm:p-12 space-y-8">
                        <div className="flex justify-between">
                            <div className="h-12 w-1/3 bg-gray-200 rounded"></div>
                            <div className="h-12 w-1/4 bg-gray-200 rounded"></div>
                        </div>
                        <div className="h-32 bg-gray-200 rounded-md border-t border-b"></div>
                        <div className="flex justify-end">
                            <div className="w-1/3 h-24 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (!invoice) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center text-center py-20">
                    <Icon name="FileX" size={48} className="mx-auto text-destructive mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">Invoice Not Found</h3>
                    <p className="text-muted-foreground mb-6">
                        The invoice you are looking for does not exist or could not be loaded.
                    </p>
                    <Button
                        variant="outline"
                        onClick={() => navigate('/invoices/dashboard')}
                        className="flex items-center gap-2"
                    >
                        <Icon name="ArrowLeft" size={16} />
                        Back to Invoices
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">

                {notification.message && (
                    <div className={`p-4 rounded-md text-sm ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {notification.message}
                    </div>
                )}

                {/* Header */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" onClick={() => navigate('/invoices/dashboard')}><Icon name="ArrowLeft"/> Back to Invoices</Button>
                    </div>
                    <div className="flex items-center gap-3">
                        {invoice.purchasable_link && (
                            <Button
                                variant="outline"
                                onClick={() => navigate(invoice.purchasable_link)}
                            >
                                {invoice.header.type === 'order' ? 'View Order' : 'View Subscription'}
                            </Button>
                        )}
                        <Button
                            iconName={isDownloading ? 'Loader' : 'Download'}
                            onClick={handleDownload}
                            disabled={isDownloading}
                        >
                            {isDownloading ? 'Downloading...' : 'Download PDF'}
                        </Button>
                    </div>
                </div>

                {/* Invoice Card */}
                <div className="bg-card rounded-lg border p-8 sm:p-12">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">Invoice</h1>
                            <p className="font-mono text-muted-foreground">{invoice.header.invoice_no}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-semibold text-foreground">Billed To</p>
                            <p className="text-muted-foreground">{invoice.header.student_name}</p>
                        </div>
                    </div>

                    <div className="mt-8">
                        <p className="text-sm text-muted-foreground">Issue Date: {new Date(invoice.header.issue_date).toLocaleDateString()}</p>
                    </div>

                    {/* Items Table */}
                    <div className="mt-6 border-t border-b">
                        <table className="w-full">
                            <thead className="text-sm text-muted-foreground">
                            <tr>
                                <th className="p-3 text-left font-medium">Description</th>
                                <th className="p-3 text-right font-medium">Unit Price</th>
                                <th className="p-3 text-right font-medium">Discount</th>
                                <th className="p-3 text-right font-medium">Line Total</th>
                            </tr>
                            </thead>
                            <tbody>
                            {invoice.items.map((item, index) => (
                                <tr key={index} className="border-t">
                                    <td className="p-3 font-medium">{item.course_title}</td>
                                    <td className="p-3 text-right">{formatCurrency(item.unit_price)}</td>
                                    <td className="p-3 text-right">{formatCurrency(item.discount)}</td>
                                    <td className="p-3 text-right font-semibold">{formatCurrency(item.line_total)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Totals */}
                    <div className="flex justify-end mt-6">
                        <div className="w-full max-w-xs space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal:</span>
                                <span className="font-medium">{formatCurrency(invoice.totals.subtotal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Discount:</span>
                                <span className="font-medium">-{formatCurrency(invoice.totals.discount)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">VAT ({invoice.totals.vat}%):</span>
                                <span className="font-medium">{formatCurrency((invoice.totals.subtotal - invoice.totals.discount) * (invoice.totals.vat / 100))}</span>
                            </div>
                            <div className="border-t"></div>
                            <div className="flex justify-between text-base font-bold">
                                <span className="text-foreground">Grand Total:</span>
                                <span className="text-primary">{formatCurrency(invoice.totals.grand_total)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default InvoiceDetails;