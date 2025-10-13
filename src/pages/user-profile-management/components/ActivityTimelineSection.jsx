import React from 'react';
import Icon from '../../../components/AppIcon';

const ActivityTimelineSection = ({ activities }) => {
    const getActivityIcon = (type) => {
        switch (type) {
            case 'login':
                return 'LogIn';
            case 'profile_update':
                return 'Edit';
            case 'status_change':
                return 'Activity';
            case 'password_reset':
                return 'Key';
            case 'role_change':
                return 'Shield';
            case 'account_deletion':
                return 'Trash2';
            default:
                return 'Clock';
        }
    };

    const getActivityColor = (type) => {
        switch (type) {
            case 'login':
                return 'text-green-600 bg-green-100';
            case 'profile_update':
                return 'text-blue-600 bg-blue-100';
            case 'status_change':
                return 'text-orange-600 bg-orange-100';
            case 'password_reset':
                return 'text-purple-600 bg-purple-100';
            case 'role_change':
                return 'text-indigo-600 bg-indigo-100';
            case 'account_deletion':
                return 'text-red-600 bg-red-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const formatTimestamp = (timestamp) => {
        try {
            const date = new Date(timestamp);
            const now = new Date();
            const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

            if (diffInHours < 1) {
                const diffInMinutes = Math.floor((now - date) / (1000 * 60));
                return diffInMinutes < 1 ? 'Just now' : `${diffInMinutes}m ago`;
            } else if (diffInHours < 24) {
                return `${diffInHours}h ago`;
            } else {
                const diffInDays = Math.floor(diffInHours / 24);
                if (diffInDays < 7) {
                    return `${diffInDays}d ago`;
                } else {
                    return date?.toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: '2-digit'
                    });
                }
            }
        } catch {
            return timestamp;
        }
    };

    const formatFullTimestamp = (timestamp) => {
        try {
            return new Date(timestamp)?.toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return timestamp;
        }
    };

    return (
        <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center space-x-2 mb-6">
                <Icon name="Clock" size={24} className="text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Activity Timeline</h2>
            </div>

            {activities?.length > 0 ? (
                <div className="space-y-4">
                    {activities?.map((activity, index) => (
                        <div key={activity?.id} className="relative">
                            {/* Timeline line */}
                            {index < activities?.length - 1 && (
                                <div className="absolute left-5 top-10 w-px h-6 bg-border"></div>
                            )}

                            <div className="flex space-x-3">
                                {/* Activity icon */}
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getActivityColor(activity?.type)}`}>
                                    <Icon name={getActivityIcon(activity?.type)} size={16} />
                                </div>

                                {/* Activity content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-foreground">
                                                {activity?.description}
                                            </p>

                                            {activity?.details && (
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {activity?.details}
                                                </p>
                                            )}

                                            {activity?.adminUser && (
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    by {activity?.adminUser}
                                                </p>
                                            )}

                                            {activity?.ipAddress && (
                                                <p className="text-xs text-muted-foreground">
                                                    IP: {activity?.ipAddress}
                                                </p>
                                            )}

                                            {activity?.userAgent && (
                                                <p className="text-xs text-muted-foreground">
                                                    {activity?.userAgent}
                                                </p>
                                            )}
                                        </div>

                                        <span
                                            className="text-xs text-muted-foreground flex-shrink-0 ml-2"
                                            title={formatFullTimestamp(activity?.timestamp)}
                                        >
                      {formatTimestamp(activity?.timestamp)}
                    </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                        <Icon name="Clock" size={24} className="text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">No recent activity</p>
                </div>
            )}

            {/* Activity Summary */}
            {activities?.length > 0 && (
                <div className="mt-6 pt-4 border-t border-border">
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                            <p className="text-lg font-semibold text-foreground">
                                {activities?.filter(a => a?.type === 'login')?.length || 0}
                            </p>
                            <p className="text-xs text-muted-foreground">Logins</p>
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-foreground">
                                {activities?.filter(a => a?.type === 'profile_update')?.length || 0}
                            </p>
                            <p className="text-xs text-muted-foreground">Updates</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Load More */}
            {activities?.length >= 10 && (
                <div className="mt-4 text-center">
                    <button
                        className="text-sm text-primary hover:text-primary/80 font-medium"
                        onClick={() => {/* TODO: Load more activities */}}
                    >
                        Load More Activity
                    </button>
                </div>
            )}
        </div>
    );
};

export default ActivityTimelineSection;