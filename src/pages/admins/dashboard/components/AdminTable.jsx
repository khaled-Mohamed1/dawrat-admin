import React from 'react';
import Icon from '../../../../components/AppIcon';
import ActionsDropdown from '../../../../components/ui/ActionsDropdown';

const AdminTable = ({ admins, isLoading, onView, onEdit, onDelete }) => {
    if (isLoading) {
        return <div className="bg-card rounded-lg border p-4"><div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />)}</div></div>;
    }
    if (admins.length === 0) {
        return <div className="bg-card rounded-lg border text-center py-12"><Icon name="UserCog" size={48} className="mx-auto text-muted-foreground mb-4" /><h3 className="text-lg font-semibold">No Admins Found</h3></div>;
    }

    return (
        <div className="bg-card rounded-lg border overflow-hidden">
            <table className="w-full">
                <thead className="bg-muted/50">
                <tr>
                    <th className="p-4 text-left font-medium text-sm">Name</th>
                    <th className="p-4 text-left font-medium text-sm">Email</th>
                    <th className="p-4 text-left font-medium text-sm">Role</th>
                    <th className="p-4 text-center font-medium text-sm">Actions</th>
                </tr>
                </thead>
                <tbody>
                {admins.map((admin) => (
                    <tr key={admin.id} className="border-b last:border-b-0 hover:bg-muted/25">
                        <td className="p-4 font-medium text-foreground">{admin.name}</td>
                        <td className="p-4 text-sm text-muted-foreground">{admin.email}</td>
                        <td className="p-4 text-sm text-foreground capitalize">{admin.roles?.[0]?.name.replace('_', ' ') || 'N/A'}</td>
                        <td className="p-4">
                            <div className="flex items-center justify-center">
                                <ActionsDropdown
                                    item={admin}
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

export default AdminTable;