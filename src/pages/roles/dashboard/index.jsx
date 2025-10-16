import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../components/ui/DashboardLayout.jsx";
import Button from "../../../components/ui/Button.jsx";
import ConfirmationModal from "../../../components/ui/ConfirmationModal.jsx";
import RoleTable from './components/RoleTable';
import { getRoles, deleteRole } from '../../../api/roleService';

const RolesDashboard = () => {
    const navigate = useNavigate();
    const [roles, setRoles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [confirmationModal, setConfirmationModal] = useState({ isOpen: false });

    const fetchRoles = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getRoles();
            if (response.success) {
                setRoles(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch roles", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRoles();
    }, [fetchRoles]);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: '', type: '' }), 5000);
    };

    const handleDeleteRole = (role) => {
        setConfirmationModal({
            isOpen: true,
            type: 'delete',
            title: 'Delete Role',
            message: `Are you sure you want to delete the "${role.name}" role? This may affect users assigned to this role.`,
            onConfirm: async () => {
                try {
                    const response = await deleteRole(role.id);
                    showNotification(response.message || 'Role deleted successfully.', 'success');
                    fetchRoles(); // Refresh the list
                } catch (error) {
                    showNotification(error.message || 'Failed to delete role.', 'error');
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
                        <h1 className="text-3xl font-bold">Roles Management</h1>
                        <p className="text-muted-foreground mt-1">Define user roles and permissions.</p>
                    </div>
                    <Button onClick={() => navigate('/roles/details/new')} iconName="Plus">
                        Add New Role
                    </Button>
                </div>
                <RoleTable
                    roles={roles}
                    isLoading={isLoading}
                    onDelete={handleDeleteRole}
                    onEdit={(roleId) => navigate(`/roles/details/${roleId}?mode=edit`)}
                    onView={(roleId) => navigate(`/roles/details/${roleId}`)}
                />
                <ConfirmationModal isOpen={confirmationModal.isOpen} {...confirmationModal} onCancel={() => setConfirmationModal({ isOpen: false })} />
            </div>
        </DashboardLayout>
    );
};

export default RolesDashboard;