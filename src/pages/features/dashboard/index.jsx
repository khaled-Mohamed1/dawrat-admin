import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../components/ui/DashboardLayout.jsx";
import Input from "../../../components/ui/Input.jsx";
import Select from "../../../components/ui/Select.jsx";
import Button from "../../../components/ui/Button.jsx";
import { useDebounce } from "../../../hooks/useDebounce.js";
import Pagination from "../../../components/ui/Pagination.jsx";
import ConfirmationModal from "../../../components/ui/ConfirmationModal.jsx";
import FeatureTable from './components/FeatureTable';
import { getFeatures, deleteFeature, changeFeatureStatus } from '../../../api/featureService';

const FeaturesDashboard = () => {
    const navigate = useNavigate();
    const [features, setFeatures] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [confirmationModal, setConfirmationModal] = useState({ isOpen: false });
    const [currentPage, setCurrentPage] = useState(1);

    const initialFilters = { search: '', status: 'all' };
    const [filters, setFilters] = useState(initialFilters);
    const debouncedSearch = useDebounce(filters.search, 500);

    const fetchFeatures = useCallback(async () => {
        setIsLoading(true);
        try {
            const activeFilters = {
                search: debouncedSearch,
                status: filters.status,
                page: currentPage
            };

            if (activeFilters.status === 'all') delete activeFilters.status;
            if (!activeFilters.search) delete activeFilters.search;

            const response = await getFeatures(activeFilters);
            if (response.success) {
                setFeatures(response.data);
                setPagination(response.meta);
            }
        } catch (error) {
            console.error("Failed to fetch features", error);
        } finally {
            setIsLoading(false);
        }
        // Its dependencies are the values that should trigger a refetch.
    }, [currentPage, debouncedSearch, filters.status]);

    // **THE FIX, PART 2**: The useEffect now calls the function defined above.
    useEffect(() => {
        fetchFeatures();
    }, [fetchFeatures]);

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

    // --- Action Handlers ---
    const handleViewDetails = (id) => navigate(`/features/details/${id}`);
    const handleEditFeature = (id) => navigate(`/features/details/${id}?mode=edit`);

    const handleStatusChange = (feature) => {
        const newStatus = feature.status === 1 ? 0 : 1;
        const actionText = newStatus === 1 ? 'activate' : 'deactivate';
        setConfirmationModal({
            isOpen: true,
            type: 'status-change',
            title: `${actionText.charAt(0).toUpperCase() + actionText.slice(1)} Feature`,
            message: `Are you sure you want to ${actionText} "${feature.name}"?`,
            onConfirm: async () => {
                try {
                    const response = await changeFeatureStatus(feature.id);

                    if (response.success) {
                        showNotification(response.message || 'Status updated successfully.', 'success');
                        fetchFeatures();
                    } else {
                        throw new Error(response.message || 'An unknown API error occurred.');
                    }
                } catch (error) {
                    showNotification(error.message || 'Failed to update status.', 'error');
                } finally {
                    setConfirmationModal({ isOpen: false });
                }
            }
        });
    };

    const handleDeleteFeature = (feature) => {
        setConfirmationModal({
            isOpen: true,
            type: 'delete',
            title: 'Delete Feature',
            message: `Are you sure you want to delete "${feature.name}"?`,
            onConfirm: async () => {
                try {
                    await deleteFeature(feature.id);
                    showNotification('Feature deleted successfully.', 'success');
                    fetchFeatures();
                } catch (error) {
                    showNotification('Failed to delete feature.', 'error');
                } finally {
                    setConfirmationModal({ isOpen: false });
                }
            }
        });
    };

    const statusOptions = [
        { label: 'All Statuses', value: 'all' },
        { label: 'Active', value: '1' },
        { label: 'Inactive', value: '0' }
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
                        <h1 className="text-3xl font-bold">Features Management</h1>
                        <p className="text-muted-foreground mt-1">Configure features for subscription plans.</p>
                    </div>
                    <Button onClick={() => navigate('/features/details/new')} iconName="Plus">
                        Add New Feature
                    </Button>
                </div>

                <div className="bg-card rounded-lg border p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <Input placeholder="Search by name or type..." value={filters.search} onChange={e => handleFilterChange('search', e.target.value)} className="flex-1"/>
                        </div>
                        <div className="flex gap-3">
                            <Select value={filters.status} onChange={value => handleFilterChange('status', value)} options={statusOptions} className="w-full sm:w-40" />
                            <Button variant="ghost" onClick={clearFilters}>Clear</Button>
                        </div>
                    </div>
                </div>

                <FeatureTable
                    features={features}
                    isLoading={isLoading}
                    onViewDetails={handleViewDetails}
                    onEditFeature={handleEditFeature}
                    onStatusChange={handleStatusChange}
                    onDeleteFeature={handleDeleteFeature}
                />

                <Pagination meta={pagination} onPageChange={setCurrentPage} />

                <ConfirmationModal isOpen={confirmationModal.isOpen} {...confirmationModal} onCancel={() => setConfirmationModal({ isOpen: false })} />
            </div>
        </DashboardLayout>
    );
};

export default FeaturesDashboard;