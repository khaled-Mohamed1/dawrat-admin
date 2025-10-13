import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const AccountStatusSection = ({ user, isEditing, onStatusChange, onDeleteAccount }) => {
    const getStatusConfig = (status) => {
        switch (status?.toLowerCase()) {
            case 'active':
                return {
                    color: 'green',
                    icon: 'CheckCircle',
                    bgClass: 'bg-green-100',
                    textClass: 'text-green-800',
                    borderClass: 'border-green-200'
                };
            case 'inactive':
                return {
                    color: 'red',
                    icon: 'XCircle',
                    bgClass: 'bg-red-100',
                    textClass: 'text-red-800',
                    borderClass: 'border-red-200'
                };
            case 'deleted':
                return {
                    color: 'gray',
                    icon: 'Trash2',
                    bgClass: 'bg-gray-100',
                    textClass: 'text-gray-800',
                    borderClass: 'border-gray-200'
                };
            default:
                return {
                    color: 'gray',
                    icon: 'AlertCircle',
                    bgClass: 'bg-gray-100',
                    textClass: 'text-gray-800',
                    borderClass: 'border-gray-200'
                };
        }
    };

    const statusConfig = getStatusConfig(user?.status);

    const getStatusDescription = (status) => {
        switch (status?.toLowerCase()) {
            case 'active':
                return 'User can log in and access all permitted features and services.';
            case 'inactive':
                return 'User cannot log in. All API tokens are revoked and access is restricted.';
            case 'deleted':
                return 'Account is scheduled for deletion. Personal information is masked.';
            default:
                return 'Unknown status.';
        }
    };

    const canChangeStatus = () => {
        // Business rules: can't change status if user has pending payouts, active courses, etc.
        // For demo purposes, we'll allow all status changes except for deleted accounts
        return user?.status?.toLowerCase() !== 'deleted';
    };

    const canDeleteAccount = () => {
        // Business rules: can't delete if unsettled payouts, active courses, upcoming sessions
        // For demo purposes, we'll simulate this check
        const hasBlockingConditions = false; // TODO: Implement actual checks
        return !hasBlockingConditions && user?.status?.toLowerCase() !== 'deleted';
    };

    return (
        <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center space-x-2 mb-6">
                <Icon name="Activity" size={24} className="text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Account Status</h2>
            </div>

            <div className="space-y-6">
                {/* Current Status */}
                <div>
                    <h3 className="text-lg font-medium text-foreground mb-3">Current Status</h3>

                    <div className={`p-4 border rounded-lg ${statusConfig?.borderClass} ${statusConfig?.bgClass}`}>
                        <div className="flex items-center space-x-3">
                            <Icon name={statusConfig?.icon} size={24} className={statusConfig?.textClass} />
                            <div className="flex-1">
                                <p className={`text-lg font-semibold ${statusConfig?.textClass}`}>
                                    {user?.status}
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {getStatusDescription(user?.status)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Management */}
                {isEditing && canChangeStatus() && (
                    <div>
                        <h3 className="text-lg font-medium text-foreground mb-3">Change Status</h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Button
                                variant={user?.status === 'Active' ? 'default' : 'outline'}
                                fullWidth
                                iconName="CheckCircle"
                                onClick={() => onStatusChange('Active')}
                                disabled={user?.status === 'Active'}
                            >
                                Activate Account
                            </Button>

                            <Button
                                variant={user?.status === 'Inactive' ? 'destructive' : 'outline'}
                                fullWidth
                                iconName="XCircle"
                                onClick={() => onStatusChange('Inactive')}
                                disabled={user?.status === 'Inactive'}
                            >
                                Deactivate Account
                            </Button>
                        </div>
                    </div>
                )}

                {/* Status Effects */}
                <div>
                    <h3 className="text-lg font-medium text-foreground mb-3">Status Effects</h3>

                    <div className="space-y-3">
                        <div className="p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center space-x-2 mb-1">
                                <Icon name="LogIn" size={16} className="text-muted-foreground" />
                                <span className="text-sm font-medium text-foreground">Login Access</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {user?.status === 'Active' ? '✓ Can log in' : '✗ Cannot log in'}
                            </p>
                        </div>

                        <div className="p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center space-x-2 mb-1">
                                <Icon name="Key" size={16} className="text-muted-foreground" />
                                <span className="text-sm font-medium text-foreground">API Tokens</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {user?.status === 'Active' ? '✓ Active tokens valid' : '✗ All tokens revoked'}
                            </p>
                        </div>

                        <div className="p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center space-x-2 mb-1">
                                <Icon name="Mail" size={16} className="text-muted-foreground" />
                                <span className="text-sm font-medium text-foreground">Notifications</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {user?.status === 'Active' ? '✓ Receives notifications' : '✗ No notifications sent'}
                            </p>
                        </div>

                        {user?.userType === 'Trainer' || user?.userType === 'Center Admin' ? (
                            <div className="p-3 bg-muted/50 rounded-lg">
                                <div className="flex items-center space-x-2 mb-1">
                                    <Icon name="BookOpen" size={16} className="text-muted-foreground" />
                                    <span className="text-sm font-medium text-foreground">Courses & Sessions</span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {user?.status === 'Active' ? '✓ Can manage content' : '✗ Content automatically deactivated'}
                                </p>
                            </div>
                        ) : null}
                    </div>
                </div>

                {/* Deletion Section */}
                {user?.status?.toLowerCase() === 'deleted' ? (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center space-x-2 text-red-800 mb-2">
                            <Icon name="AlertTriangle" size={20} />
                            <p className="font-medium">Account Scheduled for Deletion</p>
                        </div>
                        <p className="text-sm text-red-700 mb-3">
                            This account will be permanently deleted on{' '}
                            {user?.deletedDate ? new Date(user?.deletedDate)?.toLocaleDateString('en-GB') : 'Unknown date'}.
                            Personal information has been masked for privacy.
                        </p>
                        <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                                Restore Account
                            </Button>
                            <Button size="sm" variant="destructive">
                                Delete Permanently
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <h3 className="text-lg font-medium text-foreground mb-3">Danger Zone</h3>

                        <div className="p-4 border-2 border-red-200 rounded-lg">
                            <div className="flex items-start space-x-3">
                                <Icon name="AlertTriangle" size={24} className="text-red-600 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <h4 className="text-sm font-medium text-red-900 mb-1">
                                        Delete User Account
                                    </h4>
                                    <p className="text-sm text-red-700 mb-3">
                                        This will permanently delete the user account after 90 days.
                                        The user will be notified and can restore within the grace period.
                                    </p>

                                    {canDeleteAccount() ? (
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            iconName="Trash2"
                                            onClick={onDeleteAccount}
                                        >
                                            Delete Account
                                        </Button>
                                    ) : (
                                        <div className="space-y-2">
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                disabled
                                            >
                                                Cannot Delete
                                            </Button>
                                            <div className="text-xs text-red-600">
                                                <p className="font-medium mb-1">Deletion blocked due to:</p>
                                                <ul className="space-y-1">
                                                    <li>• Unsettled payouts pending</li>
                                                    <li>• Active courses in progress</li>
                                                    <li>• Upcoming scheduled sessions</li>
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Status Change Warning */}
                {isEditing && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center space-x-2 text-blue-800">
                            <Icon name="Info" size={16} />
                            <p className="text-sm font-medium">Status Change Effects</p>
                        </div>
                        <ul className="text-xs text-blue-700 mt-2 space-y-1">
                            <li>• Status changes take effect immediately</li>
                            <li>• User will receive email notification of status changes</li>
                            <li>• All status changes are logged for audit purposes</li>
                            <li>• Deactivating trainers/centers affects their courses and sessions</li>
                            <li>• System will check for blocking conditions before deactivation</li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AccountStatusSection;