import React from 'react';
import Icon from '../../../../components/AppIcon';
import { cn } from '../../../../utils/cn';

const StatusBadge = ({ status }) => {
    const getStatusConfig = (status) => {
        switch (status?.toLowerCase()) {
            // --- Administrative Statuses ---
            case 'published':
                return { className: 'bg-green-100 text-green-800 border-green-200', icon: 'CheckCircle', label: 'Published' };
            case 'submitted':
                return { className: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: 'Send', label: 'Submitted' };
            case 'unpublished':
                return { className: 'bg-gray-100 text-gray-800 border-gray-200', icon: 'Slash', label: 'Unpublished' };
            case 'approved':
                return { className: 'bg-blue-100 text-blue-800 border-blue-200', icon: 'ThumbsUp', label: 'Approved' };
            case 'pending':
                return { className: 'bg-orange-100 text-orange-800 border-orange-200', icon: 'Clock', label: 'Pending' };
            case 'rejected':
                return { className: 'bg-red-100 text-red-800 border-red-200', icon: 'XCircle', label: 'Rejected' };

            // --- Timing/Progress Statuses ---
            case 'completed':
                return { className: 'bg-gray-100 text-gray-800 border-gray-200', icon: 'Flag', label: 'Completed' };
            case 'in-progress':
                return { className: 'bg-blue-100 text-blue-800 border-blue-200', icon: 'PlayCircle', label: 'In Progress' };
            case 'not-started':
                return { className: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: 'PauseCircle', label: 'Not Started' };

            // Default fallback
            default:
                return { className: 'bg-gray-100 text-gray-800 border-gray-200', icon: 'AlertCircle', label: status || 'Unknown' };
        }
    };

    const config = getStatusConfig(status);

    return (
        <span
            className={cn(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border mt-1',
                config.className
            )}
        >
            <Icon name={config.icon} size={12} className="mr-1" />
            {config.label}
        </span>
    );
};

export default StatusBadge;