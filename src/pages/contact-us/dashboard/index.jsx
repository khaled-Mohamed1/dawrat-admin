import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../components/ui/DashboardLayout.jsx";
import Button from "../../../components/ui/Button.jsx";
import Pagination from "../../../components/ui/Pagination.jsx";
import ConfirmationModal from "../../../components/ui/ConfirmationModal.jsx";
import ContactUsTable from './components/ContactUsTable';
import { getContactSubmissions, deleteContactSubmission } from '../../../api/contactUsService';

const ContactUsDashboard = () => {
    const navigate = useNavigate();
    const [submissions, setSubmissions] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [confirmationModal, setConfirmationModal] = useState({ isOpen: false });
    const [currentPage, setCurrentPage] = useState(1);

    const fetchSubmissions = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getContactSubmissions({ page: currentPage });
            if (response.success) {
                setSubmissions(response.data);
                setPagination(response.meta);
            }
        } catch (error) {
            console.error("Failed to fetch submissions", error);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage]);

    useEffect(() => {
        fetchSubmissions();
    }, [fetchSubmissions]);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: '', type: '' }), 5000);
    };

    const handleDelete = (submission) => {
        setConfirmationModal({
            isOpen: true,
            type: 'delete',
            title: 'Delete Message',
            message: `Are you sure you want to delete this message from "${submission.user.name}"?`,
            onConfirm: async () => {
                try {
                    await deleteContactSubmission(submission.id);
                    showNotification('Message deleted successfully.', 'success');
                    fetchSubmissions();
                } catch (error) {
                    showNotification('Failed to delete message.', 'error');
                } finally {
                    setConfirmationModal({ isOpen: false });
                }
            }
        });
    };

    const handleViewDetails = (id) => navigate(`/contact-us/details/${id}`);


    return (
        <DashboardLayout>
            <div className="space-y-6">
                {notification.message && (
                    <div className={`p-4 rounded-md text-sm ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {notification.message}
                    </div>
                )}

                <div>
                    <h1 className="text-3xl font-bold">Contact Us Messages</h1>
                    <p className="text-muted-foreground mt-1">View and manage messages from users.</p>
                </div>

                <ContactUsTable
                    submissions={submissions}
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

export default ContactUsDashboard;