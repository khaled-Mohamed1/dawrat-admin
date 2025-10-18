import React, { useState, useEffect, useCallback } from 'react';
import Button from '../../../../components/ui/Button';
import Icon from '../../.././../components/AppIcon';
import Pagination from '../../../../components/ui/Pagination';
import { getStudentEnrollments, getStudentFavorites, getStudentCourseDemands } from '../../../../api/studentService';

const CoursesTab = ({ studentId }) => {
    const [activeSection, setActiveSection] = useState('enrollments');
    const [activeData, setActiveData] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    const fetchDataForActiveSection = useCallback(async () => {
        if (!studentId) return;

        setIsLoading(true);
        let response;

        try {
            if (activeSection === 'enrollments') {
                response = await getStudentEnrollments(studentId, currentPage);
            } else if (activeSection === 'favorites') {
                response = await getStudentFavorites(studentId, currentPage);
            } else if (activeSection === 'demands') {
                response = await getStudentCourseDemands(studentId, currentPage);
            }

            if (response && response.success) {
                const data = activeSection === 'favorites'
                    ? response.data.map(fav => fav.favorable)
                    : response.data;

                setActiveData(data);
                setPagination(response.meta);
            }
        } catch (error) {
            console.error(`Failed to fetch ${activeSection}`, error);
            setActiveData([]);
            setPagination(null);
        } finally {
            setIsLoading(false);
        }
    }, [studentId, activeSection, currentPage]);

    useEffect(() => {
        fetchDataForActiveSection();
    }, [fetchDataForActiveSection]);

    // Reset to page 1 whenever the tab changes
    useEffect(() => {
        setCurrentPage(1);
    }, [activeSection]);

    const getDemandStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'accepted':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'submitted':
            case 'interested':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'closed':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };
    
    const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800 border-green-200';
            case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'not-started': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        }
    };

    const handleCourseClick = (courseId) => {
        // Navigate to course details
        console.log('Navigate to course:', courseId);
    };

    const handleDemandClick = (demandId) => {
        // Navigate to course demand details
        console.log('Navigate to demand:', demandId);
    };

    return (
        <div className="space-y-6">
            {/* Section Tabs */}
            <div className="flex">
                <Button variant={activeSection === 'enrollments' ? 'default' : 'ghost'} onClick={() => setActiveSection('enrollments')}>Enrolled Courses</Button>
                <Button variant={activeSection === 'favorites' ? 'default' : 'ghost'} onClick={() => setActiveSection('favorites')}>Favorite Courses</Button>
                <Button variant={activeSection === 'demands' ? 'default' : 'ghost'} onClick={() => setActiveSection('demands')}>Course Demands</Button>
            </div>

            {isLoading ? (
                // Single Skeleton Loader for all tabs
                <div className="flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading details...</p>
                    </div>
                </div>
            ) : activeData.length === 0 ? (
                <div className="text-center py-8">
                    <Icon name={
                        activeSection === 'enrollments' ? 'BookOpen' :
                            activeSection === 'favorites' ? 'Heart' : 'MessageSquare'
                    } size={48} className="text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No {activeSection} found.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Render content based on activeSection */}
                    {activeSection === 'enrollments' && activeData.map(enrollment => (
                        <div key={enrollment.id} className="bg-muted/30 rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                             onClick={() => handleCourseClick(enrollment.id)}>{
                            <div className="flex items-start gap-4">
                                <img src={enrollment.file_url} alt={enrollment.title} className="w-24 h-24 object-cover rounded-md" />
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-medium text-foreground mb-1">{enrollment.title}</h4>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1"><Icon name="Tag" size={14} />{enrollment.category}</span>
                                                <span className="flex items-center gap-1"><Icon name="User" size={14} />{enrollment.trainer_name}</span>
                                            </div>
                                        </div>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${getStatusColor(enrollment.status)}`}>
                                                    {enrollment.status.replace('-', ' ')}
                                                </span>
                                    </div>
                                    <div className="flex justify-end items-center mt-4 pb-3 border-b border-border/50">
                                        <div className="text-right">
                                            <div className="font-medium text-foreground">{formatCurrency(enrollment.final_price)}</div>
                                            {enrollment.price > enrollment.final_price && (
                                                <div className="text-xs text-muted-foreground line-through">{formatCurrency(enrollment.price)}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }</div>
                    ))}
                    {activeSection === 'favorites' && activeData.map(course => (
                        <div key={course.id} className="bg-muted/30 rounded-lg p-4 hover:bg-muted/50 transition-colors">{
                            <div className="flex items-start gap-4">
                                <img src={course.file_url} alt={course.title} className="w-24 h-24 object-cover rounded-md" />
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-medium text-foreground mb-1">{course.title}</h4>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1"><Icon name="Tag" size={14} />{course.category}</span>
                                                <span className="flex items-center gap-1"><Icon name="User" size={14} />{course.trainer_name}</span>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                                            <Icon name="Heart" size={16} className="fill-current" />
                                        </Button>
                                    </div>
                                    <div className="flex justify-end items-center mt-4 pb-3 border-b border-border/50">
                                        <div className="text-right">
                                            <div className="font-medium text-foreground">{formatCurrency(course.final_price)}</div>
                                            {course.price > course.final_price && (
                                                <div className="text-xs text-muted-foreground line-through">{formatCurrency(course.price)}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }</div>
                    ))}
                    {activeSection === 'demands' && activeData.map(demand => (
                        <div key={demand.id} className="bg-muted/30 rounded-lg p-4 hover:bg-muted/50 transition-colors">{
                            <div className="flex justify-between items-startborder-border/50 border-b-2 pb-3">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Icon name="MessageSquare" size={20} className="text-yellow-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-foreground mb-1">{demand.course_topic}</h4>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1"><Icon name="Tag" size={14} />{demand.categories}</span>
                                            <span className="flex items-center gap-1"><Icon name="BarChart" size={14} />{demand.course_level}</span>
                                            <span className="flex items-center gap-1"><Icon name={demand.course_location === 'Onsite' ? 'MapPin' : 'Monitor'} size={14} />{demand.course_location}</span>
                                            <span className="flex items-center gap-1"><Icon name="Users" size={14} />{demand.interested_users_count} interested</span>
                                        </div>
                                    </div>
                                </div>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${getDemandStatusColor(demand.status)}`}>
                                            {demand.status}
                                        </span>
                            </div>
                        }</div>
                    ))}
                </div>
            )}

            {/* Single Pagination for all tabs */}
            <div className="mt-6">
                <Pagination meta={pagination} onPageChange={setCurrentPage} />
            </div>
        </div>
    );
};

export default CoursesTab;