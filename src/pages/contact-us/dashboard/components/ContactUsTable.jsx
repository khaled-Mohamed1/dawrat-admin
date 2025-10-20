import React from 'react';
import Icon from '../../../../components/AppIcon';
import ActionsDropdown from '../../../../components/ui/ActionsDropdown';

const ContactUsTable = ({ submissions, isLoading, onView, onDelete }) => {
    return (
        <div className="bg-card rounded-lg border overflow-hidden">
            <table className="w-full">
                <thead className="bg-muted/50 border-b">
                <tr>
                    <th className="p-4 text-left font-medium text-sm">User</th>
                    <th className="p-4 text-left font-medium text-sm">Type</th>
                    <th className="p-4 text-left font-medium text-sm">Message</th>
                    <th className="p-4 text-center font-medium text-sm">Actions</th>
                </tr>
                </thead>
                <tbody>
                {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i} className="border-b last:border-b-0">
                            <td className="p-4" colSpan={4}><div className="h-6 bg-gray-200 rounded animate-pulse"></div></td>
                        </tr>
                    ))
                ) : submissions.length === 0 ? (
                    <tr>
                        <td colSpan={4} className="text-center py-12">
                            <Icon name="MailX" size={48} className="mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold">No Messages Found</h3>
                            <p className="text-muted-foreground">There are currently no contact us submissions.</p>
                        </td>
                    </tr>
                ) : (
                    submissions.map((sub) => (
                        <tr key={sub.id} className="border-b last:border-b-0 hover:bg-muted/25">
                            <td className="p-4">
                                <p className="font-medium">{sub.user.name || 'N/A'}</p>
                                <p className="text-sm text-muted-foreground">{sub.user.email}</p>
                            </td>
                            <td className="p-4 text-sm capitalize">{sub.type}</td>
                            <td className="p-4 text-sm text-muted-foreground max-w-sm truncate">{sub.message}</td>
                            <td className="p-4">
                                <div className="flex items-center justify-center">
                                    <ActionsDropdown item={sub} onView={onView} onDelete={onDelete} />
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

export default ContactUsTable;