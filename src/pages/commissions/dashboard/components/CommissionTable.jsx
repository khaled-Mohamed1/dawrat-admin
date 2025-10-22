import React from 'react';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/AppIcon';
import { cn } from '../../../../utils/cn';

const CommissionTable = ({ commissions, isLoading, onView }) => {
    const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString() : 'N/A';

    return (
        <div className="bg-card rounded-lg border overflow-hidden">
            <table className="w-full">
                <thead className="bg-muted/50 border-b">
                <tr>
                    <th className="p-3 text-left font-medium text-sm">User</th>
                    <th className="p-3 text-left font-medium text-sm">Plan</th>
                    <th className="p-3 text-center font-medium text-sm">Commission (%)</th>
                    <th className="p-3 text-left font-medium text-sm">Effective Dates</th>
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
                ) : commissions.length === 0 ? (
                    <tr>
                        <td colSpan={6} className="text-center py-12">
                            <Icon name="Percent" size={48} className="mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold">No Commissions Found</h3>
                            <p className="text-muted-foreground">Try adjusting your filter criteria.</p>
                        </td>
                    </tr>
                ) : (
                    commissions.map((item) => (
                        <tr key={item.user_id} className="border-b last:border-b-0 hover:bg-muted/25">
                            <td className="p-3 font-medium">{item.user_name}</td>
                            <td className="p-3 text-sm text-muted-foreground">{item.plan}</td>
                            <td className="p-3 text-center font-semibold">{item.platform_percentage}%</td>
                            <td className="p-3 text-sm text-muted-foreground">
                                {formatDate(item.effective_from)} - {formatDate(item.effective_to)}
                            </td>
                            <td className="p-3 text-center text-sm">
                                    <span className={cn('px-2 py-1 rounded-full', item.status ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800')}>
                                        {item.status || 'N/A'}
                                    </span>
                            </td>
                            <td className="p-3 text-center">
                                <Button size="sm" variant="outline" onClick={() => onView(item.user_id)}>View</Button>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
};

export default CommissionTable;