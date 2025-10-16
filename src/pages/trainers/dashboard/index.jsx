import React, {useCallback, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import DashboardLayout from "../../../components/ui/DashboardLayout.jsx";
import Input from "../../../components/ui/Input.jsx";
import {useDebounce} from "../../../hooks/useDebounce.js";
import Pagination from "../../../components/ui/Pagination.jsx";
import ConfirmationModal from "../../../components/ui/ConfirmationModal.jsx";
import { getTrainers, exportTrainers, changeTrainerStatus, deleteTrainer } from '../../../api/trainerService';
import TrainerTable from "./components/TrainerTable.jsx";
import FilterPanel from './components/FilterPanel';
import Select from "../../../components/ui/Select.jsx";
import Button from "../../../components/ui/Button.jsx";
import ResetPasswordModal from './components/ResetPasswordModal.jsx';

const TrainerDashboard = () => {
    const navigate = useNavigate();
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [confirmationModal, setConfirmationModal] = useState({ isOpen: false });
    const [resetModalState, setResetModalState] = useState({ isOpen: false, trainer: null });

    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    // --- All Filter States ---
    const [filters, setFilters] = useState({
        search: '', status: 'all', start_date: '', end_date: '', course_count_min: '',
        avg_rating_min: '', center_id: 'all', country_id: 'all', job_title: ''
    });

    const [currentPage, setCurrentPage] = useState(1);
    const debouncedSearch = useDebounce(filters.search, 500);
    // API Data State
    const [trainers, setTrainers] = useState([]);
    const [pagination, setPagination] = useState(null);

    const [isExporting, setIsExporting] = useState(false);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: '', type: '' }), 5000);
    };

    const fetchTrainers = useCallback(async () => {
        setIsLoading(true);
        try {
            const activeFilters = { ...filters, search: debouncedSearch, page: currentPage };
            Object.keys(activeFilters).forEach(key => {
                if (activeFilters[key] === '' || activeFilters[key] === 'all') {
                    delete activeFilters[key];
                }
            });

            const response = await getTrainers(activeFilters);
            if (response.success) {
                setTrainers(response.data);
                setPagination(response.meta);
            }
        } catch (error) {
            console.error("Failed to fetch trainers", error);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, debouncedSearch, filters]);

    useEffect(() => {
        fetchTrainers();
    }, [fetchTrainers]);


    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
        setCurrentPage(1);
    };

    const handleApplyAdvancedFilters = (advancedFilters) => {
        setFilters(prev => ({ ...prev, ...advancedFilters }));
        setCurrentPage(1);
    };

    const clearAllFilters = () => {
        setFilters({
            search: '', status: 'all', start_date: '', end_date: '', course_count_min: '',
            avg_rating_min: '', center_id: 'all', country_id: 'all', job_title: ''
        });
        setCurrentPage(1);
    };

    // --- Placeholder Handlers for Table Actions ---
    const handleViewDetails = (trainerId) => navigate(`/trainers/details/${trainerId}`);
    const handleEditTrainer = (trainerId) => navigate(`/trainers/details/${trainerId}?mode=edit`);
    const handleStatusChange = (trainer) => {
        const newStatus = trainer.status === 1 ? 0 : 1;
        const actionText = newStatus === 1 ? 'activate' : 'deactivate';

        setConfirmationModal({
            isOpen: true,
            type: 'status-change',
            title: `${actionText.charAt(0).toUpperCase() + actionText.slice(1)} Trainer`,
            message: `Are you sure you want to ${actionText} "${trainer.name}"?`,
            onConfirm: async () => {
                try {
                    const response = await changeTrainerStatus(trainer.id, { status: newStatus });
                    showNotification(response.message || `Trainer status updated successfully.`, 'success');
                    fetchTrainers();
                } catch (error) {
                    showNotification(error.message || 'Failed to update status.', 'error');
                } finally {
                    setConfirmationModal({ isOpen: false });
                }
            }
        });
    };

    const handleDeleteTrainer = (trainer) => {
        setConfirmationModal({
            isOpen: true,
            type: 'delete',
            title: 'Delete Trainer',
            message: `Are you sure you want to permanently delete "${trainer.name}"? This action cannot be undone.`,
            onConfirm: async () => {
                try {
                    const response = await deleteTrainer(trainer.id);
                    showNotification(response.message || 'Trainer deleted successfully.', 'success');
                    if (trainers.length === 1 && currentPage > 1) {
                        setCurrentPage(prev => prev - 1);
                    } else {
                        fetchTrainers();
                    }
                } catch (error) {
                    showNotification(error.message || 'Failed to delete trainer.', 'error');
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

            await exportTrainers(activeFilters);
            showNotification('Trainer data is being downloaded.', 'success');
        } catch (error) {
            console.error("Export failed:", error);
            showNotification('Failed to export data. Please try again.', 'error');
        } finally {
            setIsExporting(false);
        }
    };

    const handleResetPassword = (trainer) => {
        setResetModalState({ isOpen: true, trainer });
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {notification.message && (
                    <div className={`p-4 rounded-md text-sm ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {notification.message}
                    </div>
                )}

                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Trainers Management</h1>
                        <p className="text-muted-foreground mt-1">
                            Manage and oversee all trainer accounts
                        </p>
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

                <div className="bg-card rounded-lg border p-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1">
                            <Input
                                placeholder="Search by name, email, or phone..."
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                className="flex-1"
                            />
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Select
                                value={filters.status}
                                onChange={(value) => handleFilterChange('status', value)}
                                options={[
                                    { label: 'All Status', value: 'all' },
                                    { label: 'Active', value: '1' },
                                    { label: 'Inactive', value: '0' }
                                ]}
                                className="w-32"
                            />
                            <Button variant="outline" iconName="Filter" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
                                Filters
                            </Button>
                            <Button variant="ghost" iconName="X" onClick={clearAllFilters}>
                                Clear
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Advanced Filters Panel */}
                {showAdvancedFilters && (
                    <FilterPanel
                        initialFilters={filters}
                        onApplyFilters={handleApplyAdvancedFilters}
                        onClearFilters={(cleared) => setFilters(prev => ({...prev, ...cleared}))}
                    />
                )}


                {/* Trainers Table */}
                <TrainerTable
                    trainers={trainers}
                    isLoading={isLoading}
                    onStatusChange={handleStatusChange}
                    onViewDetails={handleViewDetails}
                    onEditTrainer={handleEditTrainer}
                    onDeleteTrainer={handleDeleteTrainer}
                    onResetPassword={handleResetPassword}
                />

                {/* Pagination */}
                <Pagination meta={pagination} onPageChange={setCurrentPage} />

                <ConfirmationModal
                    isOpen={confirmationModal?.isOpen}
                    type={confirmationModal?.type}
                    title={confirmationModal?.title}
                    message={confirmationModal?.message}
                    onConfirm={confirmationModal?.onConfirm}
                    onCancel={() => setConfirmationModal({ isOpen: false })}
                />

                <ResetPasswordModal
                    isOpen={resetModalState.isOpen}
                    trainer={resetModalState.trainer}
                    onClose={() => setResetModalState({ isOpen: false, trainer: null })}
                    onSuccess={(message) => showNotification(message, 'success')}
                />
            </div>
        </DashboardLayout>
    )
}

export default TrainerDashboard;
