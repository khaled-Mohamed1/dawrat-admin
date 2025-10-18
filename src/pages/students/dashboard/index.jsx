import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../components/ui/DashboardLayout';
import Input from '../../../components/ui/Input';
import StudentTable from './components/StudentTable';
import Pagination from '../../../components/ui/Pagination';
import { useDebounce } from '../../../hooks/useDebounce';
import { getStudents } from '../../../api/studentService';
import { toggleUserStatus, deleteUser } from '../../../api/userService';
import ConfirmationModal from '../../../components/ui/ConfirmationModal';
import ResetPasswordModal from './components/ResetPasswordModal.jsx';

const StudentDashboard = () => {
    const navigate = useNavigate();
    
    const [confirmationModal, setConfirmationModal] = useState({ isOpen: false });
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [resetModalState, setResetModalState] = useState({ isOpen: false, student: null });

    // API Data State
    const [students, setStudents] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Filter State
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    
    // Debounce search input to reduce API calls
    const debouncedSearch = useDebounce(searchTerm, 500);

        const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: '', type: '' }), 5000);
    };

    const fetchStudents = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getStudents({
                page: currentPage,
                search: debouncedSearch,
            });
            if (response.success) {
                setStudents(response.data);
                setPagination(response.meta);
            }
        } catch (error) {
            console.error("Failed to fetch students", error);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, debouncedSearch]);

    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    const handleStatusChange = (student) => {
        const isActivating = student.status.toLowerCase() !== 'active';
        const actionText = isActivating ? 'activate' : 'deactivate';

        const performToggle = async (force = false) => {
            try {
                const response = await toggleUserStatus(student.user_id, force);
                setConfirmationModal({ isOpen: false });
                showNotification(response.message || `Student has been ${actionText}d.`, 'success');
                fetchStudents(); // Refresh the list from the server
            } catch (error) {
                // Handle the specific warning case (e.g., status 409)
                if (error?.status === 409 && error?.data?.message) {
                    setConfirmationModal({
                        isOpen: true,
                        type: 'warning',
                        title: `Warning: Force ${actionText.charAt(0).toUpperCase() + actionText.slice(1)}?`,
                        message: error.data.message,
                        onConfirm: () => performToggle(true), // Next confirm will have force=true
                        user: student,
                    });
                } else {
                    setConfirmationModal({ isOpen: false });
                    showNotification(error?.data?.message || 'An unexpected error occurred.', 'error');
                }
            }
        };

        // --- Initial Modal ---
        setConfirmationModal({
            isOpen: true,
            type: 'status-change',
            title: `${isActivating ? 'Activate' : 'Deactivate'} Student`,
            message: `Are you sure you want to ${actionText} ${student.name}?`,
            onConfirm: () => performToggle(false), // First confirm is always force=false
            user: student,
        });
    };

    const handleDeleteStudent = (student) => {
        // This function will be called when the user confirms the action
        const performDelete = async () => {
            try {
                const response = await deleteUser(student.user_id);

                // If successful, close modal, show success, and refresh the list
                setConfirmationModal({ isOpen: false });
                showNotification(response.message, 'success');
                fetchStudents();


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
                        student: student,
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
            message: `Are you sure you want to delete ${student.name}? The user will be scheduled for permanent deletion in 90 days.`,
            onConfirm: performDelete,
            student: student,
        });
    };

    const handleResetPassword = (student) => {
        setResetModalState({ isOpen: true, student });
    };

    const handleViewDetails = (studentId) => {
        navigate(`/student-details/${studentId}`);
    };

    const handleEditStudent = (studentId) => {
        navigate(`/student-details/${studentId}?mode=edit`);
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
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Students Management</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage and oversee all student accounts
                    </p>
                </div>

                {/* Search Bar */}
                <div className="bg-card rounded-lg border border-border p-4">
                    <Input
                        type="text"
                        placeholder="Search by name, email, or phone..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full"
                    />
                </div>
                
                {/* Students Table */}
                <StudentTable
                    students={students}
                    isLoading={isLoading}
                    onStatusChange={handleStatusChange}
                    onViewDetails={handleViewDetails}
                    onEditStudent={handleEditStudent}
                    onDeleteStudent={handleDeleteStudent}
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
                    student={resetModalState.student}
                    onClose={() => setResetModalState({ isOpen: false, student: null })}
                    onSuccess={(message) => showNotification(message, 'success')}
                />
            </div>
        </DashboardLayout>
    );
};

export default StudentDashboard;