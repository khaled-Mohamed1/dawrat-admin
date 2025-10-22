import React from 'react';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/AppIcon';
import ActionsDropdown from '../../../../components/ui/ActionsDropdown';
import { cn } from '../../../../utils/cn';

const AdTable = ({ ads, isLoading, onView, onEdit, onDelete, onStatusChange }) => {

    const getVerificationColor = (status) => {
        const s = status.toLowerCase();
        if (s === 'approved') return 'bg-green-100 text-green-800';
        if (s === 'rejected') return 'bg-red-100 text-red-800';
        return 'bg-yellow-100 text-yellow-800'; // Pending
    };

    const getStatusColor = (status) => {
        if (status) return 'bg-green-100 text-green-800';
        if (!status) return 'bg-red-100 text-red-800';
        return 'bg-yellow-100 text-yellow-800';
    };

    if (isLoading) {
        return (
            <div className="bg-card rounded-lg border p-4">
                <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-20 bg-gray-200 rounded animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    if (ads.length === 0) {
        return (
            <div className="bg-card rounded-lg border text-center py-12">
                <Icon name="Image" size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">No Ads Found</h3>
                <p className="text-muted-foreground">Try adjusting your filter criteria.</p>
            </div>
        );
    }

    return (
        <div className="bg-card rounded-lg border overflow-hidden">
            <table className="w-full">
                <thead className="bg-muted/50">
                <tr>
                    <th className="p-3 text-left font-medium text-sm">Ad</th>
                    <th className="p-3 text-left font-medium text-sm">User</th>
                    <th className="p-3 text-left font-medium text-sm">Link</th>
                    <th className="p-3 text-center font-medium text-sm">Verification</th>
                    <th className="p-3 text-center font-medium text-sm">Status</th>
                    <th className="p-3 text-center font-medium text-sm">Actions</th>
                </tr>
                </thead>
                <tbody>
                {ads.map((ad) => (
                    <tr key={ad.id} className="border-b last:border-b-0 hover:bg-muted/25">
                        <td className="p-3">
                            <div className="flex items-center gap-3">
                                <img src={ad.file_url} alt={ad.title} className="w-12 h-12 object-cover rounded" />
                                <span className="font-medium">{ad.title}</span>
                            </div>
                        </td>
                        <td className="p-3 text-sm">{ad.user.name}</td>
                        <td className="p-3 text-sm text-blue-600 hover:underline truncate max-w-xs">
                            <a href={ad.link} target="_blank" rel="noopener noreferrer">{ad.link}</a>
                        </td>
                        <td className="p-3 text-center">
                                <span className={cn('px-2 py-1 text-xs font-medium rounded-full', getVerificationColor(ad.is_verify))}>
                                    {ad.is_verify}
                                </span>
                        </td>
                        <td className="p-3 text-center text-sm">
                            <span className={cn('px-2 py-1 text-xs font-medium rounded-full', getStatusColor(ad.status))}>
                                    {ad.status ? 'Active' : 'Inactive'}
                                </span>

                        </td>
                        <td className="p-3">
                            <div className="flex items-center justify-center">
                                <ActionsDropdown
                                    item={ad}
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

export default AdTable;