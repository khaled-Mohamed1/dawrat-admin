import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../components/ui/DashboardLayout.jsx";
import Button from "../../../components/ui/Button.jsx";
import ConfirmationModal from "../../../components/ui/ConfirmationModal.jsx";
import SubscriptionPlanTable from './components/SubscriptionPlanTable';
import { getSubscriptionPlans, deleteSubscriptionPlan } from '../../../api/subscriptionPlanService';
import Select from "../../../components/ui/Select.jsx";

const SubscriptionsPlanDashboard = () => {
    const navigate = useNavigate();
    const [plans, setPlans] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [confirmationModal, setConfirmationModal] = useState({ isOpen: false });
    const [currentPage, setCurrentPage] = useState(1);

    const initialFilters = {
        plan_type: 'all',
        plan_tier: 'all',
        plan_level: 'all',
    };

    const [filters, setFilters] = useState(initialFilters);

    const fetchPlans = useCallback(async () => {
        setIsLoading(true);
        try {
            const activeFilters = { ...filters, page: currentPage };
            Object.keys(activeFilters).forEach(key => {
                if (activeFilters[key] === 'all') {
                    delete activeFilters[key];
                }
            });

            const response = await getSubscriptionPlans(activeFilters);
            if (response.success) {
                setPlans(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch subscription plans", error);
        } finally {
            setIsLoading(false);
        }
    }, [filters, currentPage]);

    useEffect(() => {
        fetchPlans();
    }, [fetchPlans]);

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setFilters(initialFilters);
        setCurrentPage(1);
    };

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: '', type: '' }), 5000);
    };

    const handleDeletePlan = (plan) => {
        setConfirmationModal({
            isOpen: true,
            type: 'delete',
            title: 'Delete Subscription Plan',
            message: `Are you sure you want to delete the "${plan.plan_tier} - ${plan.plan_level}" plan? This action cannot be undone.`,
            onConfirm: async () => {
                try {
                    const response = await deleteSubscriptionPlan(plan.id);
                    showNotification(response.message || 'Plan deleted successfully.', 'success');
                    fetchPlans();
                } catch (error) {
                    showNotification(error.message || 'Failed to delete the plan.', 'error');
                } finally {
                    setConfirmationModal({ isOpen: false });
                }
            }
        });
    };

    const handleViewPlan = (planId) => {
        navigate(`/subscriptions-plans/details/${planId}`);
    };

    const handleEditPlan = (planId) => {
        navigate(`/subscriptions-plans/details/${planId}?mode=edit`);
    };

    const typeOptions = [
        { label: 'All Types', value: 'all' },
        { label: 'Monthly', value: 'Monthly' },
        { label: 'Annual', value: 'Annual' },
    ];
    const tierOptions = [
        { label: 'All Tiers', value: 'all' },
        { label: 'Personal', value: 'Personal' },
        { label: 'Enterprise', value: 'Enterprise' },
    ];
    const levelOptions = [
        { label: 'All Levels', value: 'all' },
        { label: 'Free', value: 'Free' },
        { label: 'Starter', value: 'Starter' },
        { label: 'Pro', value: 'Pro' },
        { label: 'Business', value: 'Business' },
    ];

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
                        <h1 className="text-3xl font-bold">Subscription Plans</h1>
                        <p className="text-muted-foreground mt-1">Manage pricing tiers and features for trainers.</p>
                    </div>
                    <Button onClick={() => navigate('/subscriptions-plans/details/new')} iconName="Plus">
                        Add New Plan
                    </Button>
                </div>

                <div className="bg-card rounded-lg border p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Select
                            value={filters.plan_type}
                            onChange={(value) => handleFilterChange('plan_type', value)}
                            options={typeOptions}
                        />
                        <Select
                            value={filters.plan_tier}
                            onChange={(value) => handleFilterChange('plan_tier', value)}
                            options={tierOptions}
                        />
                        <Select
                            value={filters.plan_level}
                            onChange={(value) => handleFilterChange('plan_level', value)}
                            options={levelOptions}
                        />
                        <Button variant="ghost" onClick={clearFilters} className="w-full">
                            Clear Filters
                        </Button>
                    </div>
                </div>

                <SubscriptionPlanTable
                    plans={plans}
                    isLoading={isLoading}
                    onDelete={handleDeletePlan}
                    onEdit={handleEditPlan}
                    onView={handleViewPlan}
                />

                <ConfirmationModal
                    isOpen={confirmationModal.isOpen}
                    {...confirmationModal}
                    onCancel={() => setConfirmationModal({ isOpen: false })}
                />
            </div>
        </DashboardLayout>
    );
};

export default SubscriptionsPlanDashboard;