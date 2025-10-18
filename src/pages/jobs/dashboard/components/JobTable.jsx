import React from 'react';
import Icon from '../../../../components/AppIcon';
import { cn } from '../../../../utils/cn';
import ActionsDropdown from '../../../../components/ui/ActionsDropdown';

const JobTable = ({ jobs, isLoading, onView, onEdit, onDelete, onStatusChange }) => {
    if (isLoading) {
        return <div className="bg-card rounded-lg border p-4"><div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />)}</div></div>;
    }
    if (jobs.length === 0) {
        return <div className="bg-card rounded-lg border text-center py-12"><Icon name="Briefcase" size={48} className="mx-auto text-muted-foreground mb-4" /><h3 className="text-lg font-semibold">No Jobs Found</h3></div>;
    }

    return (
        <div className="bg-card rounded-lg border overflow-hidden">
            <table className="w-full">
                <thead className="bg-muted/50">
                <tr>
                    <th className="p-4 text-left font-medium text-sm">Job Title</th>
                    <th className="p-4 text-left font-medium text-sm">Category</th>
                    <th className="p-4 text-center font-medium text-sm">Status</th>
                    <th className="p-4 text-center font-medium text-sm">Actions</th>
                </tr>
                </thead>
                <tbody>
                {jobs.map((job) => (
                    <tr key={job.id} className="border-b last:border-b-0 hover:bg-muted/25">
                        <td className="p-4 font-medium text-foreground">{job.name}</td>
                        <td className="p-4 text-sm text-muted-foreground">{job.category?.name || 'N/A'}</td>
                        <td className="p-4 text-center">
                                <span className={cn('px-2 py-1 text-xs font-medium rounded-full', job.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')}>
                                    {job.status ? 'Active' : 'Inactive'}
                                </span>
                        </td>
                        <td className="p-4">
                            <div className="flex items-center justify-center">
                                <ActionsDropdown
                                    item={job}
                                    onView={onView}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    onStatusChange={onStatusChange}
                                />
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default JobTable;