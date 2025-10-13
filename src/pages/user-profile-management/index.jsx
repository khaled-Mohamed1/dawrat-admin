import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/ui/DashboardLayout';
import Button from '../../components/ui/Button';


import Icon from '../../components/AppIcon';
import ProfileHeader from './components/ProfileHeader';
import PersonalInfoSection from './components/PersonalInfoSection';
import AccountSettingsSection from './components/AccountSettingsSection';
import RolesPermissionsSection from './components/RolesPermissionsSection';
import AccountStatusSection from './components/AccountStatusSection';
import ActivityTimelineSection from './components/ActivityTimelineSection';
import ConfirmationModal from './components/ConfirmationModal';

// Mock user data (in real app, this would come from API)
const mockUsers = [
    {
        id: 1,
        firstName: 'Ahmed',
        lastName: 'Hassan',
        fullName: 'Ahmed Hassan',
        email: 'ahmed.hassan@example.com',
        phone: '+971501234567',
        userType: 'Student',
        country: 'UAE',
        roles: ['Student'],
        status: 'Active',
        lastLoginAt: '2025-01-02 14:30:00',
        registrationDate: '2024-12-15',
        deletedDate: null,
        avatar: null,
        twoFactorEnabled: false,
        emailVerified: true,
        phoneVerified: true
    },
    {
        id: 2,
        firstName: 'Sarah',
        lastName: 'Mohammed',
        fullName: 'Sarah Mohammed',
        email: 'sarah.mohammed@example.com',
        phone: '+966501234567',
        userType: 'Trainer',
        country: 'Saudi Arabia',
        roles: ['Trainer'],
        status: 'Active',
        lastLoginAt: '2025-01-03 09:15:00',
        registrationDate: '2024-11-20',
        deletedDate: null,
        avatar: null,
        twoFactorEnabled: true,
        emailVerified: true,
        phoneVerified: true
    }
];

// Mock activity data
const mockActivities = [
    {
        id: 1,
        type: 'login',
        description: 'User logged in from Dubai, UAE',
        timestamp: '2025-01-03 14:30:00',
        ipAddress: '192.168.1.100',
        userAgent: 'Chrome 120.0'
    },
    {
        id: 2,
        type: 'profile_update',
        description: 'Updated phone number',
        timestamp: '2025-01-02 16:45:00',
        adminUser: 'Admin User',
        details: 'Phone changed from +971501234566 to +971501234567'
    },
    {
        id: 3,
        type: 'status_change',
        description: 'Account status changed to Active',
        timestamp: '2024-12-28 10:20:00',
        adminUser: 'System Admin',
        details: 'Account activated after verification'
    }
];

