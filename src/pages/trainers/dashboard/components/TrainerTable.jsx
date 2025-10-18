import React from 'react';
import Icon from '../../../../components/AppIcon';
import { cn } from '../../../../utils/cn';
import ActionsDropdown from '../../../../components/ui/ActionsDropdown';

// --- Sub-Components ---

const StatusBadge = ({ status }) => {
    const getStatusConfig = (status) => {
        const statusStr = String(status || '').toLowerCase();
        switch (statusStr) {
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

const TrainerAvatar = ({ trainer }) => {
    if (trainer.file_url) {
        return <img src={trainer.file_url} alt={trainer.name} className="w-10 h-10 rounded-full object-cover" />;
    }
    const initials = trainer.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';
    return (
        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
            {initials}
        </div>
    );
};

// --- Main Table Component ---

const TrainerTable = ({
                          trainers,
                          isLoading,
                          onStatusChange,
                          onResetPassword,
                          onViewDetails,
                          onEditTrainer,
                          onDeleteTrainer
                      }) => {
    if (isLoading) {
        return (
            <div className="bg-card rounded-lg border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/50 border-b">
                        <tr>
                            <th className="p-4 text-left font-medium text-sm">Trainer</th>
                            <th className="p-4 text-left font-medium text-sm">Contact</th>
                            <th className="p-4 text-left font-medium text-sm">Details</th>
                            <th className="p-4 text-left font-medium text-sm">Published Courses</th>
                            <th className="p-4 text-left font-medium text-sm">Centers</th>
                            <th className="p-4 text-left font-medium text-sm">Commission</th>
                            <th className="p-4 text-left font-medium text-sm">Status</th>
                            <th className="p-4 text-left font-medium text-sm w-20">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {Array.from({ length: 10 }).map((_, index) => (
                            <tr key={index} className="border-b">
                                <td className="px-4 py-2"><div className="h-5 w-5 bg-gray-200 rounded animate-pulse" /></td>
                                <td className="px-4 py-2">
                                    <div className="flex items-center space-x-3">
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

    if (trainers.length === 0) {
        return (
            <div className="bg-card rounded-lg border text-center py-12">
                <Icon name="Users" size={48} className="text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Trainers Found</h3>
                <p className="text-muted-foreground">Try adjusting your search criteria.</p>
            </div>
        );
    }

    return (
        <div className="bg-card rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-muted/50 border-b">
                    <tr>
                        <th className="p-4 text-left font-medium text-sm">Trainer</th>
                        <th className="p-4 text-left font-medium text-sm">Contact</th>
                        <th className="p-4 text-left font-medium text-sm">Details</th>
                        <th className="p-4 text-left font-medium text-sm">Published Courses</th>
                        <th className="p-4 text-left font-medium text-sm">Centers</th>
                        <th className="p-4 text-left font-medium text-sm">Commission</th>
                        <th className="p-4 text-left font-medium text-sm">Status</th>
                        <th className="p-4 text-left font-medium text-sm w-20">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {trainers.map((trainer) => (
                        <tr key={trainer.id} className="border-b hover:bg-muted/25">
                            <td className="p-4">
                                <div className="flex items-center space-x-3">
                                    <TrainerAvatar trainer={trainer} />
                                    <div>
                                        <p className="font-medium text-foreground">{trainer.name}</p>
                                        <p className="text-sm text-muted-foreground">ID: {trainer.user_id}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="p-4">
                                <p className="text-sm text-foreground">{trainer.email}</p>
                                <p className="text-sm text-muted-foreground">{trainer.phone ? `${trainer.phone.phone_code} ${trainer.phone.phone_number}` : 'N/A'}</p>
                            </td>
                            <td className="p-4">
                                <p className="text-sm text-foreground">{trainer.job || 'N/A'}</p>
                                <p className="text-sm text-muted-foreground">{trainer.country || 'N/A'}</p>
                            </td>
                            <td className="p-4 text-sm text-center font-medium text-foreground">{trainer.course_published_count}</td>
                            <td className="p-4 text-sm text-center font-medium text-foreground">
                                {trainer.centers?.length ? trainer.centers.join(', ') : '-'}
                            </td>
                            <td className="p-4 text-sm text-center font-medium text-foreground">%{trainer.commission}</td>
                            <td className="p-4"><StatusBadge status={trainer.status} /></td>
                            <td className="p-4">
                                <ActionsDropdown
                                    item={trainer}
                                    onView={onViewDetails}
                                    onEdit={onEditTrainer}
                                    onStatusChange={onStatusChange}
                                    onResetPassword={onResetPassword}
                                    onDelete={onDeleteTrainer}
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

export default TrainerTable;