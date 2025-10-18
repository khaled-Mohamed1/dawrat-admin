import React from 'react';
import Icon from '../../../../components/AppIcon';
import { cn } from '../../../../utils/cn';
import ActionsDropdown from '../../../../components/ui/ActionsDropdown';

const StatusBadge = ({ status, timingStatus }) => {
    const statusColors = {
        published: 'bg-green-100 text-green-800', approved: 'bg-blue-100 text-blue-800',
        submitted: 'bg-yellow-100 text-yellow-800', pending: 'bg-orange-100 text-orange-800',
        unpublished: 'bg-gray-100 text-gray-800', rejected: 'bg-red-100 text-red-800',
    };

    const timingColors = {
        completed: 'bg-blue-100 text-blue-800',
        'in-progress': 'bg-green-100 text-green-800',
        'not-started': 'bg-yellow-100 text-yellow-800',
    };

    if (status) {
        return (
            <span className={cn('inline-block px-2 py-1 text-xs font-medium rounded-full text-center', statusColors[status.toLowerCase()] || 'bg-gray-100')}>
                {status}
            </span>
        );
    }

    if (timingStatus) {
        return (
            <span className={cn('inline-block px-2 py-1 text-xs font-medium rounded-full text-center capitalize', timingColors[timingStatus.toLowerCase()] || 'bg-gray-100')}>
                {timingStatus.replace('_', ' ')}
            </span>
        );
    }

    return null;
};

// --- Main Table Component ---
const CourseTable = ({ courses, isLoading, onViewDetails, onEditCourse, onDeleteCourse }) => {
    const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);

    if (isLoading) {
        return (
            <div className="bg-card rounded-lg border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/50 border-b">
                        <tr>
                            <th className="p-4 text-left font-medium text-sm">Course</th>
                            <th className="p-4 text-left font-medium text-sm">Provider</th>
                            <th className="p-4 text-left font-medium text-sm">Details</th>
                            <th className="p-4 text-left font-medium text-sm">Price</th>
                            <th className="p-4 text-left font-medium text-sm">Status</th>
                            <th className="p-4 text-left font-medium text-sm">Progress Status</th>
                            <th className="p-4 text-center font-medium text-sm">Actions</th>
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
    if (courses.length === 0) {
        return (
            <div className="bg-card rounded-lg border text-center py-12">
                <Icon name="Users" size={48} className="text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Courses Found</h3>
                <p className="text-muted-foreground">Try adjusting your search criteria.</p>
            </div>
        );
    }

    return (
        <div className="bg-card rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-muted/50 border-b">
                    <tr>
                        <th className="p-4 text-left font-medium text-sm">Course</th>
                        <th className="p-4 text-left font-medium text-sm">Provider</th>
                        <th className="p-4 text-left font-medium text-sm">Details</th>
                        <th className="p-4 text-left font-medium text-sm">Price</th>
                        <th className="p-4 text-left font-medium text-sm">Status</th>
                        <th className="p-4 text-left font-medium text-sm">Progress Status</th>
                        <th className="p-4 text-center font-medium text-sm">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {courses.map((course) => (
                        <tr key={course.id} className="border-b last:border-b-0 hover:bg-muted/25">
                            <td className="p-4">
                                <div className="flex items-center gap-4">
                                    <img src={course.file_url} alt={course.title} className="w-20 h-16 object-cover rounded-md" />
                                    <div>
                                        <p className="font-semibold text-foreground">{course.title}</p>
                                        <p className="text-xs">Category: <span className="text-xs text-muted-foreground">{course.category}</span></p>
                                    </div>
                                </div>
                            </td>
                            <td className="p-4 text-sm">
                                <p>Trainer: <span className="font-medium text-foreground">{course.trainer_name}</span></p>
                                <p>Center: <span className="text-muted-foreground">{course.center_name}</span></p>
                            </td>
                            <td className="p-4 text-sm text-muted-foreground">
                                <p>Level: <span className="font-medium text-foreground">{course.level}</span></p>
                                <p>Rating: <span className="font-medium text-foreground">{course.avg_rating.toFixed(1)} ★</span></p>
                            </td>
                            <td className="p-4 text-sm text-right">
                                <p className="font-bold text-lg text-foreground">{formatCurrency(course.final_price)}</p>
                                {course.discount > 0 && <p className="text-muted-foreground line-through">{formatCurrency(course.price)}</p>}
                            </td>
                            <td className="p-4">
                                <StatusBadge status={course.status} />
                            </td>
                            <td className="p-4">
                                <StatusBadge timingStatus={course.timing_status} />
                            </td>
                            <td className="p-4 text-center">
                                <ActionsDropdown item={course} onView={onViewDetails} onEdit={onEditCourse} onDelete={onDeleteCourse} />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CourseTable;