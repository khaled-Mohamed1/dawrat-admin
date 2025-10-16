import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../components/ui/DashboardLayout.jsx";
import Input from "../../../components/ui/Input.jsx";
import Select from "../../../components/ui/Select.jsx";
import Button from "../../../components/ui/Button.jsx";
import { useDebounce } from "../../../hooks/useDebounce.js";
import Pagination from "../../../components/ui/Pagination.jsx";
import ConfirmationModal from "../../../components/ui/ConfirmationModal.jsx";
import JobTable from './components/JobTable';
import { getJobs, deleteJob, changeJobStatus } from '../../../api/jobService';

const JobsDashboard = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [confirmationModal, setConfirmationModal] = useState({ isOpen: false });
    const [currentPage, setCurrentPage] = useState(1);
    const initialFilters = { search: '', status: 'all' };
    const [filters, setFilters] = useState(initialFilters);
    const debouncedSearch = useDebounce(filters.search, 500);

    const fetchJobs = useCallback(async () => {
        setIsLoading(true);
        try {
            const activeFilters = { ...filters, search: debouncedSearch, page: currentPage };
            if (activeFilters.status === 'all') delete activeFilters.status;

            const response = await getJobs(activeFilters);
            if (response.success) {
                setJobs(response.data);
                setPagination(response.meta);
            }
        } catch (error) {
            console.error("Failed to fetch jobs", error);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, debouncedSearch, filters.status]);

    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: '', type: '' }), 5000);
    };

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
        setCurrentPage(1);
    };

    const handleDelete = (job) => {
        setConfirmationModal({
            isOpen: true,
            type: 'delete',
            title: 'Delete Job',
            message: `Are you sure you want to delete "${job.name}"?`,
            onConfirm: async () => {
                try {
                    await deleteJob(job.id);
                    showNotification('Job deleted successfully.', 'success');
                    fetchJobs();
                } catch (error) {
                    showNotification('Failed to delete job.', 'error');
                } finally {
                    setConfirmationModal({ isOpen: false });
                }
            }
        });
    };

    const handleStatusChange = (job) => {
        const newStatus = job.status === 1 ? 0 : 1;
        const actionText = newStatus === 1 ? 'activate' : 'deactivate';
        setConfirmationModal({
            isOpen: true,
            type: 'status-change',
            title: `${actionText.charAt(0).toUpperCase() + actionText.slice(1)} Job`,
            message: `Are you sure you want to ${actionText} "${job.name}"?`,
            onConfirm: async () => {
                try {
                    await changeJobStatus(job.id, { status: newStatus });
                    showNotification('Status updated successfully.', 'success');
                    fetchJobs();
                } catch (error) {
                    showNotification('Failed to update status.', 'error');
                } finally {
                    setConfirmationModal({ isOpen: false });
                }
            }
        });
    };

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
                        <h1 className="text-3xl font-bold">Jobs Management</h1>
                        <p className="text-muted-foreground mt-1">Manage job titles for trainers and centers.</p>
                    </div>
                    <Button onClick={() => navigate('/jobs/details/new')} iconName="Plus">
                        Add New Job
                    </Button>
                </div>

                <div className="bg-card rounded-lg border p-4">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <Input placeholder="Search by name..." value={filters.search} onChange={e => handleFilterChange('search', e.target.value)} className="flex-1" />
                        </div>
                        <div className="flex gap-3">
                            <Select value={filters.status} onChange={value => handleFilterChange('status', value)} options={[{label: 'All Statuses', value: 'all'}, {label: 'Active', value: '1'}, {label: 'Inactive', value: '0'}]} className="w-40" />
                            <Button variant="ghost" onClick={() => setFilters(initialFilters)}>Clear</Button>
                        </div>
                    </div>
                </div>

                <JobTable
                    jobs={jobs}
                    isLoading={isLoading}
                    onDelete={handleDelete}
                    onEdit={(id) => navigate(`/jobs/details/${id}?mode=edit`)}
                    onView={(id) => navigate(`/jobs/details/${id}`)}
                    onStatusChange={handleStatusChange}
                />

                <Pagination meta={pagination} onPageChange={setCurrentPage} />
                <ConfirmationModal isOpen={confirmationModal.isOpen} {...confirmationModal} onCancel={() => setConfirmationModal({ isOpen: false })} />
            </div>
        </DashboardLayout>
    );
};

export default JobsDashboard;