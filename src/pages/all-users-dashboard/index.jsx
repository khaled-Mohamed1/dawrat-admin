import React, { useState, useEffect, useCallback  } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/ui/DashboardLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Icon from '../../components/AppIcon';
import UserTable from './components/UserTable';
import FilterPanel from './components/FilterPanel';
import ConfirmationModal from './components/ConfirmationModal';
import BulkActionsToolbar from './components/BulkActionsToolbar';

import { getKpiStats } from '../../api/dashboardService';
import { useDebounce } from '../../hooks/useDebounce';
import Pagination from '../../components/ui/Pagination';
import { getUsers, toggleUserStatus, deleteUser  } from '../../api/userService';
import ResetPasswordModal from './components/ResetPasswordModal';

const AllUsersDashboard = () => {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [kpiStats, setKpiStats] = useState(null);
    const [pagination, setPagination] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingStats, setIsLoadingStats] = useState(true);

    // Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState(null);
    const [roleFilter, setRoleFilter] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    // UI State
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
    const [confirmationModal, setConfirmationModal] = useState({ isOpen: false, user: null, onConfirm: null });
    const [resetModalState, setResetModalState] = useState({ isOpen: false, user: null });
    const [notification, setNotification] = useState({ message: '', type: '' });

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        // Hide notification after 5 seconds
        setTimeout(() => setNotification({ message: '', type: '' }), 5000);
    };

    // **UPDATED**: This function now opens our new, specialized modal
    const handleResetPassword = (user) => {
        setResetModalState({ isOpen: true, user });
    };

    const refreshUsers = () => {
        fetchUsers();
    };

    // Advanced filters state
    const [advancedFilters, setAdvancedFilters] = useState({
        country: 'all',
        registrationDateFrom: '',
        registrationDateTo: '',
        lastLoginFrom: '',
        lastLoginTo: ''
    });

    // Debounce the search query to avoid excessive API calls
    const debouncedSearch = useDebounce(searchQuery, 500);

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getUsers({
                page: currentPage,
                status: statusFilter,
                role: roleFilter,
                search: debouncedSearch,
            });
            if (response.success) {
                setUsers(response.data);
                setPagination(response.meta);
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, statusFilter, roleFilter, debouncedSearch]);

    // Effect to fetch users when filters or page change
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Effect for fetching KPI stats (runs only once)
    useEffect(() => {
        getKpiStats().then(res => {
            if (res.success) setKpiStats(res.data);
        });
    }, []);

    const handleSearchChange = (e) => {
        setSearchQuery(e?.target?.value);
    };

    const handleStatusFilterChange = (value) => {
        setStatusFilter(value);
    };

    const handleRoleFilterChange = (value) => {
        setRoleFilter(value);
    };

    const handleUserSelection = (userId, isSelected) => {
        if (isSelected) {
            setSelectedUsers(prev => [...prev, userId]);
        } else {
            setSelectedUsers(prev => prev.filter(id => id !== userId));
        }
    };

    const handleSelectAllUsers = (isSelected) => {
        if (isSelected) {
            setSelectedUsers(users?.map(user => user?.id));
        } else {
            setSelectedUsers([]);
        }
    };

    const handleViewUser = (userId) => {
        navigate(`/user-profile-management?id=${userId}&mode=view`);
    };

    const handleEditUser = (userId) => {
        navigate(`/user-profile-management?id=${userId}&mode=edit`);
    };

    const handleToggleUserStatus = (user) => {
        const isActivating = user.status.toLowerCase() !== 'active';
        const actionText = isActivating ? 'activate' : 'deactivate';

        // The function that will be called when the user confirms the action
        const performToggle = async (force = false) => {
            try {
                // Show loading state in modal if possible, or on the page
                const response = await toggleUserStatus(user.id, force);

                // If successful, close modal, show success, and refresh the user list
                setConfirmationModal({ isOpen: false });
                showNotification(response.message || `User has been ${actionText}d.`, 'success');
                refreshUsers();

            } catch (error) {
                // This is the key part: check if the API returned a warning
                // (Assuming a 409 Conflict status code for warnings, adjust if needed)
                if (error?.status === 409) {
                    // It's a warning, so we update the modal for a second confirmation
                    setConfirmationModal({
                        isOpen: true,
                        type: 'warning', // Use a different type for styling
                        title: `Warning: Force ${actionText.charAt(0).toUpperCase() + actionText.slice(1)}?`,
                        // Show the warning message from the API
                        message: error.data.data,
                        // The new confirm action will call this function again with force=true
                        onConfirm: () => performToggle(true),
                        user,
                    });
                } else {
                    // It's a different error, so show a generic error message
                    setConfirmationModal({ isOpen: false });
                    showNotification(error?.data?.message || 'An unexpected error occurred.', 'error');
                }
            }
        };

        // --- Initial Modal Setup ---
        // This is what happens when the user first clicks the button
        setConfirmationModal({
            isOpen: true,
            type: 'status-change',
            title: `${isActivating ? 'Activate' : 'Deactivate'} User`,
            message: `Are you sure you want to ${actionText} ${user.full_name}?`,
            // The first confirm action calls our handler with force=false
            onConfirm: () => performToggle(false),
            user,
        });
    };

