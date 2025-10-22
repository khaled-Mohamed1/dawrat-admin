import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../components/ui/DashboardLayout.jsx";
import Input from "../../../components/ui/Input.jsx";
import Select from "../../../components/ui/Select.jsx";
import Button from "../../../components/ui/Button.jsx";
import { useDebounce } from "../../../hooks/useDebounce.js";
import Pagination from "../../../components/ui/Pagination.jsx";
import ConfirmationModal from "../../../components/ui/ConfirmationModal.jsx";
import AdTable from './components/AdTable';
import { getAds, deleteAd, changeAdStatus } from '../../../api/adService';

const AdsDashboard = () => {
    const navigate = useNavigate();
    const [ads, setAds] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [confirmationModal, setConfirmationModal] = useState({ isOpen: false });
    const [currentPage, setCurrentPage] = useState(1);

    const initialFilters = { search: '', status: 'all', start_date: '', end_date: '' };
    const [filters, setFilters] = useState(initialFilters);
    const debouncedSearch = useDebounce(filters.search, 500);

    const fetchAds = useCallback(async () => {
        setIsLoading(true);
        try {
            const activeFilters = { ...filters, search: debouncedSearch, page: currentPage };
            Object.keys(activeFilters).forEach(key => {
                if (!activeFilters[key] || activeFilters[key] === 'all') delete activeFilters[key];
            });
            const response = await getAds(activeFilters);
            if (response.success) {
                setAds(response.data);
                setPagination(response.meta);
            }
        } catch (error) {
            console.error("Failed to fetch ads", error);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, debouncedSearch, filters.status, filters.start_date, filters.end_date]);

    useEffect(() => {
        fetchAds();
    }, [fetchAds]);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: '', type: '' }), 5000);
    };

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
        setCurrentPage(1);
    };

    const handleDelete = (ad) => {
        setConfirmationModal({
            isOpen: true,
            type: 'delete',
            title: 'Delete Ad',
            message: `Are you sure you want to delete the ad "${ad.title}"?`,
            onConfirm: async () => {
                try {
                    await deleteAd(ad.id);
                    showNotification('Ad deleted successfully.', 'success');
                    fetchAds();
                } catch (error) {
                    showNotification('Failed to delete ad.', 'error');
                } finally {
                    setConfirmationModal({ isOpen: false });
                }
            }
        });
    };

    const handleStatusChange = (ad) => {
        const newStatus = ad.is_active ? 0 : 1;
        const actionText = newStatus ? 'activate' : 'deactivate';
        setConfirmationModal({
            isOpen: true,
            type: 'status-change',
            title: `${actionText.charAt(0).toUpperCase() + actionText.slice(1)} Ad`,
            message: `Are you sure you want to ${actionText} the ad "${ad.title}"?`,
            onConfirm: async () => {
                try {
                    await changeAdStatus(ad.id, { status: newStatus });
                    showNotification('Status updated successfully.', 'success');
                    fetchAds();
                } catch (error) {
                    showNotification('Failed to update status.', 'error');
                } finally {
                    setConfirmationModal({ isOpen: false });
                }
            }
        });
    };

    const statusOptions = [
        { label: 'All Statuses', value: 'all' },
        { label: 'Pending', value: 'Pending' },
        { label: 'Approved', value: 'Approved' },
        { label: 'Rejected', value: 'Rejected' },
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
                        <h1 className="text-3xl font-bold">Ad Management</h1>
                        <p className="text-muted-foreground mt-1">Manage user-submitted advertisements.</p>
                    </div>
                    <Button onClick={() => navigate('/ads/details/new')} iconName="Plus">
                        Add New Ad
                    </Button>
                </div>

                <div className="bg-card rounded-lg border p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Input placeholder="Search title or user..." value={filters.search} onChange={e => handleFilterChange('search', e.target.value)} />
                        <Select value={filters.status} onChange={value => handleFilterChange('status', value)} options={statusOptions} />
                        <Input type="date" label="From" value={filters.start_date} onChange={e => handleFilterChange('start_date', e.target.value)} />
                        <Input type="date" label="To" value={filters.end_date} onChange={e => handleFilterChange('end_date', e.target.value)} />
                    </div>
                    <div className="flex justify-end"><Button variant="ghost" size="sm" onClick={() => setFilters(initialFilters)}>Clear Filters</Button></div>
                </div>

                <AdTable
                    ads={ads}
                    isLoading={isLoading}
                    onDelete={handleDelete}
                    onEdit={(id) => navigate(`/ads/details/${id}?mode=edit`)}
                    onView={(id) => navigate(`/ads/details/${id}`)}
                    onStatusChange={handleStatusChange}
                />

                <Pagination meta={pagination} onPageChange={setCurrentPage} />
                <ConfirmationModal isOpen={confirmationModal.isOpen} {...confirmationModal} onCancel={() => setConfirmationModal({ isOpen: false })} />
            </div>
        </DashboardLayout>
    );
};

export default AdsDashboard;