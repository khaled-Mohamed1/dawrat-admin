import React from 'react';
import Icon from '../../../../components/AppIcon';
import ActionsDropdown from '../../../../components/ui/ActionsDropdown';
import { cn } from '../../../../utils/cn';

const CourseRequestTable = ({ requests, isLoading, onView, onClose }) => {

    const getStatusColor = (status) => {
        const colors = {
            submitted: 'bg-yellow-100 text-yellow-800', interested: 'bg-blue-100 text-blue-800',
            accepted: 'bg-green-100 text-green-800', closed: 'bg-gray-100 text-gray-800'
        };
        return colors[status?.toLowerCase()] || 'bg-gray-100';
    };

    return (
        <div className="bg-card rounded-lg border overflow-hidden">
            <table className="w-full">
                <thead className="bg-muted/50">
                <tr>
                    <th className="p-3 text-left font-medium text-sm">Topic</th>
                    <th className="p-3 text-left font-medium text-sm">Category</th>
                    <th className="p-3 text-center font-medium text-sm">Interested</th>
                    <th className="p-3 text-left font-medium text-sm">Dates</th>
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
                            <Icon name="MessageSquare" size={48} className="mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold">No Course Demands Found</h3>
                            <p className="text-muted-foreground">There are currently no demands matching your criteria.</p>
                        </td>
                    </tr>
                ) : (
                    requests.map((req) => (
                        <tr key={req.id} className="border-b last:border-b-0 hover:bg-muted/25">
                            <td className="p-3 font-medium">{req.course_topic}</td>
                            <td className="p-3 text-sm text-muted-foreground">{req.categories}</td>
                            <td className="p-3 text-center text-sm font-medium">{req.interested_users_count}</td>
                            <td className="p-3 text-sm text-muted-foreground">
                                {new Date(req.start_date).toLocaleDateString()} - {new Date(req.end_date).toLocaleDateString()}
                            </td>
                            <td className="p-3 text-center">
                                    <span className={cn('px-2 py-1 text-xs font-medium rounded-full capitalize', getStatusColor(req.status))}>
                                        {req.status}
                                    </span>
                            </td>
                            <td className="p-3">
                                <div className="flex items-center justify-center">
                                    <ActionsDropdown item={req} onView={onView} onClose={onClose} />
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

export default CourseRequestTable;