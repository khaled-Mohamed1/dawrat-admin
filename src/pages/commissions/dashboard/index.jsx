import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../components/ui/DashboardLayout.jsx";
import Input from "../../../components/ui/Input.jsx";
import Select from "../../../components/ui/Select.jsx";
import Button from "../../../components/ui/Button.jsx";
import { useDebounce } from "../../../hooks/useDebounce.js";
import Pagination from "../../../components/ui/Pagination.jsx";
import CommissionTable from './components/CommissionTable';
import { getCommissions } from '../../../api/commissionService';

const CommissionsDashboard = () => {
    const navigate = useNavigate();
    const [commissions, setCommissions] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const initialFilters = {
        search: '', status: 'all', commission: '',
        start_date: '', end_date: ''
    };
    const [filters, setFilters] = useState(initialFilters);
    const debouncedSearch = useDebounce(filters.search, 500);
    const debouncedCommission = useDebounce(filters.commission, 500);

    const fetchCommissions = useCallback(async () => {
        setIsLoading(true);
        try {
            const activeFilters = {
                ...filters,
                search: debouncedSearch,
                commission: debouncedCommission,
                page: currentPage
            };
            Object.keys(activeFilters).forEach(key => {
                if (!activeFilters[key] || activeFilters[key] === 'all') delete activeFilters[key];
            });
            const response = await getCommissions(activeFilters);
            if (response.success) {
                setCommissions(response.data);
                setPagination(response.meta);
            }
        } catch (error) {
            console.error("Failed to fetch commissions", error);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, debouncedSearch, debouncedCommission, filters.status, filters.start_date, filters.end_date]);

    useEffect(() => {
        fetchCommissions();
    }, [fetchCommissions]);

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
        setCurrentPage(1);
    };

    const statusOptions = [
        { label: 'All Statuses', value: 'all' },
        { label: 'Trial', value: 'Trial' }, { label: 'Active', value: 'Active' },
        { label: 'Expired', value: 'Expired' }, { label: 'Paused', value: 'Paused' },
        { label: 'Cancelled', value: 'Cancelled' }, { label: 'Upgraded', value: 'Upgraded' }
    ];

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Commissions Management</h1>
                    <p className="text-muted-foreground mt-1">View and manage commissions for trainers and centers.</p>
                </div>

                <div className="bg-card rounded-lg border p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Input placeholder="Search user name..." value={filters.search} onChange={e => handleFilterChange('search', e.target.value)} />
                        <Input type="number" placeholder="Filter by commission %" value={filters.commission} onChange={e => handleFilterChange('commission', e.target.value)} />
                        <Select value={filters.status} onChange={value => handleFilterChange('status', value)} options={statusOptions} />
                        <Input type="date" label="Start Date From" value={filters.start_date} onChange={e => handleFilterChange('start_date', e.target.value)} />
                        <Input type="date" label="Start Date To" value={filters.end_date} onChange={e => handleFilterChange('end_date', e.target.value)} />
                    </div>
                    <div className="flex justify-end"><Button variant="ghost" size="sm" onClick={() => setFilters(initialFilters)}>Clear Filters</Button></div>
                </div>

                <CommissionTable
                    commissions={commissions}
                    isLoading={isLoading}
                    onView={(userId) => navigate(`/commissions/details/${userId}`)}
                />

                <Pagination meta={pagination} onPageChange={setCurrentPage} />
            </div>
        </DashboardLayout>
    );
};

export default CommissionsDashboard;