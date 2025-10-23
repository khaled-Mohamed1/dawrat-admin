import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../components/ui/DashboardLayout.jsx";
import Input from "../../../components/ui/Input.jsx";
import Select from "../../../components/ui/Select.jsx";
import Button from "../../../components/ui/Button.jsx";
import { useDebounce } from "../../../hooks/useDebounce.js";
import Pagination from "../../../components/ui/Pagination.jsx";
import ConfirmationModal from "../../../components/ui/ConfirmationModal.jsx";
import CourseRequestTable from './components/CourseRequestTable';
import { getCourseRequests, closeCourseRequest, exportCourseRequests } from '../../../api/courseRequestService';
import { getAllCategories } from '../../../api/categoryService';

const CourseRequestsDashboard = () => {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [confirmationModal, setConfirmationModal] = useState({ isOpen: false });
    const [currentPage, setCurrentPage] = useState(1);
    const [isExporting, setIsExporting] = useState(false);

    // State for filter dropdowns
    const [categories, setCategories] = useState([]);

    const initialFilters = {
        search: '', status: 'all', category_name: '', start_date: '', end_date: ''
    };
    const [filters, setFilters] = useState(initialFilters);
    const debouncedSearch = useDebounce(filters.search, 500);

    const fetchRequests = useCallback(async () => {
        setIsLoading(true);
        try {
            const activeFilters = { ...filters, search: debouncedSearch, page: currentPage };
            Object.keys(activeFilters).forEach(key => {
                if (!activeFilters[key] || activeFilters[key] === 'all') delete activeFilters[key];
            });
            const response = await getCourseRequests(activeFilters);
            if (response.success) {
                setRequests(response.data);
                setPagination(response.meta);
            }
        } catch (error) {
            console.error("Failed to fetch course requests", error);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, debouncedSearch, filters]);

    useEffect(() => {
        getAllCategories().then(setCategories);
    }, []);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: '', type: '' }), 5000);
    };

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
        setCurrentPage(1);
    };

    const handleCloseRequest = (request) => {
        setConfirmationModal({
            isOpen: true,
            type: 'status-change',
            title: 'Close Request',
            message: `Are you sure you want to close the course request "${request.course_topic}"?`,
            onConfirm: async () => {
                try {
                    await closeCourseRequest(request.id);
                    showNotification('Request closed successfully.', 'success');
                    fetchRequests();
                } catch (error) {
                    showNotification('Failed to close request.', 'error');
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
                if (!activeFilters[key] || activeFilters[key] === 'all') delete activeFilters[key];
            });
            await exportCourseRequests(activeFilters);
            showNotification('Export is processing and will be downloaded shortly.', 'success');
        } catch (error) {
            console.error("Export failed:", error);
            showNotification('Failed to export data.', 'error');
        } finally {
            setIsExporting(false);
        }
    };

    const statusOptions = [{label: 'All Statuses', value: 'all'}, {label: 'Submitted', value: 'submitted'}, {label: 'Interested', value: 'interested'}, {label: 'Accepted', value: 'accepted'}, {label: 'Closed', value: 'closed'}];
    const categoryOptions = useMemo(() => [{ label: 'All Categories', value: '' }, ...categories.map(c => ({ label: c.name, value: c.name }))], [categories]);

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
                        <h1 className="text-3xl font-bold">Course Demands</h1>
                        <p className="text-muted-foreground mt-1">Manage user-submitted course demands.</p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={handleExport}
                        disabled={isExporting}
                        iconName={isExporting ? 'Loader' : 'Download'}
                    >
                        {isExporting ? 'Exporting...' : 'Export Excel'}
                    </Button>
                </div>

                <div className="bg-card rounded-lg border p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Input placeholder="Search by topic..." value={filters.search} onChange={e => handleFilterChange('search', e.target.value)} />
                        <Select value={filters.status} onChange={value => handleFilterChange('status', value)} options={statusOptions} />
                        <Select value={filters.category_name} onChange={value => handleFilterChange('category_name', value)} options={categoryOptions} searchable />
                        <Input type="date" label="From" value={filters.start_date} onChange={e => handleFilterChange('start_date', e.target.value)} />
                        <Input type="date" label="To" value={filters.end_date} onChange={e => handleFilterChange('end_date', e.target.value)} />
                    </div>
                    <div className="flex justify-end"><Button variant="ghost" size="sm" onClick={() => setFilters(initialFilters)}>Clear Filters</Button></div>
                </div>

                <CourseRequestTable
                    requests={requests}
                    isLoading={isLoading}
                    onView={(id) => navigate(`/course-requests/details/${id}`)}
                    onClose={handleCloseRequest}
                />

                <Pagination meta={pagination} onPageChange={setCurrentPage} />
                <ConfirmationModal isOpen={confirmationModal.isOpen} {...confirmationModal} onCancel={() => setConfirmationModal({ isOpen: false })} />
            </div>
        </DashboardLayout>
    );
};

export default CourseRequestsDashboard;