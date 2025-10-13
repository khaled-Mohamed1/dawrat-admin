import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { cn } from '../../../utils/cn';

const StatusBadge = ({ status }) => {
    const getStatusConfig = (status) => {
        switch (status?.toLowerCase()) {
            case 'active':
                return {
                    className: 'bg-green-100 text-green-800 border-green-200',
                    icon: 'CheckCircle',
                    label: 'Active'
                };
            case 'inactive':
                return {
                    className: 'bg-red-100 text-red-800 border-red-200',
                    icon: 'XCircle',
                    label: 'Inactive'
                };
            case 'deleted':
                return {
                    className: 'bg-gray-100 text-gray-800 border-gray-200',
                    icon: 'Trash2',
                    label: 'Deleted'
                };
            default:
                return {
                    className: 'bg-gray-100 text-gray-800 border-gray-200',
                    icon: 'AlertCircle',
                    label: status || 'Unknown'
                };
        }
    };

    const config = getStatusConfig(status);

    return (
        <span className={cn(
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
            config?.className
        )}>
      <Icon name={config?.icon} size={12} className="mr-1" />
            {config?.label}
    </span>
    );
};

const RoleBadge = ({ roles }) => {
    if (!roles?.length) return null;

    const getRoleConfig = (role) => {
        switch (role?.toLowerCase()) {
            case 'admin':
                return { className: 'bg-purple-100 text-purple-800 border-purple-200', label: 'Admin' };
            case 'center':
                return { className: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Center Admin' };
            case 'trainer':
                return { className: 'bg-orange-100 text-orange-800 border-orange-200', label: 'Trainer' };
            case 'student':
                return { className: 'bg-green-100 text-green-800 border-green-200', label: 'Student' };
            default:
                return { className: 'bg-gray-100 text-gray-800 border-gray-200', label: role };
        }
    };

    return (
        <div className="flex flex-wrap gap-1">
            {roles?.slice(0, 2)?.map((role, index) => {
                const config = getRoleConfig(role);
                return (
                    <span
                        key={index}
                        className={cn(
                            'inline-flex items-center px-2 py-1 rounded text-xs font-medium border',
                            config?.className
                        )}
                    >
            {config?.label}
          </span>
                );
            })}
            {roles?.length > 2 && (
                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium border bg-gray-100 text-gray-800 border-gray-200">
          +{roles?.length - 2}
        </span>
            )}
        </div>
    );
};

const UserAvatar = ({ user }) => {
    if (user.avatar) {
        return (
            <img
                src={user.avatar}
                alt={user.full_name}
                className="w-10 h-10 rounded-full object-cover"
            />
        );
    }
    const initials = user.full_name?.split(' ')?.map(name => name[0])?.join('')?.toUpperCase().slice(0, 2) || '??';
    return (
        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
            {initials}
        </div>
    );
};


const ActionsDropdown = ({ user, onViewUser, onEditUser, onToggleStatus, onResetPassword, onDeleteUser }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const handleAction = (action) => {
        setIsOpen(false);
        action();
    };

    return (
        <div className="relative">
            <Button
                variant="ghost"
                size="sm"
                iconName="MoreVertical"
                onClick={() => setIsOpen(!isOpen)}
                className="h-8 w-8 p-0"
            />

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 top-8 z-20 w-48 bg-card border border-border rounded-md shadow-lg py-1">
                        <button
                            onClick={() => handleAction(() => onViewUser(user?.id, user?.type, user?.profile_id))}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-accent transition-colors flex items-center"
                        >
                            <Icon name="Eye" size={16} className="mr-2" />
                            View Details
                        </button>

                        <button
                            onClick={() => handleAction(() => onEditUser(user?.id, user?.type, user?.profile_id))}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-accent transition-colors flex items-center"
                        >
                            <Icon name="Edit" size={16} className="mr-2" />
                            Edit User
                        </button>

                        <button
                            onClick={() => handleAction(() => onToggleStatus(user))}
                            className={cn(
                                "w-full px-4 py-2 text-left text-sm hover:bg-accent transition-colors flex items-center",
                                user?.status === 'Active' ? 'text-orange-600' : 'text-green-600'
                            )}
                        >
                            <Icon
                                name={user?.status === 'Active' ? 'UserX' : 'UserCheck'}
                                size={16}
                                className="mr-2"
                            />
                            {user?.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>

                        <button
                            onClick={() => handleAction(() => onResetPassword(user))}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-accent transition-colors flex items-center"
                        >
                            <Icon name="Key" size={16} className="mr-2" />
                            Reset Password
                        </button>

                        <div className="border-t my-1" />

                        <button
                            onClick={() => handleAction(() => onDeleteUser(user))}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-accent text-destructive transition-colors flex items-center"
                        >
                            <Icon name="Trash2" size={16} className="mr-2" />
                            Delete User
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

const UserTable = ({
                       users,
                       isLoading,
                       selectedUsers,
                       onUserSelection,
                       onSelectAll,
                       onViewUser,
                       onEditUser,
                       onToggleStatus,
                       onResetPassword,
                       onDeleteUser
                   }) => {
    const isAllSelected = users?.length > 0 && selectedUsers?.length === users?.length;
    const isIndeterminate = selectedUsers?.length > 0 && selectedUsers?.length < users?.length;

    const formatDate = (dateString) => {
        if (!dateString) return 'Never';
        try {
            return new Date(dateString)?.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return dateString;
        }
    };

    if (isLoading) {
        return (
            <div className="bg-card rounded-lg border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/50 border-b">
                        {/* Table header remains the same */}
                        <tr>
                            {/*<th className="px-4 py-3 text-left w-12"><Input type="checkbox" className="rounded" disabled /></th>*/}
                            <th className="px-4 py-3 text-left font-medium text-sm">User</th>
                            <th className="px-4 py-3 text-left font-medium text-sm">Contact</th>
                            <th className="px-4 py-3 text-left font-medium text-sm">Type & Roles</th>
                            <th className="px-4 py-3 text-left font-medium text-sm">Country</th>
                            <th className="px-4 py-3 text-left font-medium text-sm">Status</th>
                            <th className="px-4 py-3 text-left font-medium text-sm">Last Login</th>
                            <th className="px-4 py-3 text-left font-medium text-sm">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {/* Skeleton Rows */}
                        {Array.from({ length: 10 }).map((_, index) => (
                            <tr key={index} className="border-b">
                                <td className="px-4 py-2"><div className="h-5 w-5 bg-gray-200 rounded animate-pulse" /></td>
                                <td className="px-4 py-2">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
                                        <div>
                                            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-1" />
                                            <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-2" colSpan={6}><div className="h-4 bg-gray-200 rounded animate-pulse" /></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    if (!users?.length) {
        return (
            <div className="bg-card rounded-lg border p-12 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Users" size={32} className="text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">No Users Found</h3>
                <p className="text-muted-foreground">
                    No users match your current search and filter criteria.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-card rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-muted/50 border-b">
                    <tr>
                        <th className="px-4 py-3 text-left font-medium text-sm">User</th>
                        <th className="px-4 py-3 text-left font-medium text-sm">Contact</th>
                        <th className="px-4 py-3 text-left font-medium text-sm">Type & Roles</th>
                        <th className="px-4 py-3 text-left font-medium text-sm">Country</th>
                        <th className="px-4 py-3 text-left font-medium text-sm">Status</th>
                        <th className="px-4 py-3 text-left font-medium text-sm">Last Login</th>
                        <th className="px-4 py-3 text-left font-medium text-sm">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user) => (
                        <tr key={user?.id} className="border-b hover:bg-muted/25 transition-colors">

                            <td className="px-4 py-4">
                                <div className="flex items-center space-x-3">
                                    <UserAvatar user={user} />
                                    <div>
                                        <p className="font-medium text-foreground">{user.full_name}</p>
                                        <p className="text-sm text-muted-foreground">ID: {user.id}</p>
                                    </div>
                                </div>
                            </td>

                            <td className="px-4 py-4">
                                <div>
                                    <p className="text-sm text-foreground">{user.email}</p>
                                    <p className="text-sm text-muted-foreground">{user.phone_number}</p>
                                </div>
                            </td>

                            <td className="px-4 py-4">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-foreground capitalize">{user.type}</p>
                                    <RoleBadge roles={user.roles} />
                                </div>
                            </td>

                            <td className="px-4 py-4">
                                <p className="text-sm text-foreground">{user.country || 'N/A'}</p>
                            </td>

                            <td className="px-4 py-4">
                                <StatusBadge status={user.status} />
                            </td>

                            <td className="px-4 py-4">
                                {/*<p className="text-sm text-foreground">*/}
                                {/*    {formatDate(user.last_login_at)}*/}
                                {/*</p>*/}
                                <p className="text-xs text-muted-foreground">
                                    {/* **UPDATED**: Assuming snake_case from API */}
                                    Registered: {formatDate(user.created_at)}
                                </p>
                            </td>

                            <td className="px-4 py-4">
                                <ActionsDropdown
                                    user={user}
                                    onViewUser={onViewUser}
                                    onEditUser={onEditUser}
                                    onToggleStatus={onToggleStatus}
                                    onResetPassword={onResetPassword}
                                    onDeleteUser={onDeleteUser}
                                />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserTable;