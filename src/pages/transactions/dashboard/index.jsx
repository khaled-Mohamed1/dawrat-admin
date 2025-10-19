import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../components/ui/DashboardLayout.jsx";
import Input from "../../../components/ui/Input.jsx";
import Select from "../../../components/ui/Select.jsx";
import Button from "../../../components/ui/Button.jsx";
import { useDebounce } from "../../../hooks/useDebounce.js";
import Pagination from "../../../components/ui/Pagination.jsx";
import TransactionTable from './components/TransactionTable';
import { getTransactions, exportTransactions } from '../../../api/transactionService';

const TransactionsDashboard = () => {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isExporting, setIsExporting] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const initialFilters = {
        status: 'all', search: '',
        start_date: '', end_date: ''
    };
    const [filters, setFilters] = useState(initialFilters);
    const debounced = useDebounce(filters.search, 500);

    const fetchTransactions = useCallback(async () => {
        setIsLoading(true);
        try {
            const activeFilters = {
                ...filters,
                search: debounced,
                page: currentPage
            };
            Object.keys(activeFilters).forEach(key => {
                if (!activeFilters[key] || activeFilters[key] === 'all') delete activeFilters[key];
            });

            const response = await getTransactions(activeFilters);
            if (response.success) {
                setTransactions(response.data);
                setPagination(response.meta);
            }
        } catch (error) {
            console.error("Failed to fetch transactions", error);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, debounced, debounced, filters.status, filters.start_date, filters.end_date]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
        setCurrentPage(1);
    };

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const activeFilters = { ...filters, search: debounced };
            Object.keys(activeFilters).forEach(key => {
                if (activeFilters[key] === '' || activeFilters[key] === 'all') {
                    delete activeFilters[key];
                }
            });

            await exportTransactions(activeFilters);
        } catch (error) {
            console.error("Export failed:", error);
        } finally {
            setIsExporting(false);
        }
    };

    const statusOptions = [{label: 'All Statuses', value: 'all'}, {label: 'Succeeded', value: 'Succeeded'}, {label: 'Failed', value: 'Failed'}, {label: 'Pending', value: 'Pending'}];

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Transactions</h1>
                        <p className="text-muted-foreground mt-1">View all payment transactions.</p>
                    </div>
                    <Button onClick={handleExport} disabled={isExporting} iconName={isExporting ? 'Loader' : 'Download'}>
                        {isExporting ? 'Exporting...' : 'Export Excel'}
                    </Button>
                </div>

                <div className="bg-card rounded-lg border p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Input placeholder="Search Invoice #" value={filters.search} onChange={e => handleFilterChange('search', e.target.value)} />
                        <Select value={filters.status} onChange={value => handleFilterChange('status', value)} options={statusOptions} />
                        <Input type="date" label="From" value={filters.start_date} onChange={e => handleFilterChange('start_date', e.target.value)} />
                        <Input type="date" label="To" value={filters.end_date} onChange={e => handleFilterChange('end_date', e.target.value)} />
                    </div>
                    <div className="flex justify-end">
                        <Button variant="ghost" size="sm" onClick={() => setFilters(initialFilters)}>Clear Filters</Button>
                    </div>
                </div>

                <TransactionTable
                    transactions={transactions}
                    isLoading={isLoading}
                    onView={(id) => navigate(`/transactions/details/${id}`)}
                />

                <Pagination meta={pagination} onPageChange={setCurrentPage} />
            </div>
        </DashboardLayout>
    );
};

export default TransactionsDashboard;