import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/ui/DashboardLayout';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import ProfileHeader from './components/ProfileHeader';
import GeneralInfoTab from './components/GeneralInfoTab';
import CoursesTab from './components/CoursesTab';
import InvoicesTab from './components/InvoicesTab';
import { getStudentDetails, updateStudentDetails } from '../../api/studentService';

const StudentDetails = () => {
    const { id } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('general');
    const [isEditMode, setIsEditMode] = useState(searchParams.get('mode') === 'edit');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [student, setStudent] = useState(null);
    const [originalStudent, setOriginalStudent] = useState(null);
    const [hasChanges, setHasChanges] = useState(false);

    // Mock student data
    const fetchStudentData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getStudentDetails(id);
            if (response.success) {
                const studentData = {
                    ...response.data,
                    fullName: response.data.name,
                    avatar: response.data.file_url,
                    phone: response.data.phone,
                    birthdate: response.data.date_of_birth,
                    registrationDate: response.data.created_at,
                    lastLogin: response.data.last_login_at,
                    country: response.data.country?.name,   // For display in View Mode
                    country_id: response.data.country?.id,
                };
                setStudent(studentData);
                setOriginalStudent(studentData); // Keep a backup for cancel
            }
        } catch (error) {
            console.error('Failed to fetch student', error);
            setStudent(null); // Set to null on error to show "Not Found" message
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchStudentData();
    }, [fetchStudentData]);
    
    // Update URL when edit mode changes
    useEffect(() => {
        const newParams = new URLSearchParams(searchParams);
        if (isEditMode) {
            newParams.set('mode', 'edit');
        } else {
            newParams.delete('mode');
        }
        setSearchParams(newParams, { replace: true });
    }, [isEditMode, searchParams, setSearchParams]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const payload = {
                name: student.name,
                email: student.email,
                country_id: student.country_id,
                phone_number: student.phone.phone_number,
                phone_code: student.phone.phone_code,
            };                   
            
            await updateStudentDetails(id, payload);
            setHasChanges(false);
            setIsEditMode(false);
            fetchStudentData(); // Refetch to get the freshest data
            // TODO: Show a success notification
        } catch (error) {
            console.error('Error saving student:', error);
            // TODO: Show an error notification
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setStudent(originalStudent);
        setIsEditMode(false);
        setHasChanges(false);
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading student details...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (!student) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <Icon name="UserX" size={48} className="text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">Student Not Found</h3>
                        <p className="text-muted-foreground mb-4">The requested student could not be found.</p>
                        <Button onClick={() => navigate('/student-dashboard')}>
                            Back to Students
                        </Button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    const tabs = [
        { id: 'general', label: 'General Information', icon: 'User' },
        { id: 'courses', label: 'Courses', icon: 'BookOpen' },
        { id: 'invoices', label: 'Invoices', icon: 'FileText' }
    ];

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate('/student-dashboard')}
                            className="flex items-center gap-2"
                        >
                            <Icon name="ArrowLeft" size={16} />
                            Back to Students
                        </Button>
                        <div className="h-6 w-px bg-border"></div>
                        <h1 className="text-2xl font-bold text-foreground">Student Details</h1>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                        {isEditMode ? (
                            <>
                                <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                                <Button onClick={handleSave} disabled={!hasChanges || isSaving} iconName="Save">
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </>
                        ) : (
                            <Button onClick={() => setIsEditMode(true)} iconName="Edit">Edit Student</Button>
                        )}
                    </div>
                </div>

                {/* Profile Header */}
                <ProfileHeader student={student} />

                {/* Tabs */}
                <div className="bg-card rounded-lg border border-border overflow-hidden">
                    <div className="border-b border-border">
                        <nav className="flex space-x-8 px-6" aria-label="Tabs">
                            {tabs?.map((tab) => (
                                <button
                                    key={tab?.id}
                                    onClick={() => setActiveTab(tab?.id)}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                                        activeTab === tab?.id
                                            ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                                    }`}
                                >
                                    <Icon name={tab?.icon} size={16} />
                                    {tab?.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {activeTab === 'general' && (
                            <GeneralInfoTab
                                student={student}
                                setStudent={setStudent}
                                isEditMode={isEditMode}
                                setHasChanges={setHasChanges}
                            />
                        )}

                        {activeTab === 'courses' && (
                            <CoursesTab
                                studentId={student?.id}
                            />
                        )}

                        {activeTab === 'invoices' && (
                            <InvoicesTab
                                studentId={student?.id}
                            />
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default StudentDetails;