import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../components/ui/DashboardLayout.jsx";
import Input from "../../../components/ui/Input.jsx";
import Select from "../../../components/ui/Select.jsx";
import Button from "../../../components/ui/Button.jsx";
import { useDebounce } from "../../../hooks/useDebounce.js";
import Pagination from "../../../components/ui/Pagination.jsx";
import PayoutTable from './components/PayoutTable';
import { getPayouts } from '../../../api/payoutService';

const PayoutsDashboard = () => {
    const navigate = useNavigate();
    const [payouts, setPayouts] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const initialFilters = { search: '', status: 'all', start_date: '', end_date: '' };
    const [filters, setFilters] = useState(initialFilters);
    const debouncedSearch = useDebounce(filters.search, 500);

    const fetchPayouts = useCallback(async () => {
        setIsLoading(true);
        try {
            const activeFilters = { ...filters, search: debouncedSearch, page: currentPage };
            Object.keys(activeFilters).forEach(key => {
                if (!activeFilters[key] || activeFilters[key] === 'all') delete activeFilters[key];
            });
            const response = await getPayouts(activeFilters);
            if (response.success) {
                setPayouts(response.data);
                setPagination(response.meta);
            }
        } catch (error) {
            console.error("Failed to fetch payouts", error);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, debouncedSearch, filters]);

    useEffect(() => {
        fetchPayouts();
    }, [fetchPayouts]);

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
        setCurrentPage(1);
    };

    const statusOptions = [
        { label: 'All Statuses', value: 'all' },
        { label: 'Draft', value: 'Draft' }, { label: 'Locked', value: 'Locked' },
        { label: 'Sent', value: 'Sent' }, { label: 'Processing', value: 'Processing' },
        { label: 'Completed', value: 'Completed' }, { label: 'Failed', value: 'Failed' }
    ];

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Payout Batches</h1>
                    <p className="text-muted-foreground mt-1">Manage and track trainer payout batches.</p>
                </div>

                <div className="bg-card rounded-lg border p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Input placeholder="Search Batch ID or Ref #" value={filters.search} onChange={e => handleFilterChange('search', e.target.value)} />
                        <Select value={filters.status} onChange={value => handleFilterChange('status', value)} options={statusOptions} />
                        <Input type="date" label="From" value={filters.start_date} onChange={e => handleFilterChange('start_date', e.target.value)} />
                        <Input type="date" label="To" value={filters.end_date} onChange={e => handleFilterChange('end_date', e.target.value)} />
                    </div>
                    <div className="flex justify-end"><Button variant="ghost" size="sm" onClick={() => setFilters(initialFilters)}>Clear Filters</Button></div>
                </div>

                <PayoutTable
                    payouts={payouts}
                    isLoading={isLoading}
                    onView={(id) => navigate(`/payouts/details/${id}`)}
                />

                <Pagination meta={pagination} onPageChange={setCurrentPage} />
            </div>
        </DashboardLayout>
    );
};

export default PayoutsDashboard;