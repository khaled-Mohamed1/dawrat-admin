import React, { useState, useEffect, useCallback } from 'react';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/AppIcon';
import { getCourseSessions } from '../../../../api/courseService';
import { cn } from '../../../../utils/cn';
import Pagination from '../../../../components/ui/Pagination';

const SessionsTab = ({ courseId }) => {
    const [sessions, setSessions] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const sessionsPerPage = 8;

    useEffect(() => {
        const fetchSessions = async () => {
            if (!courseId) return;
            setIsLoading(true);
            try {
                const params = { status: filterStatus, page: currentPage };
                const response = await getCourseSessions(courseId, params);
                if (response.success) {
                    setSessions(response.data);
                    setPagination(response.meta);
                }
            } catch (error) {
                console.error("Failed to fetch sessions", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSessions();
    }, [courseId, filterStatus, currentPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [filterStatus]);

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed': return 'bg-green-100 text-green-800 border-green-200';
            case 'upcoming': return 'bg-blue-100 text-blue-800 border-blue-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-foreground">Course Sessions</h3>
                <div className="flex items-center space-x-1 bg-muted p-1 rounded-md">
                    <Button variant={filterStatus === '' ? 'default' : 'ghost'} size="sm" onClick={() => setFilterStatus('')}>All</Button>
                    <Button variant={filterStatus === 'Upcoming' ? 'default' : 'ghost'} size="sm" onClick={() => setFilterStatus('Upcoming')}>Upcoming</Button>
                    <Button variant={filterStatus === 'Completed' ? 'default' : 'ghost'} size="sm" onClick={() => setFilterStatus('Completed')}>Completed</Button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading details...</p>
                    </div>
                </div>
            ) : sessions.length === 0 ? (
                <div className="text-center py-12">
                    <Icon name="Clock" size={48} className="mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No sessions found for this filter.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {sessions.map((session, index) => (
                        <div key={session.id} className="bg-muted/30 rounded-lg p-4 border border-border/50 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-semibold text-foreground">Session #{pagination.from + index}</h4>
                                    <span className={cn('px-2 py-0.5 text-xs font-medium rounded-full border capitalize', getStatusColor(session.status))}>
                                        {session.status}
                                    </span>
                                </div>
                                <p className="text-sm font-bold text-primary">{new Date(session.date).toDateString()}</p>
                                <p className="text-xs text-muted-foreground">{session.start_time} - {session.end_time}</p>
                            </div>
                            <div className="border-t mt-3 pt-3 space-y-2 text-xs text-muted-foreground">
                                <div className="flex justify-between"><span>Duration:</span> <span className="font-medium text-foreground">{session.duration_in_minutes} mins</span></div>
                                <div className="flex justify-between"><span>Attendance:</span> <span className="font-medium text-foreground">{session.attendance_rate}% ({session.attendance_count})</span></div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Pagination meta={pagination} onPageChange={setCurrentPage} />
        </div>
    );
};

export default SessionsTab;