import React, { useState, useEffect, useCallback } from 'react';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/AppIcon';
import Input from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import Pagination from '../../../../components/ui/Pagination';
import { useDebounce } from '../../../../hooks/useDebounce';
import { getTrainerCourses } from '../../../../api/trainerService';
import { cn } from '../../../../utils/cn';

const CoursesTab = ({ trainerId }) => {
    const [courses, setCourses] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const initialFilters = {
        search: '', status: 'all', level: 'all',
        progress_status: 'all', sort_by: 'all'
    };
    const [filters, setFilters] = useState(initialFilters);
    const debouncedSearch = useDebounce(filters.search, 500);

    const fetchCourses = useCallback(async () => {
        if (!trainerId) return;
        setIsLoading(true);
        try {
            const activeFilters = { ...filters, search: debouncedSearch, page: currentPage };
            Object.keys(activeFilters).forEach(key => {
                if (activeFilters[key] === '' || activeFilters[key] === 'all') {
                    delete activeFilters[key];
                }
            });

            const response = await getTrainerCourses(trainerId, activeFilters);
            if (response.success) {
                setCourses(response.data);
                setPagination(response.meta);
            }
        } catch (error) {
            console.error("Failed to fetch trainer courses", error);
        } finally {
            setIsLoading(false);
        }
    }, [trainerId, currentPage, debouncedSearch, filters]);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    useEffect(() => {
        if (currentPage !== 1) {
            setCurrentPage(1);
        }
    }, [filters.search, filters.status, filters.level, filters.sort_by]);

    const getCourseStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'published':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'approved':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'submitted':
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'unpublished':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getTimingStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            case 'in-progress':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'not-started':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const clearFilters = () => {
        setFilters(initialFilters);
    };

    // Filter options
    const statusOptions = [
        { label: 'All Statuses', value: 'all' },
        { label: 'Published', value: 'Published' }, { label: 'Unpublished', value: 'Unpublished' },
        { label: 'Pending', value: 'Pending' }, { label: 'Approved', value: 'Approved' },
        { label: 'Rejected', value: 'Rejected' }, { label: 'Submitted', value: 'Submitted' }
    ];
    const progressStatusOptions = [
        { label: 'All Progress', value: 'all' },
        { label: 'Completed', value: 'completed' },
        { label: 'In Progress', value: 'in-progress' },
        { label: 'Not Started', value: 'not-started' }
    ];
    const levelOptions = [
        { label: 'All Levels', value: 'all' },
        { label: 'Beginner', value: 'Beginner' }, { label: 'Intermediate', value: 'Intermediate' },
        { label: 'Advanced', value: 'Advanced' }
    ];
    const sortOptions = [
        { label: 'Default Sort', value: 'all' },
        { label: 'Top Rated', value: 'top_rated' }, { label: 'Top Selling', value: 'top_selling' }
    ];

    return (
        <div className="space-y-6">
            {/* Filter Bar */}
            <div className="bg-muted/30 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
                    <div className="lg:col-span-2">
                        <Input placeholder="Search courses..." value={filters.search} onChange={e => handleFilterChange('search', e.target.value)} />
                    </div>
                    <Select value={filters.status} onChange={value => handleFilterChange('status', value)} options={statusOptions} />
                    <Select value={filters.progress_status} onChange={value => handleFilterChange('progress_status', value)} options={progressStatusOptions} />
                    <Select value={filters.level} onChange={value => handleFilterChange('level', value)} options={levelOptions} />
                    <Select value={filters.sort_by} onChange={value => handleFilterChange('sort_by', value)} options={sortOptions} />
                    <Button variant="destructive" size="sm" onClick={clearFilters}>Clear</Button>

                </div>
                <div className="flex justify-end mt-4">
                </div>
            </div>

            {/* Courses List */}
            {isLoading ? (
                <div className="flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading details...</p>
                    </div>
                </div>
            ) : courses.length === 0 ? (
                <div className="text-center py-12"><Icon name="BookOpen" size={48} className="mx-auto text-muted-foreground mb-4" /><p className="text-muted-foreground">No courses found for this trainer.</p></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map(course => (
                        <div key={course.id} className="bg-muted/30 rounded-lg overflow-hidden border border-border/50 flex flex-col">
                            <img src={course.file_url} alt={course.title} className="w-full h-40 object-cover" />
                            <div className="p-4 flex-grow flex flex-col">
                                <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-1 rounded-full self-start mb-2">{course.categories.join(', ')}</span>
                                <h4 className="font-semibold text-foreground flex-grow">{course.title}</h4>
                                <div className="flex items-center justify-between text-sm text-muted-foreground mt-3">
                                    <span>{course.level}</span>
                                    <div className="flex items-center gap-1 font-semibold text-yellow-500">
                                        <Icon name="Star" size={16} className="fill-current" />
                                        <span>{course.avg_rating.toFixed(1)}</span>
                                    </div>
                                </div>
                                <div className="border-t my-3"></div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className={cn('inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border capitalize', getCourseStatusColor(course.status))}>
                                            {course.status}
                                        </span>
                                        <span className={cn('inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border capitalize', getTimingStatusColor(course.timing_status))}>
                                            {course.timing_status.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground line-through">${course.price.toFixed(2)}</span>
                                        <span className="text-lg font-bold text-foreground">${course.final_price.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Pagination meta={pagination} onPageChange={setCurrentPage} />
        </div>
    );
};

export default CoursesTab;