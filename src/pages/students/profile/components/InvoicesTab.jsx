import React, { useState, useEffect, useCallback } from 'react';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';
import Icon from '../../../../components/AppIcon';
import Pagination from '../../../../components/ui/Pagination';
import { useDebounce } from '../../../../hooks/useDebounce';
import { getStudentInvoices } from '../../../../api/studentService';
import { downloadInvoice } from '../../../../api/invoiceService';

const InvoicesTab = ({ studentId }) => {
    const [invoices, setInvoices] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    const [downloadingId, setDownloadingId] = useState(null);

    const debouncedSearch = useDebounce(searchTerm, 500);

    const fetchInvoices = useCallback(async () => {
        if (!studentId) return;
        setIsLoading(true);
        try {
            const response = await getStudentInvoices(studentId, {
                page: currentPage,
                search: debouncedSearch
            });
            if (response.success) {
                setInvoices(response.data.map(order => order.invoice));
                setPagination(response.meta);
            }
        } catch (error) {
            console.error("Failed to fetch invoices", error);
        } finally {
            setIsLoading(false);
        }
    }, [studentId, currentPage, debouncedSearch]);

    useEffect(() => {
        fetchInvoices();
    }, [fetchInvoices]);

    const handleDownload = async (e, invoice) => {
        e.stopPropagation();
        setDownloadingId(invoice.id);
        try {
            await downloadInvoice(invoice.id, invoice.invoice_number);
        } catch (error) {
            // TODO: Show an error notification to the user
            console.error(error);
        } finally {
            setDownloadingId(null);
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'paid': return 'bg-green-100 text-green-800 border-green-200';
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-foreground">Invoice History</h3>
                <div className="w-full sm:w-64">
                    <Input
                        type="text"
                        placeholder="Search by invoice number..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading details...</p>
                    </div>
                </div>
            ) : invoices.length === 0 ? (
                <div className="text-center py-8">
                    <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">{searchTerm ? 'No invoices found' : 'No invoices available for this student.'}</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {invoices.map(invoice => (
                        <div key={invoice.id} className="bg-muted/30 rounded-lg p-4 hover:bg-muted/50 transition-colors">
                            <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <Icon name="FileText" size={20} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h4 className="font-medium text-foreground">{invoice.invoice_number}</h4>
                                            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(invoice.status)}`}>
                                                {invoice.status}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1"><Icon name="Calendar" size={14} />Issue Date: {new Date(invoice.created_at).toLocaleDateString()}</span>
                                            {invoice.paid_at && (
                                                <span className="flex items-center gap-1"><Icon name="CheckCircle" size={14} />Paid: {new Date(invoice.paid_at).toLocaleDateString()}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-right">
                                        <div className="font-semibold text-lg text-foreground">{formatCurrency(invoice.amount)}</div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) => handleDownload(e, invoice)}
                                        disabled={downloadingId === invoice.id}
                                    >
                                        <Icon
                                            name={downloadingId === invoice.id ? 'Loader' : 'Download'}
                                            size={14}
                                            className={downloadingId === invoice.id ? 'animate-spin' : ''}
                                        />
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