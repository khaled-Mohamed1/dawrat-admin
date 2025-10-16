import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../components/ui/DashboardLayout.jsx";
import Input from "../../../components/ui/Input.jsx";
import Select from "../../../components/ui/Select.jsx";
import Button from "../../../components/ui/Button.jsx";
import { useDebounce } from "../../../hooks/useDebounce.js";
import Pagination from "../../../components/ui/Pagination.jsx";
import ConfirmationModal from "../../../components/ui/ConfirmationModal.jsx";
import SubscriptionTable from './components/SubscriptionTable';
import {getSubscriptions, togglePauseSubscription} from '../../../api/subscriptionService';

const SubscriptionsDashboard = () => {
    const navigate = useNavigate();
    const [subscriptions, setSubscriptions] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [confirmationModal, setConfirmationModal] = useState({ isOpen: false });
    const [currentPage, setCurrentPage] = useState(1);

    const initialFilters = {
        search: '', status: 'all', plan_tier: 'all',
        plan_level: 'all', start_date: '', end_date: ''
    };
    const [filters, setFilters] = useState(initialFilters);
    const debouncedSearch = useDebounce(filters.search, 500);

    const fetchSubscriptions = useCallback(async () => {
        setIsLoading(true);
        try {
            const activeFilters = { ...filters, search: debouncedSearch, page: currentPage };
            Object.keys(activeFilters).forEach(key => {
                if (!activeFilters[key] || activeFilters[key] === 'all') {
                    delete activeFilters[key];
                }
            });

            const response = await getSubscriptions(activeFilters);
            if (response.success) {
                setSubscriptions(response.data);
                setPagination(response.meta);
            }
        } catch (error) {
            console.error("Failed to fetch subscriptions", error);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, debouncedSearch, filters]);

    useEffect(() => {
        fetchSubscriptions();
    }, [fetchSubscriptions]);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: '', type: '' }), 5000);
    };

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setFilters(initialFilters);
        setCurrentPage(1);
    };

    const handleViewDetails = (id) => navigate(`/subscriptions/details/${id}`);

    const handleTogglePause = (subscription) => {
        const isPaused = subscription.status?.toLowerCase() === 'paused';
        const actionText = isPaused ? 'unpause' : 'pause';

        setConfirmationModal({
            isOpen: true,
            type: 'status-change',
            title: `${actionText.charAt(0).toUpperCase() + actionText.slice(1)} Subscription`,
            message: `Are you sure you want to ${actionText} the subscription for "${subscription.user}"?`,
            onConfirm: async () => {
                try {
                    const response = await togglePauseSubscription(subscription.id);
                    showNotification(response.message || `Subscription ${actionText}d successfully.`, 'success');
                    fetchSubscriptions();
                } catch (error) {
                    showNotification(error.message || `Failed to ${actionText} subscription.`, 'error');
                } finally {
                    setConfirmationModal({ isOpen: false });
                }
            }
        });
    };

    // --- Filter Options ---
    const statusOptions = [{label: 'All Statuses', value: 'all'}, {label: 'Trial', value: 'Trial'}, {label: 'Active', value: 'Active'}, {label: 'Expired', value: 'Expired'}, {label: 'Paused', value: 'Paused'}];
    const tierOptions = [{label: 'All Tiers', value: 'all'}, {label: 'Personal', value: 'Personal'}, {label: 'Enterprise', value: 'Enterprise'}];
    const levelOptions = [{label: 'All Levels', value: 'all'}, {label: 'Free', value: 'Free'}, {label: 'Starter', value: 'Starter'}, {label: 'Pro', value: 'Pro'}, {label: 'Business', value: 'Business'}];

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {notification.message && (
                    <div className={`p-4 rounded-md text-sm ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {notification.message}
                    </div>
                )}

                <div>
                    <h1 className="text-3xl font-bold">Active Subscriptions</h1>
                    <p className="text-muted-foreground mt-1">View and manage all user subscriptions.</p>
                </div>

                <div className="bg-card rounded-lg border p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Input placeholder="Search by user name..." value={filters.search} onChange={e => handleFilterChange('search', e.target.value)} />
                        <Select value={filters.status} onChange={value => handleFilterChange('status', value)} options={statusOptions} />
                        <Select value={filters.plan_tier} onChange={value => handleFilterChange('plan_tier', value)} options={tierOptions} />
                        <Select value={filters.plan_level} onChange={value => handleFilterChange('plan_level', value)} options={levelOptions} />
                        <Input type="date" value={filters.start_date} onChange={e => handleFilterChange('start_date', e.target.value)} />
                        <Input type="date" value={filters.end_date} onChange={e => handleFilterChange('end_date', e.target.value)} />
                        <Button variant="ghost" size="sm" onClick={clearFilters}>Clear All Filters</Button>
                    </div>
                </div>

                <SubscriptionTable
                    subscriptions={subscriptions}
                    isLoading={isLoading}
                    onViewDetails={handleViewDetails}
                    onTogglePause={handleTogglePause}
                />

                <Pagination meta={pagination} onPageChange={setCurrentPage} />

                <ConfirmationModal isOpen={confirmationModal.isOpen} {...confirmationModal} onCancel={() => setConfirmationModal({ isOpen: false })} />
            </div>
        </DashboardLayout>
    );
};

export default SubscriptionsDashboard;