import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../components/ui/DashboardLayout.jsx";
import Input from "../../../components/ui/Input.jsx";
import Select from "../../../components/ui/Select.jsx";
import Button from "../../../components/ui/Button.jsx";
import Pagination from "../../../components/ui/Pagination.jsx";
import ConfirmationModal from "../../../components/ui/ConfirmationModal.jsx";
import CouponTable from './components/CouponTable';
import { getCoupons, deleteCoupon, changeCouponStatus } from '../../../api/couponService';

const CouponsDashboard = () => {
    const navigate = useNavigate();
    const [coupons, setCoupons] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [confirmationModal, setConfirmationModal] = useState({ isOpen: false });
    const [currentPage, setCurrentPage] = useState(1);

    const initialFilters = { owner_type: 'all', status: 'all', start_date: '', end_date: '' };
    const [filters, setFilters] = useState(initialFilters);

    const fetchCoupons = useCallback(async () => {
        setIsLoading(true);
        try {
            const activeFilters = { ...filters, page: currentPage };
            Object.keys(activeFilters).forEach(key => {
                if (!activeFilters[key] || activeFilters[key] === 'all') delete activeFilters[key];
            });
            const response = await getCoupons(activeFilters);
            if (response.success) {
                setCoupons(response.data);
                setPagination(response.meta);
            }
        } catch (error) { console.error("Failed to fetch coupons", error); }
        finally { setIsLoading(false); }
    }, [currentPage, filters]);

    useEffect(() => { fetchCoupons(); }, [fetchCoupons]);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: '', type: '' }), 5000);
    };

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
        setCurrentPage(1);
    };

    const handleDelete = (coupon) => {
        setConfirmationModal({
            isOpen: true,
            type: 'delete',
            title: 'Delete Coupon',
            message: `Are you sure you want to delete the coupon "${coupon.code}"? This action cannot be undone.`,
            onConfirm: async () => {
                try {
                    const response = await deleteCoupon(coupon.id);
                    showNotification(response.message || 'Coupon deleted successfully.', 'success');
                    fetchCoupons();
                } catch (error) {
                    showNotification(error.message || 'Failed to delete coupon.', 'error');
                } finally {
                    setConfirmationModal({ isOpen: false });
                }
            }
        });
    };

    const handleStatusChange = (coupon) => {
        const newStatus = coupon.status === 'active' ? 'inactive' : 'active';
        const actionText = newStatus === 'active' ? 'activate' : 'deactivate';
        setConfirmationModal({
            isOpen: true,
            type: 'status-change',
            title: `${actionText.charAt(0).toUpperCase() + actionText.slice(1)} Coupon`,
            message: `Are you sure you want to ${actionText} the coupon "${coupon.code}"?`,
            onConfirm: async () => {
                try {
                    const response = await changeCouponStatus(coupon.id, { status: newStatus });
                    showNotification(response.message || 'Status updated successfully.', 'success');
                    fetchCoupons();
                } catch (error) {
                    showNotification(error.message || 'Failed to update status.', 'error');
                } finally {
                    setConfirmationModal({ isOpen: false });
                }
            }
        });
    };

    const statusOptions = [{label: 'All Statuses', value: 'all'}, {label: 'Draft', value: 'draft'}, {label: 'Active', value: 'active'}, {label: 'Inactive', value: 'inactive'}, {label: 'Expired', value: 'expired'}];
    const ownerOptions = [{label: 'All Owners', value: 'all'}, {label: 'Trainer', value: 'trainer'}, {label: 'Center', value: 'center'}];

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
                        <h1 className="text-3xl font-bold">Coupons Management</h1>
                        <p className="text-muted-foreground mt-1">Manage discount codes.</p>
                    </div>
                </div>

                <div className="bg-card rounded-lg border p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Select value={filters.status} onChange={value => handleFilterChange('status', value)} options={statusOptions} />
                        <Select value={filters.owner_type} onChange={value => handleFilterChange('owner_type', value)} options={ownerOptions} />
                        <Input type="date" label="Start Date From" value={filters.start_date} onChange={e => handleFilterChange('start_date', e.target.value)} />
                        <Input type="date" label="Start Date To" value={filters.end_date} onChange={e => handleFilterChange('end_date', e.target.value)} />
                    </div>
                    <div className="flex justify-end"><Button variant="ghost" size="sm" onClick={() => setFilters(initialFilters)}>Clear Filters</Button></div>
                </div>

                <CouponTable
                    coupons={coupons}
                    isLoading={isLoading}
                    onDelete={handleDelete}
                    onView={(id) => navigate(`/coupons/details/${id}`)}
                    onStatusChange={handleStatusChange}
                />

                <Pagination meta={pagination} onPageChange={setCurrentPage} />
                <ConfirmationModal isOpen={confirmationModal.isOpen} {...confirmationModal} onCancel={() => setConfirmationModal({ isOpen: false })} />
            </div>
        </DashboardLayout>
    );
};
export default CouponsDashboard;