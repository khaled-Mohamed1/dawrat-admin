import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../components/ui/DashboardLayout.jsx";
import Input from "../../../components/ui/Input.jsx";
import Button from "../../../components/ui/Button.jsx";
import { useDebounce } from "../../../hooks/useDebounce.js";
import Pagination from "../../../components/ui/Pagination.jsx";
import InvoiceTable from './components/InvoiceTable';
import { getInvoices, getInvoiceTotals, exportInvoices, resendInvoice } from '../../../api/invoiceService';

const InvoicesDashboard = () => {
    const navigate = useNavigate();
    const [invoices, setInvoices] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [totals, setTotals] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const [isExporting, setIsExporting] = useState(false);

    const initialFilters = { search: '', invoice_number: '', status: 'all', start_date: '', end_date: '' };
    const [filters, setFilters] = useState(initialFilters);
    const debouncedSearch = useDebounce(filters.search, 500);
    const [resendingId, setResendingId] = useState(null);

    const fetchInvoices = useCallback(async () => {
        setIsLoading(true);
        try {
            const activeFilters = { ...filters, search: debouncedSearch, page: currentPage };
            Object.keys(activeFilters).forEach(key => {
                if (!activeFilters[key] || activeFilters[key] === 'all') delete activeFilters[key];
            });
            const response = await getInvoices(activeFilters);
            if (response.success) {
                setInvoices(response.data);
                setPagination(response.meta);
            }
        } catch (error) {
            console.error("Failed to fetch invoices", error);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, debouncedSearch, filters]);

    useEffect(() => {
        getInvoiceTotals().then(res => {
            if (res.success) setTotals(res.data);
        });
    }, []);

    useEffect(() => {
        fetchInvoices();
    }, [fetchInvoices]);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: '', type: '' }), 5000);
    };

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
        setCurrentPage(1);
    };

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const activeFilters = { ...filters, search: debouncedSearch };
            Object.keys(activeFilters).forEach(key => {
                if (activeFilters[key] === '' || activeFilters[key] === 'all') {
                    delete activeFilters[key];
                }
            });

            await exportInvoices(activeFilters);
            showNotification('Invoice data is being downloaded.', 'success');
        } catch (error) {
            console.error("Export failed:", error);
            showNotification('Failed to export data. Please try again.', 'error');
        } finally {
            setIsExporting(false);
        }
    };

    const handleResend = async (invoice) => {
        setResendingId(invoice.id); // Start loading for this specific invoice
        try {
            const response = await resendInvoice(invoice.id);
            showNotification(response.message, 'success');
        } catch (error) {
            showNotification('Failed to resend invoice.', 'error');
        } finally {
            setResendingId(null);
        }
    };

    const handleViewDetails = (invoiceId) => navigate(`/invoices/details/${invoiceId}`);


    const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {notification.message && (
                    <div className={`p-4 rounded-md text-sm ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {notification.message}
                    </div>
                )}

                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Invoice Management</h1>
                    <Button
                        variant="outline"
                        onClick={handleExport}
                        disabled={isExporting}
                        iconName={isExporting ? 'Loader' : 'Download'}
                    >
                        {isExporting ? 'Exporting...' : 'Export Excel'}
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-card p-6 rounded-lg border"><h4 className="text-muted-foreground">Total Invoices</h4><p className="text-3xl font-bold">{totals?.total_count ?? '...'}</p></div>
                    <div className="bg-card p-6 rounded-lg border"><h4 className="text-muted-foreground">Total Revenue</h4><p className="text-3xl font-bold">{formatCurrency(totals?.total_amount)}</p></div>
                </div>

                <div className="bg-card rounded-lg border p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Input placeholder="Search user..." value={filters.search} onChange={e => handleFilterChange('search', e.target.value)} />
                        <Input placeholder="Search invoice #" value={filters.invoice_number} onChange={e => handleFilterChange('invoice_number', e.target.value)} />
                        <Input type="date"  value={filters.start_date} onChange={e => handleFilterChange('start_date', e.target.value)} />
                        <Input type="date" value={filters.end_date} onChange={e => handleFilterChange('end_date', e.target.value)} />
                    </div>
                    <div className="flex justify-end"><Button variant="ghost" size="sm" onClick={() => setFilters(initialFilters)}>Clear Filters</Button></div>
                </div>

                <InvoiceTable
                    invoices={invoices}
                    isLoading={isLoading}
                    onView={handleViewDetails}
                    onResend={handleResend}
                    resendingId={resendingId}
                />

                <Pagination meta={pagination} onPageChange={setCurrentPage} />
            </div>
        </DashboardLayout>
    );
};

export default InvoicesDashboard;