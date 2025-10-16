import React, { useState } from 'react';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/AppIcon';
import { cn } from '../../../../utils/cn';

const ActionsDropdown = ({ job, onView, onEdit, onDelete, onStatusChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const handleAction = (action) => { setIsOpen(false); action(); };

    return (
        <div className="relative">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="h-8 w-8">
                <Icon name="MoreVertical" />
            </Button>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 top-full mt-1 z-20 w-48 bg-card border rounded-md shadow-lg py-1">
                        <button onClick={() => handleAction(() => onView(job.id))} className="w-full px-4 py-2 text-left text-sm hover:bg-accent flex items-center gap-2"><Icon name="Eye" size={14} /> View Details</button>
                        <button onClick={() => handleAction(() => onEdit(job.id))} className="w-full px-4 py-2 text-left text-sm hover:bg-accent flex items-center gap-2"><Icon name="Edit" size={14} /> Edit Job</button>
                        <button
                            onClick={() => handleAction(() => onStatusChange(job))}
                            className={cn(
                                "w-full px-4 py-2 text-left text-sm hover:bg-accent flex items-center gap-2",
                                job.status === 1 ? "text-red-600" : "text-green-600"
                            )}
                        >
                            <Icon name={job.status === 1 ? "ToggleLeft" : "ToggleRight"} size={14} />
                            {job.status === 1 ? "Deactivate" : "Activate"}
                        </button>
                        <div className="border-t my-1" />
                        <button onClick={() => handleAction(() => onDelete(job))} className="w-full px-4 py-2 text-left text-sm text-destructive hover:bg-accent flex items-center gap-2"><Icon name="Trash2" size={14} /> Delete</button>
                    </div>
                </>
            )}
        </div>
    );
};

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
                                    job={job}
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