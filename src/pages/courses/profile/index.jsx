import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../components/ui/DashboardLayout';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import CourseProfileHeader from './components/CourseProfileHeader';
import GeneralInfoTab from './components/GeneralInfoTab';
import { getCourseDetails, reviewCourse } from '../../../api/courseService';
import SessionsTab from './components/SessionsTab';
import EnrollmentsTab from './components/EnrollmentsTab';
import ReviewsTab from './components/ReviewsTab';
import RejectionModal from './components/RejectionModal';

const CourseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('general');
    const [isLoading, setIsLoading] = useState(true);
    const [course, setCourse] = useState(null);
    const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
    const [notification, setNotification] = useState({ message: '', type: '' });

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: '', type: '' }), 5000);
    };

    const fetchCourse = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getCourseDetails(id);
            if (response.success) {
                setCourse(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch course details", error);
            setCourse(null);
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchCourse();
    }, [fetchCourse]);

    const handleReview = async (status) => {
        if (status === 'Rejected') {
            setIsRejectionModalOpen(true);
        } else {
            try {
                const response = await reviewCourse(id, { status: 'Approved' });
                showNotification(response.message || 'Course approved successfully.', 'success');
                fetchCourse();
            } catch (error) {
                showNotification(error.message || 'Failed to approve the course. Please try again.', 'error');
            }
        }
    };

    const handleRejectionSubmit = async (rejection_reason) => {
        try {
            const response = await reviewCourse(id, { status: 'Rejected', rejection_reason });
            showNotification(response.message || 'Course rejected successfully.', 'success');
            fetchCourse();
        } catch (error) {
            showNotification(error.message || 'Failed to reject the course. Please try again.', 'error');
        } finally {
            setIsRejectionModalOpen(false);
        }
    };


    const tabs = [
        { id: 'general', label: 'General Information', icon: 'Info' },
        { id: 'sessions', label: 'Sessions', icon: 'Clock' },
        { id: 'enrolments', label: 'Enrollments', icon: 'Users' },
        { id: 'reviews', label: 'Reviews', icon: 'Star' },
    ];

    if (isLoading) {
        return (
        <DashboardLayout>
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading course details...</p>
                </div>
            </div>
        </DashboardLayout>
    );

    }
    if (!course) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <Icon name="UserX" size={48} className="text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">Course Not Found</h3>
                        <p className="text-muted-foreground mb-4">The requested course could not be found.</p>
                        <Button onClick={() => navigate('/courses/dashboard')}>
                            Back to Courses
                        </Button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {notification.message && (
                    <div className={`p-4 rounded-md text-sm ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {notification.message}
                    </div>
                )}
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" onClick={() => navigate('/courses/dashboard')} className="flex items-center gap-2">
                            <Icon name="ArrowLeft" size={16} /> Back to Courses
                        </Button>
                    </div>
                    <div className="flex items-center gap-3">
                        {(course.status === 'Pending' || course.status === 'Submitted') && (
                            <>
                                <Button variant="destructive" size="sm" onClick={() => handleReview('Rejected')} iconName="XCircle">Reject</Button>
                                <Button variant="success" size="sm" onClick={() => handleReview('Approved')} iconName="CheckCircle">Approve</Button>
                                <Button onClick={() => navigate(`/courses/details/${id}?mode=edit`)} iconName="Edit">Edit Course</Button>
                            </>
                        )}
                    </div>
                </div>

                {/* Profile Header */}
                <CourseProfileHeader course={course} />

                {/* Tabs */}
                <div className="bg-card rounded-lg border overflow-hidden">
                    <div className="border-b">
                        <nav className="flex space-x-8 px-6">
                            {tabs.map((tab) => (
                                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                        className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
                                    <Icon name={tab.icon} size={16} /> {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="p-6">
                        {activeTab === 'general' && <GeneralInfoTab course={course} />}

                        {activeTab === 'sessions' && (
                            <SessionsTab courseId={course?.id} />
                        )}

                        {activeTab === 'enrolments' && (
                            <EnrollmentsTab courseId={course?.id} />
                        )}

                        {activeTab === 'reviews' && (
                            <ReviewsTab courseId={course?.id} />
                        )}
                    </div>

                </div>

                <RejectionModal
                    isOpen={isRejectionModalOpen}
                    onClose={() => setIsRejectionModalOpen(false)}
                    onSubmit={handleRejectionSubmit}
                />
            </div>
        </DashboardLayout>
    );
};

export default CourseDetails;