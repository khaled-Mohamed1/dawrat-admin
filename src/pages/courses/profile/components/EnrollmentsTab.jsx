import React, { useState, useEffect, useCallback } from 'react';
import Icon from '../../../../components/AppIcon';
import Pagination from '../../../../components/ui/Pagination';
import { getCourseEnrollments } from '../../../../api/courseService';
import { cn } from '../../../../utils/cn';

const EnrollmentsTab = ({ courseId }) => {
    const [enrollments, setEnrollments] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchEnrollments = useCallback(async () => {
        if (!courseId) return;
        setIsLoading(true);
        try {
            const response = await getCourseEnrollments(courseId, { page: currentPage });
            if (response.success) {
                setEnrollments(response.data);
                setPagination(response.meta);
            }
        } catch (error) {
            console.error("Failed to fetch enrollments", error);
        } finally {
            setIsLoading(false);
        }
    }, [courseId, currentPage]);

    useEffect(() => {
        fetchEnrollments();
    }, [fetchEnrollments]);

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed': return 'bg-green-100 text-green-800 border-green-200';
            case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'not-started': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        }
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground">Enrolled Students</h3>

            {isLoading ? (
                <div className="bg-card rounded-md border p-4"><div className="space-y-2">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />)}</div></div>
            ) : enrollments.length === 0 ? (
                <div className="text-center py-12">
                    <Icon name="Users" size={48} className="mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No students are currently enrolled in this course.</p>
                </div>
            ) : (
                <div className="bg-card rounded-lg border overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-muted/50 border-b">
                        <tr>
                            <th className="p-3 text-left text-sm font-medium">Student Name</th>
                            <th className="p-3 text-left text-sm font-medium">Email</th>
                            <th className="p-3 text-left text-sm font-medium">Enrollment Date</th>
                            <th className="p-3 text-left text-sm font-medium">Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {enrollments.map(item => (
                            <tr key={item.id} className="border-b last:border-b-0">
                                <td className="p-3 font-medium">{item.student.name}</td>
                                <td className="p-3 text-sm text-muted-foreground">{item.student.email}</td>
                                <td className="p-3 text-sm text-muted-foreground">{item.created_at}</td>
                                <td className="p-3">
                                        <span className={cn('px-2 py-1 text-xs font-medium rounded-full border capitalize', getStatusColor(item.status))}>
                                            {item.status.replace('-', ' ')}
                                        </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Pagination meta={pagination} onPageChange={setCurrentPage} />
        </div>
    );
};

export default EnrollmentsTab;