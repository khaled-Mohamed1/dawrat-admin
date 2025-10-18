import React from 'react';
import Icon from '../../../../components/AppIcon';
import { cn } from '../../../../utils/cn';
import ActionsDropdown from '../../../../components/ui/ActionsDropdown';

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

const UserAvatar = ({ student }) => {
    if (student.file_url) {
        return (
            <img
                src={student.file_url}
                alt={student.name}
                className="w-10 h-10 rounded-full object-cover"
            />
        );
    }
    const initials = student.name?.split(' ')?.map(name => name[0])?.join('')?.toUpperCase().slice(0, 2) || '??';
    return (
        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
            {initials}
        </div>
    );
};

const StudentTable = ({
    students,
    isLoading,
    onStatusChange,
    onViewDetails,
    onEditStudent, onDeleteStudent, onResetPassword
}) => {
    if (isLoading) {
        return (
            <div className="bg-card rounded-lg border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/50 border-b">
                        <tr>
                            <th className="text-left p-4 font-medium text-foreground">Student</th>
                            <th className="text-left p-4 font-medium text-foreground">Contact</th>
                            <th className="text-left p-4 font-medium text-foreground">Country</th>
                            <th className="text-left p-4 font-medium text-foreground">Status</th>
                            <th className="text-left p-4 font-medium text-foreground">Enrollments</th>
                            <th className="text-left p-4 font-medium text-foreground">Registration Date</th>
                            <th className="text-left p-4 font-medium text-foreground w-20">Actions</th>
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
    
    if (!students?.length) {
        return (
            <div className="bg-card rounded-lg border text-center py-12">
                <Icon name="Users" size={48} className="text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Students Found</h3>
                <p className="text-muted-foreground">Try adjusting your search criteria.</p>
            </div>
        );
    }


    return (
        <div className="bg-card rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-muted/50 border-b border-border">
                        <tr>
                            <th className="text-left p-4 font-medium text-foreground">Student</th>
                            <th className="text-left p-4 font-medium text-foreground">Contact</th>
                            <th className="text-left p-4 font-medium text-foreground">Country</th>
                            <th className="text-left p-4 font-medium text-foreground">Status</th>
                            <th className="text-left p-4 font-medium text-foreground">Enrollments</th>
                            <th className="text-left p-4 font-medium text-foreground">Registration Date</th>
                            <th className="text-left p-4 font-medium text-foreground w-20">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <tr key={student.id} className="border-b border-border hover:bg-muted/30">
                                <td className="p-4">
                                    <div className="flex items-center space-x-3">
                                    <UserAvatar student={student} />
                                    <div>
                                        <p className="font-medium text-foreground">{student.name}</p>
                                        <p className="text-sm text-muted-foreground">ID: {student.id}</p>
                                    </div>
                                </div>
                                    
                                </td>
                                <td className="p-4">
                                    <div className="text-sm text-foreground">{student.email}</div>
                                    <div className="text-sm text-muted-foreground">
                                        {student.phone ? `${student.phone.phone_code} ${student.phone.phone_number}`: 'N/A'}
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-foreground">{student.country || 'N/A'}</td>
                            <td className="px-4 py-4">
                                <StatusBadge status={student.status} />
                            </td>
                                <td className="p-4 text-sm text-foreground">{student.num_enrollments}</td>
                                <td className="p-4 text-sm text-muted-foreground">
                                    {new Date(student.created_at).toLocaleDateString()}
                                </td>
                                <td className="p-4">
                                    <ActionsDropdown
                                        item={student}
                                        onView={onViewDetails}
                                        onEdit={onEditStudent}
                                        onStatusChange={onStatusChange}
                                        onResetPassword={onResetPassword}
                                        onDelete={onDeleteStudent}
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

export default StudentTable;