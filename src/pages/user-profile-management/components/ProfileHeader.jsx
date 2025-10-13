import React, { useState } from 'react';
import Button from '../../../components/ui/Button';

import Icon from '../../../components/AppIcon';

const ProfileHeader = ({ user, isEditing, onFieldChange }) => {
    const [avatarPreview, setAvatarPreview] = useState(null);

    const handleAvatarChange = (event) => {
        const file = event?.target?.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatarPreview(e?.target?.result);
                onFieldChange('avatar', e?.target?.result);
            };
            reader?.readAsDataURL(file);
        }
    };

    const getStatusBadge = (status) => {
        switch (status?.toLowerCase()) {
            case 'active':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
            <Icon name="CheckCircle" size={12} className="mr-1" />
            Active
          </span>
                );
            case 'inactive':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
            <Icon name="XCircle" size={12} className="mr-1" />
            Inactive
          </span>
                );
            case 'deleted':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
            <Icon name="Trash2" size={12} className="mr-1" />
            Deleted
          </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
            {status}
          </span>
                );
        }
    };

    const getUserTypeIcon = (userType) => {
        switch (userType?.toLowerCase()) {
            case 'admin':
                return 'Shield';
            case 'trainer':
                return 'BookOpen';
            case 'center admin': case'center_admin':
                return 'Building';
            case 'student':
                return 'GraduationCap';
            default:
                return 'User';
        }
    };

    const renderAvatar = () => {
        const avatarSrc = avatarPreview || user?.avatar;

        if (avatarSrc) {
            return (
                <img
                    src={avatarSrc}
                    alt={user?.fullName}
                    className="w-20 h-20 rounded-full object-cover border-4 border-background shadow-lg"
                />
            );
        }

        const initials = user?.fullName
            ?.split(' ')
            ?.map(name => name?.charAt(0))
            ?.join('')
            ?.toUpperCase()
            ?.slice(0, 2) || '??';

        return (
            <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-semibold border-4 border-background shadow-lg">
                {initials}
            </div>
        );
    };

    return (
        <div className="bg-card rounded-lg border overflow-hidden">
            {/* Cover Image */}
            <div className="h-32 bg-gradient-to-r from-primary/20 to-secondary/20"></div>

            {/* Profile Content */}
            <div className="px-6 pb-6 -mt-10">
                <div className="flex flex-col md:flex-row md:items-end md:space-x-6">
                    {/* Avatar */}
                    <div className="relative">
                        {renderAvatar()}

                        {isEditing && (
                            <div className="absolute bottom-0 right-0">
                                <label className="cursor-pointer">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        className="hidden"
                                    />
                                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors">
                                        <Icon name="Camera" size={16} />
                                    </div>
                                </label>
                            </div>
                        )}
                    </div>

                    {/* User Info */}
                    <div className="flex-1 mt-4 md:mt-0">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                                <div className="flex items-center space-x-3 mb-2">
                                    <h2 className="text-2xl font-bold text-foreground">
                                        {user?.fullName}
                                    </h2>
                                    {getStatusBadge(user?.status)}
                                </div>

                                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                    <div className="flex items-center space-x-1">
                                        <Icon name={getUserTypeIcon(user?.userType)} size={16} />
                                        <span>{user?.userType}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Icon name="Mail" size={16} />
                                        <span>{user?.email}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Icon name="Phone" size={16} />
                                        <span>{user?.phone}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Icon name="MapPin" size={16} />
                                        <span>{user?.country}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="flex items-center space-x-6 mt-4 md:mt-0">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-foreground">
                                        {user?.roles?.length || 0}
                                    </p>
                                    <p className="text-xs text-muted-foreground">Roles</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-foreground">
                                        {user?.lastLoginAt ?
                                            Math.floor((new Date() - new Date(user?.lastLoginAt)) / (1000 * 60 * 60 * 24))
                                            : '—'
                                        }
                                    </p>
                                    <p className="text-xs text-muted-foreground">Days Ago</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Role Badges */}
                <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                        {user?.roles?.map((role, index) => {
                            const getRoleConfig = (role) => {
                                switch (role?.toLowerCase()) {
                                    case 'admin':
                                        return 'bg-purple-100 text-purple-800 border-purple-200';
                                    case 'center_admin': case'center admin':
                                        return 'bg-blue-100 text-blue-800 border-blue-200';
                                    case 'trainer':
                                        return 'bg-orange-100 text-orange-800 border-orange-200';
                                    case 'student':
                                        return 'bg-green-100 text-green-800 border-green-200';
                                    default:
                                        return 'bg-gray-100 text-gray-800 border-gray-200';
                                }
                            };

                            return (
                                <span
                                    key={index}
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRoleConfig(role)}`}
                                >
                  {role?.replace('_', ' ')?.charAt(0)?.toUpperCase() + role?.replace('_', ' ')?.slice(1)}
                </span>
                            );
                        })}
                    </div>
                </div>

                {/* User ID and Registration Info */}
                <div className="mt-4 pt-4 border-t border-border">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <p className="text-muted-foreground">User ID</p>
                            <p className="font-medium text-foreground">#{user?.id}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Registered</p>
                            <p className="font-medium text-foreground">
                                {user?.registrationDate ?
                                    new Date(user?.registrationDate)?.toLocaleDateString('en-GB')
                                    : '—'
                                }
                            </p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Last Login</p>
                            <p className="font-medium text-foreground">
                                {user?.lastLoginAt ?
                                    new Date(user?.lastLoginAt)?.toLocaleDateString('en-GB', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })
                                    : 'Never'
                                }
                            </p>
                        </div>
                        {user?.status === 'Deleted' && user?.deletedDate && (
                            <div>
                                <p className="text-muted-foreground">Deletion Date</p>
                                <p className="font-medium text-destructive">
                                    {new Date(user?.deletedDate)?.toLocaleDateString('en-GB')}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Deleted Account Banner */}
                {user?.status === 'Deleted' && (
                    <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                        <div className="flex items-center space-x-2 text-destructive">
                            <Icon name="AlertTriangle" size={20} />
                            <div>
                                <p className="font-medium">Account Scheduled for Deletion</p>
                                <p className="text-sm">
                                    This account will be permanently deleted on{' '}
                                    {user?.deletedDate ? new Date(user?.deletedDate)?.toLocaleDateString('en-GB') : 'Unknown date'}.
                                    You can restore it before this date.
                                </p>
                            </div>
                        </div>
                        <div className="mt-3 flex space-x-2">
                            <Button size="sm" variant="outline">
                                Restore Account
                            </Button>
                            <Button size="sm" variant="destructive">
                                Delete Permanently
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileHeader;