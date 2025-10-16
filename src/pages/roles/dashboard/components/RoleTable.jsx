import React, { useState } from 'react';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/AppIcon';

const ActionsDropdown = ({ role, onView, onEdit, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleAction = (action) => {
        setIsOpen(false);
        action();
    };

    return (
        <div className="relative">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="h-8 w-8">
                <Icon name="MoreVertical" />
            </Button>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />

                    <div className="absolute right-0 top-full mt-1 z-20 w-40 bg-card border rounded-md shadow-lg py-1">
                        <button
                            onClick={() => handleAction(() => onView(role.id))}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-accent flex items-center gap-2"
                        >
                            <Icon name="Eye" size={14} /> View
                        </button>
                        <button
                            onClick={() => handleAction(() => onEdit(role.id))}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-accent flex items-center gap-2"
                        >
                            <Icon name="Edit" size={14} /> Edit
                        </button>
                        <div className="border-t my-1" />
                        <button
                            onClick={() => handleAction(() => onDelete(role))}
                            className="w-full px-4 py-2 text-left text-sm text-destructive hover:bg-accent flex items-center gap-2"
                        >
                            <Icon name="Trash2" size={14} /> Delete
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

const RoleTable = ({ roles, isLoading, onView, onEdit, onDelete }) => {
    if (isLoading) {
        return <div className="bg-card rounded-lg border p-4"><div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />)}</div></div>;
    }
    if (roles.length === 0) {
        return <div className="bg-card rounded-lg border text-center py-12"><Icon name="Lock" size={48} className="mx-auto text-muted-foreground mb-4" /><h3 className="text-lg font-semibold">No Roles Found</h3></div>;
    }

    return (
        <div className="bg-card rounded-lg border overflow-hidden">
            <table className="w-full">
                <thead className="bg-muted/50">
                <tr>
                    <th className="p-4 text-left font-medium text-sm">Role Name</th>
                    <th className="p-4 text-center font-medium text-sm">Actions</th>
                </tr>
                </thead>
                <tbody>
                {roles.map((role) => (
                    <tr key={role.id} className="border-b last:border-b-0 hover:bg-muted/25">
                        <td className="p-4 font-medium text-foreground capitalize">{role.name.replace('_', ' ')}</td>
                        <td className="p-4">
                            <div className="flex items-center justify-center">
                                <ActionsDropdown
                                    role={role}
                                    onView={onView}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
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

export default RoleTable;