const UserProfileManagement = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const userId = searchParams?.get('id');
    const mode = searchParams?.get('mode') || 'view';

    const [user, setUser] = useState(null);
    const [activities, setActivities] = useState([]);
    const [isEditing, setIsEditing] = useState(mode === 'edit');
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [activeSection, setActiveSection] = useState('personal');
    const [formData, setFormData] = useState({});
    const [confirmationModal, setConfirmationModal] = useState({
        isOpen: false,
        type: '',
        title: '',
        message: '',
        onConfirm: null
    });

    useEffect(() => {
        // Load user data (in real app, fetch from API)
        const foundUser = mockUsers?.find(u => u?.id === parseInt(userId));
        if (foundUser) {
            setUser(foundUser);
            setFormData(foundUser);
            setActivities(mockActivities);
        } else {
            // Redirect to users list if user not found
            navigate('/all-users-dashboard');
        }
    }, [userId, navigate]);

    const handleFieldChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        setHasUnsavedChanges(true);
    };

    const handleSave = () => {
        setConfirmationModal({
            isOpen: true,
            type: 'save-changes',
            title: 'Save Changes',
            message: 'Are you sure you want to save these changes? The user will be notified of any sensitive information updates via email.',
            onConfirm: () => {
                // Update user data
                setUser(formData);
                setHasUnsavedChanges(false);
                setConfirmationModal({ isOpen: false });

                // Add activity record
                const newActivity = {
                    id: activities?.length + 1,
                    type: 'profile_update',
                    description: 'Profile information updated',
                    timestamp: new Date()?.toISOString()?.replace('T', ' ')?.slice(0, 19),
                    adminUser: 'Current Admin',
                    details: 'Multiple fields updated'
                };
                setActivities(prev => [newActivity, ...prev]);

                // TODO: Send API request to update user
                // TODO: Send email notification to user if sensitive data changed
            }
        });
    };

    const handleCancel = () => {
        if (hasUnsavedChanges) {
            setConfirmationModal({
                isOpen: true,
                type: 'discard-changes',
                title: 'Discard Changes',
                message: 'Are you sure you want to discard your changes? All unsaved modifications will be lost.',
                onConfirm: () => {
                    setFormData(user);
                    setHasUnsavedChanges(false);
                    setIsEditing(false);
                    setConfirmationModal({ isOpen: false });
                }
            });
        } else {
            setIsEditing(false);
        }
    };

    const handleResetPassword = () => {
        setConfirmationModal({
            isOpen: true,
            type: 'reset-password',
            title: 'Reset Password',
            message: `Are you sure you want to reset the password for ${user?.fullName}? A new password will be generated and sent to their email address.`,
            onConfirm: () => {
                setConfirmationModal({ isOpen: false });

                // Add activity record
                const newActivity = {
                    id: activities?.length + 1,
                    type: 'password_reset',
                    description: 'Password reset by admin',
                    timestamp: new Date()?.toISOString()?.replace('T', ' ')?.slice(0, 19),
                    adminUser: 'Current Admin',
                    details: 'New password sent to user email'
                };
                setActivities(prev => [newActivity, ...prev]);

                // TODO: API call to reset password
                // TODO: Send email with new password
            }
        });
    };

    const handleStatusChange = (newStatus) => {
        const statusAction = newStatus === 'Active' ? 'activate' : 'deactivate';
        setConfirmationModal({
            isOpen: true,
            type: 'status-change',
            title: `${statusAction?.charAt(0)?.toUpperCase() + statusAction?.slice(1)} User`,
            message: `Are you sure you want to ${statusAction} ${user?.fullName}? ${
                newStatus === 'Inactive' ?'The user will not be able to log in and all related actions will be inactive automatically.' :'The user will be able to log in and access their account.'
            }`,
            onConfirm: () => {
                setUser(prev => ({ ...prev, status: newStatus }));
                setFormData(prev => ({ ...prev, status: newStatus }));
                setConfirmationModal({ isOpen: false });

                // Add activity record
                const newActivity = {
                    id: activities?.length + 1,
                    type: 'status_change',
                    description: `Account status changed to ${newStatus}`,
                    timestamp: new Date()?.toISOString()?.replace('T', ' ')?.slice(0, 19),
                    adminUser: 'Current Admin',
                    details: `Status changed from ${user?.status} to ${newStatus}`
                };
                setActivities(prev => [newActivity, ...prev]);

                // TODO: API call to update status
                // TODO: Send email notification to user
            }
        });
    };

    const handleDeleteAccount = () => {
        setConfirmationModal({
            isOpen: true,
            type: 'delete-account',
            title: 'Delete User Account',
            message: `Are you sure you want to delete ${user?.fullName}'s account? This action will:\n\n• Disable login immediately\n• Revoke all sessions and tokens\n• Mask personal information\n• Schedule deletion in 90 days\n• Allow restoration within 90 days\n\nThe user will receive a deletion confirmation email.`,
            onConfirm: () => {
                // Soft delete - update status and set deletion date
                const deletionDate = new Date();
                deletionDate?.setDate(deletionDate?.getDate() + 90);

                setUser(prev => ({
                    ...prev,
                    status: 'Deleted',
                    deletedDate: deletionDate?.toISOString()?.split('T')?.[0]
                }));
                setFormData(prev => ({
                    ...prev,
                    status: 'Deleted',
                    deletedDate: deletionDate?.toISOString()?.split('T')?.[0]
                }));
                setConfirmationModal({ isOpen: false });

                // Add activity record
                const newActivity = {
                    id: activities?.length + 1,
                    type: 'account_deletion',
                    description: 'Account scheduled for deletion',
                    timestamp: new Date()?.toISOString()?.replace('T', ' ')?.slice(0, 19),
                    adminUser: 'Current Admin',
                    details: `Account will be permanently deleted on ${deletionDate?.toLocaleDateString()}`
                };
                setActivities(prev => [newActivity, ...prev]);

                // TODO: API call to soft delete account
                // TODO: Send deletion confirmation email
            }
        });
    };

    const handleRoleUpdate = (newRoles) => {
        setFormData(prev => ({ ...prev, roles: newRoles }));
        setHasUnsavedChanges(true);
    };

    if (!user) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-96">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                            <Icon name="User" size={32} className="text-muted-foreground" />
                        </div>
                        <h2 className="text-xl font-semibold text-foreground mb-2">User Not Found</h2>
                        <p className="text-muted-foreground mb-4">
                            The user you're looking for doesn't exist or has been removed.
                        </p>
                        <Button
                            onClick={() => navigate('/all-users-dashboard')}
                            iconName="ArrowLeft"
                        >
                            Back to Users List
                        </Button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="ghost"
                            iconName="ArrowLeft"
                            onClick={() => navigate('/all-users-dashboard')}
                        >
                            Back to Users
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">User Profile Management</h1>
                            <p className="text-muted-foreground">
                                {isEditing ? 'Edit user information and settings' : 'View user details and manage account'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        {!isEditing ? (
                            <>
                                <Button
                                    variant="outline"
                                    iconName="Key"
                                    onClick={handleResetPassword}
                                >
                                    Reset Password
                                </Button>
                                <Button
                                    iconName="Edit"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Edit User
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    iconName="Save"
                                    onClick={handleSave}
                                    disabled={!hasUnsavedChanges}
                                >
                                    Save Changes
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                {/* Profile Content */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Main Profile Content */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Profile Header */}
                        <ProfileHeader
                            user={formData}
                            isEditing={isEditing}
                            onFieldChange={handleFieldChange}
                        />

                        {/* Section Navigation */}
                        <div className="bg-card rounded-lg border p-1">
                            <div className="flex space-x-1">
                                {[
                                    { id: 'personal', label: 'Personal Info', icon: 'User' },
                                    { id: 'account', label: 'Account Settings', icon: 'Settings' },
                                    { id: 'roles', label: 'Roles & Permissions', icon: 'Shield' },
                                    { id: 'status', label: 'Account Status', icon: 'Activity' }
                                ]?.map((section) => (
                                    <button
                                        key={section?.id}
                                        onClick={() => setActiveSection(section?.id)}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                            activeSection === section?.id
                                                ? 'bg-primary text-primary-foreground'
                                                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                        }`}
                                    >
                                        <Icon name={section?.icon} size={16} />
                                        <span>{section?.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Dynamic Sections */}
                        {activeSection === 'personal' && (
                            <PersonalInfoSection
                                user={formData}
                                isEditing={isEditing}
                                onFieldChange={handleFieldChange}
                            />
                        )}

                        {activeSection === 'account' && (
                            <AccountSettingsSection
                                user={formData}
                                isEditing={isEditing}
                                onFieldChange={handleFieldChange}
                                onResetPassword={handleResetPassword}
                            />
                        )}

                        {activeSection === 'roles' && (
                            <RolesPermissionsSection
                                user={formData}
                                isEditing={isEditing}
                                onRoleUpdate={handleRoleUpdate}
                            />
                        )}

                        {activeSection === 'status' && (
                            <AccountStatusSection
                                user={formData}
                                isEditing={isEditing}
                                onStatusChange={handleStatusChange}
                                onDeleteAccount={handleDeleteAccount}
                            />
                        )}
                    </div>

                    {/* Activity Timeline Sidebar */}
                    <div className="lg:col-span-1">
                        <ActivityTimelineSection activities={activities} />
                    </div>
                </div>

                {/* Confirmation Modal */}
                <ConfirmationModal
                    isOpen={confirmationModal?.isOpen}
                    title={confirmationModal?.title}
                    message={confirmationModal?.message}
                    type={confirmationModal?.type}
                    onConfirm={confirmationModal?.onConfirm}
                    onCancel={() => setConfirmationModal({ isOpen: false })}
                />
            </div>
        </DashboardLayout>
    );
};

export default UserProfileManagement;