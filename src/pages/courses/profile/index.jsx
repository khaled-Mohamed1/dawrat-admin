import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import DashboardLayout from '../../../components/ui/DashboardLayout';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import CourseProfileHeader from './components/CourseProfileHeader';
import GeneralInfoTab from './components/GeneralInfoTab';
import { getCourseDetails, reviewCourse, updateCourse  } from '../../../api/courseService';
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
    const [originalCourse, setOriginalCourse] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [hasChanges, setHasChanges] = useState(false);
    const [generalError, setGeneralError] = useState('');

    const isEditMode = searchParams.get('mode') === 'edit';

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: '', type: '' }), 5000);
    };

    const fetchCourse = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getCourseDetails(id);
            if (response.success) {
                const courseData = response.data;
                console.log(courseData)
                if (courseData.discount_type === 'percentage') {
                    courseData.discount_type = 'P';
                } else if (courseData.discount_type === 'fixed') {
                    courseData.discount_type = 'F';
                }
                setCourse(courseData);
                setOriginalCourse(courseData);
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
    }, [id]);

    const handleSave = async () => {
        setIsSaving(true);
        setGeneralError('');
        const formattedSchedules = course.schedules.map(s => ({
            day: s.day,
            start_time: s.start_time.slice(0, 5),
            end_time: s.end_time.slice(0, 5),
        }));
        try {
            const payload = {
                title: course.title,
                description: course.description,
                details: course.details,
                level: course.level,
                language: course.language,
                price: course.price,
                discount_type: course.discount_type,
                discount: course.discount,
                start_date: course.start_date,
                end_date: course.end_date,
                duration: course.duration,
                total_hours: course.total_hours,
                capacity: course.capacity,
                session_mode: course.session_mode,
                address: course.address,
                category_ids: [course.category_id],
                schedules: formattedSchedules,
                draft: 0
            };
            await updateCourse(id, payload);
            setHasChanges(false);
            setSearchParams({}, { replace: true });
            fetchCourse();
            showNotification('Course updated successfully!', 'success');
        } catch (error) {
            if (error.status === 422 && error.errors) {
                setErrors(error.errors);
                setGeneralError(error.message || 'Please correct the errors below.');
            } else {
                setGeneralError(error.message || 'An unexpected error occurred.');
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setCourse(originalCourse);
        setHasChanges(false);
        setSearchParams({}, { replace: true });
    };

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
                        {isEditMode ? (
                            <>
                                <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                                <Button onClick={handleSave} disabled={!hasChanges || isSaving} iconName={isSaving ? 'Loader' : 'Save'}>
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </>
                        ) : (
                            <>
                                {(course.status === 'Pending' || course.status === 'Submitted') && (
                                    <>
                                        <Button variant="destructive" size="sm" onClick={() => handleReview('Rejected')} iconName="XCircle">Reject</Button>
                                        <Button variant="success" size="sm" onClick={() => handleReview('Approved')} iconName="CheckCircle">Approve</Button>
                                        <Button onClick={() => setSearchParams({ mode: 'edit' })} iconName="Edit">Edit Course</Button>
                                    </>
                                )}
                            </>
                        )}

                    </div>
                </div>

                {/* Profile Header */}
                <CourseProfileHeader course={course} />

                {generalError && <div className="p-4 rounded-md text-sm bg-red-100 text-red-800">{generalError}</div>}

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
                        {activeTab === 'general' && (
                            <GeneralInfoTab
                                course={course}
                                setCourse={setCourse}
                                isEditMode={isEditMode}
                                setHasChanges={setHasChanges}
                            />
                        )}

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