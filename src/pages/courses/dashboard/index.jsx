import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../components/ui/DashboardLayout.jsx";
import Input from "../../../components/ui/Input.jsx";
import Select from "../../../components/ui/Select.jsx";
import Button from "../../../components/ui/Button.jsx";
import { useDebounce } from "../../../hooks/useDebounce.js";
import Pagination from "../../../components/ui/Pagination.jsx";
import ConfirmationModal from "../../../components/ui/ConfirmationModal.jsx";
import CourseTable from './components/CourseTable';
import { getCourses, deleteCourse, exportCourses } from '../../../api/courseService';
import { getAllTrainers } from '../../../api/trainerService';
import { getAllCategories } from '../../../api/categoryService';
import { getCenters } from '../../../api/publicService';
const CoursesDashboard = () => {
    const navigate = useNavigate();
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [confirmationModal, setConfirmationModal] = useState({ isOpen: false });
    // Filter State
    const initialFilters = {
        search: '', level: 'all', status: 'all',
        category_name: '', trainer_name: '', center_name: ''
    };
    const [filters, setFilters] = useState(initialFilters);
    const [currentPage, setCurrentPage] = useState(1);
    const debouncedSearch = useDebounce(filters.search, 500);

    // API Data State
    const [courses, setCourses] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [isExporting, setIsExporting] = useState(false);

    const [filterData, setFilterData] = useState({ trainers: [], categories: [], centers: [] });
    useEffect(() => {
        const fetchFilterData = async () => {
            const [trainers, categories, centers] = await Promise.all([
                getAllTrainers(),
                getAllCategories(),
                getCenters()
            ]);
            setFilterData({ trainers, categories, centers });
        };
        fetchFilterData();
    }, []);

    const trainerOptions = useMemo(() => [
        { label: 'All Trainers', value: '' },
        ...filterData.trainers.map(t => ({ label: t.name, value: t.name }))
    ], [filterData.trainers]);

    const categoryOptions = useMemo(() => [
        { label: 'All Categories', value: '' },
        ...filterData.categories.map(c => ({ label: c.name, value: c.name }))
    ], [filterData.categories]);

    const centerOptions = useMemo(() => [
        { label: 'All Centers', value: '' },
        ...filterData.centers.map(c => ({ label: c.title, value: c.title }))
    ], [filterData.centers]);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: '', type: '' }), 5000);
    };

    const fetchCourses = useCallback(async () => {
        setIsLoading(true);
        try {
            const activeFilters = { ...filters, search: debouncedSearch, page: currentPage };
            Object.keys(activeFilters).forEach(key => {
                if (!activeFilters[key] || activeFilters[key] === 'all') {
                    delete activeFilters[key];
                }
            });

            const response = await getCourses(activeFilters);
            if (response.success) {
                setCourses(response.data);
                setPagination(response.meta);
            }
        } catch (error) {
            console.error("Failed to fetch courses", error);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, debouncedSearch, filters]);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setFilters(initialFilters);
        setCurrentPage(1);
    };

    // --- Table Action Handlers ---
    const handleViewDetails = (courseId) => navigate(`/courses/details/${courseId}`);
    const handleEditCourse = (courseId) => navigate(`/courses/details/${courseId}?mode=edit`);

    const handleDeleteCourse = (course) => {
        setConfirmationModal({
            isOpen: true,
            type: 'delete',
            title: 'Delete Course',
            message: `Are you sure you want to delete "${course.title}"? This action cannot be undone.`,
            onConfirm: async () => {
                try {
                    const response = await deleteCourse(course.id);
                    showNotification(response.message || 'Course deleted successfully.', 'success');
                    fetchCourses(); // Refresh the list
                } catch (error) {
                    showNotification(error.message || 'Failed to delete course.', 'error');
                } finally {
                    setConfirmationModal({ isOpen: false });
                }
            }
        });
    };

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const activeFilters = { ...filters, search: debouncedSearch };
            Object.keys(activeFilters).forEach(key => {
                if (activeFilters[key] === '' || activeFilters[key] === 'all') {
                    delete activeFilters[key];
                }
            });

            await exportCourses(activeFilters);
            showNotification('Course data is being downloaded.', 'success');
        } catch (error) {
            console.error("Export failed:", error);
            showNotification('Failed to export data. Please try again.', 'error');
        } finally {
            setIsExporting(false);
        }
    };

    // --- Filter Options ---
    const statusOptions = [
        { label: 'All Statuses', value: 'all' },
        { label: 'Submitted', value: 'Submitted' }, { label: 'Pending', value: 'Pending' },
        { label: 'Approved', value: 'Approved' }, { label: 'Rejected', value: 'Rejected' },
        { label: 'Published', value: 'Published' }, { label: 'Unpublished', value: 'Unpublished' }
    ];
    const levelOptions = [
        { label: 'All Levels', value: 'all' },
        { label: 'Beginner', value: 'Beginner' }, { label: 'Intermediate', value: 'Intermediate' },
        { label: 'Advanced', value: 'Advanced' }
    ];

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {notification.message && (
                    <div className={`p-4 rounded-md text-sm ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {notification.message}
                    </div>
                )}

                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Courses Management</h1>
                        <p className="text-muted-foreground mt-1">Oversee and manage all courses in the platform.</p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={handleExport}
                        disabled={isExporting}
                        iconName={isExporting ? 'Loader' : 'Download'}
                    >
                        {isExporting ? 'Exporting...' : 'Export Excel'}
                    </Button>
                </div>

                <div className="bg-card rounded-lg border p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Input placeholder="Search by title..." value={filters.search} onChange={e => handleFilterChange('search', e.target.value)} />
                        <Select value={filters.status} onChange={value => handleFilterChange('status', value)} options={statusOptions} />
                        <Select value={filters.level} onChange={value => handleFilterChange('level', value)} options={levelOptions} />
                        <Select
                            placeholder="Filter by Category"
                            value={filters.category_name}
                            onChange={value => handleFilterChange('category_name', value)}
                            options={categoryOptions}
                            searchable
                        />
                        <Select
                            placeholder="Filter by Trainer"
                            value={filters.trainer_name}
                            onChange={value => handleFilterChange('trainer_name', value)}
                            options={trainerOptions}
                            searchable
                        />
                        <Select
                            placeholder="Filter by Center"
                            value={filters.center_name}
                            onChange={value => handleFilterChange('center_name', value)}
                            options={centerOptions}
                            searchable
                        />
                        <Button variant="ghost" size="sm" onClick={clearFilters}>Clear</Button>
                    </div>
                    <div className="flex justify-end">
                    </div>
                </div>

                <CourseTable
                    courses={courses}
                    isLoading={isLoading}
                    onViewDetails={handleViewDetails}
                    onEditCourse={handleEditCourse}
                    onDeleteCourse={handleDeleteCourse}
                />

                <Pagination meta={pagination} onPageChange={setCurrentPage} />

                <ConfirmationModal isOpen={confirmationModal.isOpen} {...confirmationModal} onCancel={() => setConfirmationModal({ isOpen: false })} />
            </div>
        </DashboardLayout>
    );
};

export default CoursesDashboard;