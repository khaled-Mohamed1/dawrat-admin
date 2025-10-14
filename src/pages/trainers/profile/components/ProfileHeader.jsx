import React, { useState } from 'react';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/AppIcon';
import {cn} from "../../../../utils/cn.js";

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

const ProfileHeader = ({ trainer }) => {

    return (
        <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                        {trainer?.file_url ? (
                            <img src={trainer.file_url} alt={trainer.full_name_en} className="w-16 h-16 rounded-full object-cover" />
                        ) : (
                            <Icon name="User" size={32} className="text-primary" />
                        )}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-foreground">{trainer?.full_name_en}</h2>
                        <p className="text-muted-foreground">Trainer ID: {trainer?.id}</p>
                        <div className="flex items-center gap-4 mt-2">
                             <span className="text-sm text-muted-foreground">
                                Registered: {trainer?.created_at ? new Date(trainer.created_at).toLocaleDateString() : 'N/A'}
                            </span>
                                <span className="text-sm text-muted-foreground">
                                    Last login: {trainer?.lastLogin ? new Date(trainer?.lastLogin).toLocaleDateString() : 'N/A'}
                                </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:ml-auto">
                    <div className="flex items-center gap-3">
                        <StatusBadge status={trainer.status} />
                        <div className="flex flex-col gap-2 text-sm">
                            <div className="flex items-center gap-2">
                                <Icon name="Star" size={16} className="text-muted-foreground" />
                                <span className="text-foreground font-medium">{trainer?.average_rating || 0}</span>
                                <span className="text-muted-foreground">Average Rating</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Icon name="Users" size={16} className="text-muted-foreground" />
                                <span className="text-foreground font-medium">{trainer?.number_student_rating || 0}</span>
                                <span className="text-muted-foreground">Number Student Rating</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;