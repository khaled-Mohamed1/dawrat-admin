import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const RolesPermissionsSection = ({ user, isEditing, onRoleUpdate }) => {
    const [availableRoles] = useState([
        {
            id: 'student',
            name: 'Student',
            description: 'Access to learning materials and course enrollment',
            permissions: ['view_courses', 'enroll_courses', 'view_progress', 'submit_assignments'],
            color: 'green'
        },
        {
            id: 'trainer',
            name: 'Trainer',
            description: 'Create and manage courses, view student progress',
            permissions: ['create_courses', 'manage_courses', 'view_students', 'grade_assignments', 'manage_sessions'],
            color: 'orange'
        },
        {
            id: 'center_admin',
            name: 'Center Admin',
            description: 'Manage center operations, trainers, and courses',
            permissions: ['manage_center', 'manage_trainers', 'view_analytics', 'manage_enrollments', 'financial_reports'],
            color: 'blue'
        },
        {
            id: 'admin',
            name: 'Admin',
            description: 'Full system access and user management',
            permissions: ['manage_users', 'system_settings', 'view_all_data', 'manage_roles', 'platform_analytics'],
            color: 'purple'
        }
    ]);

    const getCurrentUserRoles = () => {
        return user?.roles?.map(role => role?.toLowerCase()?.replace(' ', '_')) || [];
    };

    const handleRoleToggle = (roleId) => {
        const currentRoles = getCurrentUserRoles();
        let newRoles;

        if (currentRoles?.includes(roleId)) {
            // Remove role
            newRoles = currentRoles?.filter(role => role !== roleId);
        } else {
            // Add role
            newRoles = [...currentRoles, roleId];
        }

        // Convert back to display format
        const displayRoles = newRoles?.map(role => {
            const roleConfig = availableRoles?.find(r => r?.id === role);
            return roleConfig?.name || role;
        });

        onRoleUpdate(displayRoles);
    };

    const getRoleColor = (color) => {
        const colors = {
            green: 'bg-green-100 text-green-800 border-green-200',
            orange: 'bg-orange-100 text-orange-800 border-orange-200',
            blue: 'bg-blue-100 text-blue-800 border-blue-200',
            purple: 'bg-purple-100 text-purple-800 border-purple-200'
        };
        return colors?.[color] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const getPermissionIcon = (permission) => {
        const iconMap = {
            'view_courses': 'BookOpen',
            'enroll_courses': 'UserPlus',
            'view_progress': 'TrendingUp',
            'submit_assignments': 'FileText',
            'create_courses': 'Plus',
            'manage_courses': 'Settings',
            'view_students': 'Users',
            'grade_assignments': 'CheckSquare',
            'manage_sessions': 'Calendar',
            'manage_center': 'Building',
            'manage_trainers': 'UserCheck',
            'view_analytics': 'BarChart3',
            'manage_enrollments': 'UserPlus',
            'financial_reports': 'DollarSign',
            'manage_users': 'Shield',
            'system_settings': 'Cog',
            'view_all_data': 'Database',
            'manage_roles': 'Key',
            'platform_analytics': 'PieChart'
        };
        return iconMap?.[permission] || 'Circle';
    };

    const isRoleActive = (roleId) => {
        const currentRoles = getCurrentUserRoles();
        return currentRoles?.includes(roleId);
    };

    const getActivePermissions = () => {
        const currentRoles = getCurrentUserRoles();
        const activePermissions = new Set();

        currentRoles?.forEach(roleId => {
            const role = availableRoles?.find(r => r?.id === roleId);
            role?.permissions?.forEach(permission => {
                activePermissions?.add(permission);
            });
        });

        return Array.from(activePermissions);
    };

    return (
        <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center space-x-2 mb-6">
                <Icon name="Shield" size={24} className="text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Roles & Permissions</h2>
            </div>

            <div className="space-y-6">
                {/* Current Roles Summary */}
                <div>
                    <h3 className="text-lg font-medium text-foreground mb-3">Current Roles</h3>
                    <div className="flex flex-wrap gap-2">
                        {user?.roles?.length > 0 ? (
                            user?.roles?.map((role, index) => {
                                const roleConfig = availableRoles?.find(r =>
                                    r?.name?.toLowerCase() === role?.toLowerCase() ||
                                    r?.id === role?.toLowerCase()?.replace(' ', '_')
                                );
                                return (
                                    <span
                                        key={index}
                                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                                            roleConfig ? getRoleColor(roleConfig?.color) : 'bg-gray-100 text-gray-800 border-gray-200'
                                        }`}
                                    >
                    {role}
                  </span>
                                );
                            })
                        ) : (
                            <span className="text-muted-foreground">No roles assigned</span>
                        )}
                    </div>
                </div>

                {/* Role Management */}
                {isEditing && (
                    <div>
                        <h3 className="text-lg font-medium text-foreground mb-3">Assign Roles</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {availableRoles?.map((role) => (
                                <div
                                    key={role?.id}
                                    className={`p-4 border rounded-lg transition-all cursor-pointer ${
                                        isRoleActive(role?.id)
                                            ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                                    }`}
                                    onClick={() => handleRoleToggle(role?.id)}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${getRoleColor(role?.color)}`}>
                        {role?.name}
                      </span>
                                        </div>
                                        <Input
                                            type="checkbox"
                                            checked={isRoleActive(role?.id)}
                                            onChange={() => handleRoleToggle(role?.id)}
                                            className="h-4 w-4"
                                        />
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        {role?.description}
                                    </p>
                                    <div className="flex flex-wrap gap-1">
                                        {role?.permissions?.slice(0, 3)?.map((permission, idx) => (
                                            <span key={idx} className="text-xs bg-muted px-2 py-1 rounded">
                        {permission?.replace('_', ' ')}
                      </span>
                                        ))}
                                        {role?.permissions?.length > 3 && (
                                            <span className="text-xs text-muted-foreground">
                        +{role?.permissions?.length - 3} more
                      </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Permissions Preview */}
                <div>
                    <h3 className="text-lg font-medium text-foreground mb-3">Effective Permissions</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {getActivePermissions()?.length > 0 ? (
                            getActivePermissions()?.map((permission) => (
                                <div key={permission} className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
                                    <Icon name={getPermissionIcon(permission)} size={16} className="text-green-600" />
                                    <span className="text-sm text-foreground">
                    {permission?.split('_')?.map(word =>
                        word?.charAt(0)?.toUpperCase() + word?.slice(1)
                    )?.join(' ')}
                  </span>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full p-6 text-center text-muted-foreground">
                                No permissions assigned
                            </div>
                        )}
                    </div>
                </div>

                {/* Role Assignment Rules */}
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center space-x-2 text-amber-800">
                        <Icon name="AlertTriangle" size={16} />
                        <p className="text-sm font-medium">Role Assignment Rules</p>
                    </div>
                    <ul className="text-xs text-amber-700 mt-2 space-y-1">
                        <li>• Only Admins can assign or remove Admin and Center Admin roles</li>
                        <li>• Support users have restricted role assignment capabilities</li>
                        <li>• Cannot remove the last Admin from the platform</li>
                        <li>• Role changes take effect immediately and are logged for audit</li>
                        <li>• Users receive email notifications for role changes</li>
                    </ul>
                </div>

                {/* Quick Actions */}
                {!isEditing && (
                    <div className="flex flex-wrap gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            iconName="Eye"
                            onClick={() => {/* TODO: Show detailed permissions */}}
                        >
                            View All Permissions
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            iconName="History"
                            onClick={() => {/* TODO: Show role history */}}
                        >
                            Role History
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            iconName="FileText"
                            onClick={() => {/* TODO: Generate permissions report */}}
                        >
                            Export Permissions
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RolesPermissionsSection;