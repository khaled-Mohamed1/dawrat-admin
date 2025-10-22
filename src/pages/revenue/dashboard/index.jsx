import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../components/ui/DashboardLayout.jsx";
import Input from "../../../components/ui/Input.jsx";
import Button from "../../../components/ui/Button.jsx";
import Icon from "../../../components/AppIcon.jsx";
import Pagination from "../../../components/ui/Pagination.jsx";
import RevenueTable from './components/RevenueTable';
import { getRevenue, getRevenueTotals, exportRevenue } from '../../../api/revenueService';

const RevenueDashboard = () => {
    const navigate = useNavigate();
    const [revenue, setRevenue] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [totals, setTotals] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isExporting, setIsExporting] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [notification, setNotification] = useState({ message: '', type: '' });

    const initialFilters = { start_date: '', end_date: '' };
    const [filters, setFilters] = useState(initialFilters);

    const fetchRevenue = useCallback(async () => {
        setIsLoading(true);
        try {
            const activeFilters = { ...filters, page: currentPage };
            Object.keys(activeFilters).forEach(key => {
                if (!activeFilters[key]) delete activeFilters[key];
            });

            const response = await getRevenue(activeFilters);
            if (response.success) {
                setRevenue(response.data);
                setPagination(response.meta);
            }
        } catch (error) {
            console.error("Failed to fetch revenue", error);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, filters]);

    useEffect(() => {
        getRevenueTotals().then(res => {
            if (res.success) setTotals(res.data);
        });
    }, []);

    useEffect(() => {
        fetchRevenue();
    }, [fetchRevenue]);

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
            // Use the same filters that are currently active for the table
            const activeFilters = { ...filters };
            Object.keys(activeFilters).forEach(key => {
                if (!activeFilters[key]) delete activeFilters[key];
            });
            await exportRevenue(activeFilters);
            showNotification('Revenue data is being downloaded.', 'success');
        } catch (error) {
            console.error("Export failed:", error);
            showNotification('Failed to export data. Please try again.', 'error');
        } finally {
            setIsExporting(false);
        }
    };

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
                    <div>
                        <h1 className="text-3xl font-bold">Platform Revenue</h1>
                        <p className="text-muted-foreground mt-1">Track commissions, fees, and net margins.</p>
                    </div>
                    <Button
                        onClick={handleExport}
                        disabled={isExporting}
                        iconName={isExporting ? 'Loader' : 'Download'}
                    >
                        {isExporting ? 'Exporting...' : 'Export Excel'}
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-card p-6 rounded-lg border"><h4 className="text-muted-foreground">Total Commission Revenue</h4><p className="text-3xl font-bold">{formatCurrency(totals?.commission_revenue)}</p></div>
                    <div className="bg-card p-6 rounded-lg border"><h4 className="text-muted-foreground">Total Payment Gateway Fees</h4><p className="text-3xl font-bold">{formatCurrency(totals?.payment_gateway_fees)}</p></div>
                    <div className="bg-card p-6 rounded-lg border"><h4 className="text-muted-foreground">Total Net Margin</h4><p className="text-3xl font-bold">{formatCurrency(totals?.net_margin)}</p></div>
                </div>

                <div className="bg-card rounded-lg border p-4 flex flex-wrap md:flex-nowrap gap-4 items-end">
                    <div className="flex-1 min-w-[150px]">
                        <Input
                            type="date"
                            label="From"
                            value={filters.start_date}
                            onChange={e => handleFilterChange('start_date', e.target.value)}
                        />
                    </div>
                    <div className="flex-1 min-w-[150px]">
                        <Input
                            type="date"
                            label="To"
                            value={filters.end_date}
                            onChange={e => handleFilterChange('end_date', e.target.value)}
                        />
                    </div>
                    <Button variant="ghost" onClick={() => setFilters(initialFilters)}>
                        Clear
                    </Button>
                </div>


                <RevenueTable
                    revenue={revenue}
                    isLoading={isLoading}
                    onView={(orderId) => navigate(`/revenue/details/${orderId}`)}
                />

                <Pagination meta={pagination} onPageChange={setCurrentPage} />
            </div>
        </DashboardLayout>
    );
};

export default RevenueDashboard;