const handleDeleteUser = (user) => {
        // This function will be called when the user confirms the action
        const performDelete = async () => {
            try {
                const response = await deleteUser(user.id);

                // If successful, close modal, show success, and refresh the list
                setConfirmationModal({ isOpen: false });
                showNotification(response.message, 'success');
                refreshUsers();


            } catch (error) {
                // Check for the specific 422 error with blocking issues
                if (error?.status) {
                    const blockingIssues = error?.data?.data;

                    // Construct a message with a list of the blocking issues
                    const warningMessage = (
                        <>
                            {error.data.message}
                            <ul className="list-disc list-inside mt-2 text-sm text-left text-red-800">
                                {blockingIssues.map((issue, index) => <li key={index}>{issue}</li>)}
                            </ul>
                        </>
                    );

                    // Update the modal to show the warning
                    setConfirmationModal({
                        isOpen: true,
                        type: 'warning', // A special type for styling
                        title: 'Deletion Blocked',
                        message: warningMessage,
                        onConfirm: null, // No "Confirm" button needed on a warning
                        user,
                    });
                } else {
                    // Handle other, unexpected errors
                    setConfirmationModal({ isOpen: false });
                    showNotification(error?.data?.message || 'An unexpected error occurred.', 'error');
                }
            }
        };

        // --- Initial Modal Setup ---
        // This sets up the first, simple confirmation modal
        setConfirmationModal({
            isOpen: true,
            type: 'delete-user',
            title: 'Delete User Account',
            message: `Are you sure you want to delete ${user.full_name}? The user will be scheduled for permanent deletion in 90 days.`,
            onConfirm: performDelete, // The confirm button will trigger our API call
            user,
        });
    };

    const handleBulkAction = (action) => {
        const selectedUsersList = users?.filter(user => selectedUsers?.includes(user?.id));

        switch (action) {
            case 'activate':
                setUsers(prev =>
                    prev?.map(user =>
                        selectedUsers?.includes(user?.id)
                            ? { ...user, status: 'Active' }
                            : user
                    )
                );
                break;
            case 'deactivate':
                setUsers(prev =>
                    prev?.map(user =>
                        selectedUsers?.includes(user?.id)
                            ? { ...user, status: 'Inactive' }
                            : user
                    )
                );
                break;
            case 'delete':
                setUsers(prev =>
                    prev?.filter(user => !selectedUsers?.includes(user?.id))
                );
                break;
            default:
                break;
        }

        setSelectedUsers([]);
    };

    const resetFilters = () => {
        setSearchQuery('');
        setStatusFilter(null);
        setRoleFilter(null);
        setCurrentPage(1);
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setIsLoadingStats(true);
                const response = await getKpiStats();
                if (response.success) {
                    setKpiStats(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch KPI stats", error);
            } finally {
                setIsLoadingStats(false);
            }
        };
        fetchStats();
    }, []);

    const statusOptions = [
        { label: 'All Status', value: null },
        { label: 'Active', value: 'Active' },
        { label: 'Inactive', value: 'Inactive' },
        { label: 'Deleted', value: 'Deleted' },
    ];

    const roleOptions = [
        { label: 'All Roles', value: null },
        { label: 'Student', value: 'student' },
        { label: 'Trainer', value: 'trainer' },
        { label: 'Center Admin', value: 'center' },
        { label: 'Admin', value: 'admin' },
        { label: 'Super Admin', value: 'super_admin' },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">All Users Dashboard</h1>
                        <p className="text-muted-foreground mt-1">
                            Manage all users including Students, Trainers, Center Admins, and Admins
                        </p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Total Users Card */}
                    <div className="bg-card rounded-lg border p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                                <p className="text-2xl font-bold text-foreground">
                                    {isLoadingStats ? '...' : kpiStats?.all_users || 0}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                <Icon name="Users" size={24} className="text-primary" />
                            </div>
                        </div>
                    </div>

                    {/* Students Card */}
                    <div className="bg-card rounded-lg border p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Students</p>
                                <p className="text-2xl font-bold text-foreground">
                                    {isLoadingStats ? '...' : kpiStats?.students || 0}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Icon name="GraduationCap" size={24} className="text-blue-600" />
                            </div>
                        </div>
                    </div>

                    {/* Trainers Card */}
                    <div className="bg-card rounded-lg border p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Trainers</p>
                                <p className="text-2xl font-bold text-foreground">
                                    {isLoadingStats ? '...' : kpiStats?.trainers || 0}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Icon name="BookOpen" size={24} className="text-purple-600" />
                            </div>
                        </div>
                    </div>

                    {/* Centers Card (Replaced Active Users) */}
                    <div className="bg-card rounded-lg border p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Centers</p>
                                <p className="text-2xl font-bold text-foreground">
                                    {isLoadingStats ? '...' : kpiStats?.centers || 0}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                <Icon name="Building" size={24} className="text-orange-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-card rounded-lg border p-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1">
                            <Input
                                type="text"
                                placeholder="Search by name, email, or phone..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Quick Filters */}
                        <div className="flex flex-wrap gap-3">
                            <Select
                                value={statusFilter}
                                onChange={(value) => { setStatusFilter(value); setCurrentPage(1); }}
                                options={statusOptions} // Use the options prop
                                className="w-32"
                            />

                            <Select
                                value={roleFilter}
                                onChange={(value) => { setRoleFilter(value); setCurrentPage(1); }}
                                options={roleOptions} // Use the options prop
                                className="w-36"
                            />

                            <Button variant="ghost" iconName="X" onClick={resetFilters}>
                                Clear
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Results Info */}


                {/* Bulk Actions Toolbar */}
                {selectedUsers.length > 0 && (
                    <BulkActionsToolbar
                        selectedCount={selectedUsers.length}
                        onClearSelection={() => setSelectedUsers([])}
                        // onBulkAction={handleBulkAction}
                    />
                )}

                {notification.message && (
                    <div className={`p-4 rounded-md text-sm ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {notification.message}
                    </div>
                )}

                {/* Users Table */}
                <UserTable
                    users={users}
                    isLoading={isLoading}
                    selectedUsers={selectedUsers}
                    onUserSelection={handleUserSelection}
                    onSelectAll={handleSelectAllUsers}
                    onViewUser={handleViewUser}
                    onEditUser={handleEditUser}
                    onToggleStatus={handleToggleUserStatus}
                    onResetPassword={handleResetPassword}
                    onDeleteUser={handleDeleteUser}
                />

                {/* Filter Panel */}
                <FilterPanel
                    isOpen={isFilterPanelOpen}
                    onClose={() => setIsFilterPanelOpen(false)}
                    filters={advancedFilters}
                    onFiltersChange={setAdvancedFilters}
                />

                {/* Confirmation Modal */}
                <ConfirmationModal
                    isOpen={confirmationModal?.isOpen}
                    title={confirmationModal?.title}
                    message={confirmationModal?.message}
                    type={confirmationModal?.type}
                    onConfirm={confirmationModal?.onConfirm}
                    onCancel={() => setConfirmationModal({ isOpen: false })}
                />

                <ResetPasswordModal
                    isOpen={resetModalState.isOpen}
                    user={resetModalState.user}
                    onClose={() => setResetModalState({ isOpen: false, user: null })}
                    onSuccess={(message) => showNotification(message, 'success')}
                />

                <Pagination meta={pagination} onPageChange={setCurrentPage} />
            </div>
        </DashboardLayout>
    );
};

export default AllUsersDashboard;