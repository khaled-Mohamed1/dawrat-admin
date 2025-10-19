import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../components/ui/DashboardLayout.jsx";
import Input from "../../../components/ui/Input.jsx";
import Select from "../../../components/ui/Select.jsx";
import Button from "../../../components/ui/Button.jsx";
import Icon from "../../../components/AppIcon.jsx";
import { useDebounce } from "../../../hooks/useDebounce.js";
import Pagination from "../../../components/ui/Pagination.jsx";
import ConfirmationModal from "../../../components/ui/ConfirmationModal.jsx";
import OrderTable from './components/OrderTable';
import { getOrders, deleteOrder, getOrderTotals, getAllCourses, getAllTransactions, exportOrders } from '../../../api/orderService';

const OrdersDashboard = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [totals, setTotals] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [confirmationModal, setConfirmationModal] = useState({ isOpen: false });
    const [currentPage, setCurrentPage] = useState(1);
    const [isExporting, setIsExporting] = useState(false);

    // State for filter dropdowns
    const [filterOptions, setFilterOptions] = useState({ courses: [], transactions: [] });

    const initialFilters = {
        search: '', status: 'all', payment_method: 'all',
        transaction_id: 'all', course_id: 'all', start_date: '', end_date: ''
    };
    const [filters, setFilters] = useState(initialFilters);
    const debouncedSearch = useDebounce(filters.search, 500);

    const fetchOrders = useCallback(async () => {
        setIsLoading(true);
        try {
            const activeFilters = { ...filters, search: debouncedSearch, page: currentPage };
            Object.keys(activeFilters).forEach(key => {
                if (!activeFilters[key] || activeFilters[key] === 'all') delete activeFilters[key];
            });
            const response = await getOrders(activeFilters);
            if (response.success) {
                setOrders(response.data);
                setPagination(response.meta);
            }
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, debouncedSearch, filters]);

    useEffect(() => {
        // Fetch data for filter dropdowns and totals on initial load
        const fetchInitialData = async () => {
            const [totalsData, coursesData, transactionsData] = await Promise.all([
                getOrderTotals(),
                getAllCourses(),
                getAllTransactions()
            ]);
            if (totalsData.success) setTotals(totalsData.data);
            setFilterOptions({ courses: coursesData, transactions: transactionsData });
        };
        fetchInitialData();
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: '', type: '' }), 5000);
    };

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
        setCurrentPage(1);
    };

    const handleDelete = (order) => {
        setConfirmationModal({
            isOpen: true,
            type: 'delete',
            title: 'Delete Order',
            message: `Are you sure you want to delete order #${order.order_number}? This action is irreversible.`,
            onConfirm: async () => {
                try {
                    await deleteOrder(order.id);
                    showNotification('Order deleted successfully.', 'success');
                    fetchOrders();
                } catch (error) {
                    showNotification('Failed to delete order.', 'error');
                } finally {
                    setConfirmationModal({ isOpen: false });
                }
            }
        });
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

            await exportOrders(activeFilters);
            showNotification('Order data is being downloaded.', 'success');
        } catch (error) {
            console.error("Export failed:", error);
            showNotification('Failed to export data. Please try again.', 'error');
        } finally {
            setIsExporting(false);
        }
    };

    const handleViewDetails = (orderId) => navigate(`/orders/details/${orderId}`);


    const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);

    // Options for Select components
    const statusOptions = [{label: 'All Statuses', value: 'all'}, {label: 'Pending', value: 'pending'}, {label: 'Processing', value: 'processing'}, {label: 'Completed', value: 'completed'}, {label: 'Cancelled', value: 'cancelled'}, {label: 'Failed', value: 'failed'}];
    const courseOptions = useMemo(() => [{label: 'All Courses', value: 'all'}, ...filterOptions.courses.map(c => ({ label: c.name, value: c.id }))], [filterOptions.courses]);
    const transactionOptions = useMemo(() => [{label: 'All Transactions', value: 'all'}, ...filterOptions.transactions.map(t => ({ label: t.transaction_number, value: t.id }))], [filterOptions.transactions]);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {notification.message && (
                    <div className={`p-4 rounded-md text-sm ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {notification.message}
                    </div>
                )}

                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Orders Management</h1>
                    <Button
                        variant="outline"
                        onClick={handleExport}
                        disabled={isExporting}
                        iconName={isExporting ? 'Loader' : 'Download'}
                    >
                        {isExporting ? 'Exporting...' : 'Export Excel'}
                    </Button>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-card p-6 rounded-lg border"><h4 className="text-muted-foreground">Total Orders</h4><p className="text-3xl font-bold">{totals?.order_count ?? '...'}</p></div>
                    <div className="bg-card p-6 rounded-lg border"><h4 className="text-muted-foreground">Total Revenue</h4><p className="text-3xl font-bold">{formatCurrency(totals?.total_revenue)}</p></div>
                </div>

                {/* Filters */}
                <div className="bg-card rounded-lg border p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Input placeholder="Search user..." value={filters.search} onChange={e => handleFilterChange('search', e.target.value)} />
                        <Select value={filters.status} onChange={value => handleFilterChange('status', value)} options={statusOptions} />
                        <Select value={filters.course_id} onChange={value => handleFilterChange('course_id', value)} options={courseOptions} searchable />
                        <Select value={filters.transaction_id} onChange={value => handleFilterChange('transaction_id', value)} options={transactionOptions} searchable />
                        <Input type="date" label="From" value={filters.start_date} onChange={e => handleFilterChange('start_date', e.target.value)} />
                        <Input type="date" label="To" value={filters.end_date} onChange={e => handleFilterChange('end_date', e.target.value)} />
                    </div>
                    <div className="flex justify-end"><Button variant="ghost" size="sm" onClick={() => setFilters(initialFilters)}>Clear Filters</Button></div>
                </div>

                <OrderTable
                    orders={orders}
                    isLoading={isLoading}
                    onDelete={handleDelete}
                    onView={handleViewDetails}
                />

                <Pagination meta={pagination} onPageChange={setCurrentPage} />
                <ConfirmationModal isOpen={confirmationModal.isOpen} {...confirmationModal} onCancel={() => setConfirmationModal({ isOpen: false })} />
            </div>
        </DashboardLayout>
    );
};

export default OrdersDashboard;