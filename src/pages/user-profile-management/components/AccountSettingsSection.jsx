import React from 'react';
import Button from '../../../components/ui/Button';

import Icon from '../../../components/AppIcon';

const AccountSettingsSection = ({ user, isEditing, onFieldChange, onResetPassword }) => {
    const handleToggleTwoFactor = () => {
        const newValue = !user?.twoFactorEnabled;
        onFieldChange('twoFactorEnabled', newValue);
    };

    const formatLastLogin = (dateString) => {
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

    return (
        <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center space-x-2 mb-6">
                <Icon name="Settings" size={24} className="text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Account Settings</h2>
            </div>

            <div className="space-y-8">
                {/* Authentication Section */}
                <div>
                    <h3 className="text-lg font-medium text-foreground mb-4">Authentication & Security</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Password Management */}
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">
                                    Password Management
                                </label>
                                <div className="p-4 border border-border rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-foreground">Password</p>
                                            <p className="text-xs text-muted-foreground">
                                                Last updated: {formatLastLogin(user?.lastPasswordChange) || 'Unknown'}
                                            </p>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            iconName="Key"
                                            onClick={onResetPassword}
                                        >
                                            Reset Password
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Two-Factor Authentication */}
                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">
                                    Two-Factor Authentication
                                </label>
                                <div className="p-4 border border-border rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-foreground">2FA Status</p>
                                            <p className="text-xs text-muted-foreground">
                                                {user?.twoFactorEnabled ? 'Enabled and active' : 'Disabled'}
                                            </p>
                                        </div>
                                        {isEditing ? (
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={user?.twoFactorEnabled || false}
                                                    onChange={handleToggleTwoFactor}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                            </label>
                                        ) : (
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                user?.twoFactorEnabled
                                                    ? 'bg-green-100 text-green-800' :'bg-red-100 text-red-800'
                                            }`}>
                        {user?.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Login Information */}
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">
                                    Login Information
                                </label>
                                <div className="space-y-3">
                                    <div className="p-3 bg-muted/50 rounded-lg">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <Icon name="Clock" size={16} className="text-muted-foreground" />
                                            <span className="text-sm text-foreground">Last Login</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {formatLastLogin(user?.lastLoginAt)}
                                        </p>
                                    </div>

                                    <div className="p-3 bg-muted/50 rounded-lg">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <Icon name="Calendar" size={16} className="text-muted-foreground" />
                                            <span className="text-sm text-foreground">Registration Date</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {user?.registrationDate ?
                                                new Date(user?.registrationDate)?.toLocaleDateString('en-GB')
                                                : '—'
                                            }
                                        </p>
                                    </div>

                                    <div className="p-3 bg-muted/50 rounded-lg">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <Icon name="Monitor" size={16} className="text-muted-foreground" />
                                            <span className="text-sm text-foreground">Login Sessions</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            1 active session
                                        </p>
                                        <Button
                                            variant="ghost"
                                            size="xs"
                                            className="mt-1"
                                            onClick={() => {/* TODO: Show session management */}}
                                        >
                                            Manage Sessions
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Verification Status */}
                <div>
                    <h3 className="text-lg font-medium text-foreground mb-4">Verification Status</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 border border-border rounded-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Icon name="Mail" size={20} className="text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium text-foreground">Email Verification</p>
                                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {user?.emailVerified ? (
                                        <>
                                            <Icon name="CheckCircle" size={20} className="text-green-600" />
                                            <span className="text-xs text-green-600">Verified</span>
                                        </>
                                    ) : (
                                        <>
                                            <Icon name="AlertCircle" size={20} className="text-orange-600" />
                                            <span className="text-xs text-orange-600">Pending</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            {!user?.emailVerified && (
                                <Button variant="outline" size="xs" className="mt-2 w-full">
                                    Resend Verification
                                </Button>
                            )}
                        </div>

                        <div className="p-4 border border-border rounded-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Icon name="Phone" size={20} className="text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium text-foreground">Phone Verification</p>
                                        <p className="text-xs text-muted-foreground">{user?.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {user?.phoneVerified ? (
                                        <>
                                            <Icon name="CheckCircle" size={20} className="text-green-600" />
                                            <span className="text-xs text-green-600">Verified</span>
                                        </>
                                    ) : (
                                        <>
                                            <Icon name="AlertCircle" size={20} className="text-orange-600" />
                                            <span className="text-xs text-orange-600">Pending</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            {!user?.phoneVerified && (
                                <Button variant="outline" size="xs" className="mt-2 w-full">
                                    Send Verification SMS
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Security Notice */}
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center space-x-2 text-amber-800">
                        <Icon name="Shield" size={16} />
                        <p className="text-sm font-medium">Security Notice</p>
                    </div>
                    <p className="text-xs text-amber-700 mt-1">
                        Password resets will generate a new temporary password and send it to the user's verified email address.
                        The user will be required to change it upon first login. Reset links expire after 60 minutes.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AccountSettingsSection;