import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../components/ui/DashboardLayout.jsx";
import Button from "../../../components/ui/Button.jsx";
import ConfirmationModal from "../../../components/ui/ConfirmationModal.jsx";
import AdminTable from './components/AdminTable';
import { getAdmins, deleteAdmin } from '../../../api/adminService';

const AdminsDashboard = () => {
    const navigate = useNavigate();
    const [admins, setAdmins] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [confirmationModal, setConfirmationModal] = useState({ isOpen: false });

    const fetchAdmins = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getAdmins();
            if (response.success) {
                setAdmins(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch admins", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAdmins();
    }, [fetchAdmins]);

    const showNotification = (message, type = 'success') => { /* ... */ };

    const handleDelete = (admin) => {
        setConfirmationModal({
            isOpen: true,
            type: 'delete',
            title: 'Delete Admin',
            message: `Are you sure you want to delete the admin "${admin.name}"?`,
            onConfirm: async () => {
                try {
                    await deleteAdmin(admin.id);
                    showNotification('Admin deleted successfully.', 'success');
                    fetchAdmins();
                } catch (error) {
                    showNotification('Failed to delete admin.', 'error');
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
                        <h1 className="text-3xl font-bold">Admins Management</h1>
                        <p className="text-muted-foreground mt-1">Manage platform administrators and their roles.</p>
                    </div>
                    <Button onClick={() => navigate('/admins/details/new')} iconName="Plus">
                        Add New Admin
                    </Button>
                </div>

                <AdminTable
                    admins={admins}
                    isLoading={isLoading}
                    onDelete={handleDelete}
                    onEdit={(id) => navigate(`/admins/details/${id}?mode=edit`)}
                    onView={(id) => navigate(`/admins/details/${id}`)}
                />

                <ConfirmationModal isOpen={confirmationModal.isOpen} {...confirmationModal} onCancel={() => setConfirmationModal({ isOpen: false })} />
            </div>
        </DashboardLayout>
    );
};

export default AdminsDashboard;