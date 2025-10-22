import React from 'react';
import Icon from '../../../../components/AppIcon';
import ActionsDropdown from '../../../../components/ui/ActionsDropdown';

const CenterRequestTable = ({ requests, isLoading, onView, onDelete }) => {
    return (
        <div className="bg-card rounded-lg border overflow-hidden">
            <table className="w-full">
                <thead className="bg-muted/50 border-b">
                <tr>
                    <th className="p-3 text-left font-medium text-sm">Registration #</th>
                    <th className="p-3 text-left font-medium text-sm">Center Name</th>
                    <th className="p-3 text-left font-medium text-sm">Contact</th>
                    <th className="p-3 text-left font-medium text-sm">Date</th>
                    <th className="p-3 text-center font-medium text-sm">Status</th>
                    <th className="p-3 text-center font-medium text-sm">Actions</th>
                </tr>
                </thead>
                <tbody>
                {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i} className="border-b last:border-b-0">
                            <td className="p-3" colSpan={6}><div className="h-6 bg-gray-200 rounded animate-pulse"></div></td>
                        </tr>
                    ))
                ) : requests.length === 0 ? (
                    <tr>
                        <td colSpan={6} className="text-center py-12">
                            <Icon name="ClipboardList" size={48} className="mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold">No Pending Requests</h3>
                            <p className="text-muted-foreground">There are currently no new center registration requests.</p>
                        </td>
                    </tr>
                ) : (
                    requests.map((req) => (
                        <tr key={req.id} className="border-b last:border-b-0 hover:bg-muted/25">
                            <td className="p-3 font-mono text-xs">{req.registration_number}</td>
                            <td className="p-3 font-medium">{req.center_name}</td>
                            <td className="p-3 text-sm text-muted-foreground">{req.email}</td>
                            <td className="p-3 text-sm text-muted-foreground">{new Date(req.created_at).toLocaleDateString()}</td>
                            <td className="p-3 text-center text-sm capitalize">{req.status}</td>
                            <td className="p-3">
                                <div className="flex items-center justify-center">
                                    <ActionsDropdown item={req} onView={onView} onDelete={onDelete} />
                                </div>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
};

export default CenterRequestTable;