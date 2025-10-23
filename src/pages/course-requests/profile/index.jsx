import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../../components/ui/DashboardLayout';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { getCourseRequestDetails, closeCourseRequest } from '../../../api/courseRequestService';
import GeneralInfoTab from './components/GeneralInfoTab';
import InterestedUsersTab from './components/InterestedUsersTab';
import ConfirmationModal from '../../../components/ui/ConfirmationModal';

const CourseRequestDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [request, setRequest] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('general');
    const [confirmationModal, setConfirmationModal] = useState({ isOpen: false });

    const fetchRequest = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getCourseRequestDetails(id);
            if (response.success) setRequest(response.data);
        } catch (error) {
            setRequest(null);
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchRequest();
    }, [fetchRequest]);

    const handleCloseRequest = () => {
        setConfirmationModal({
            isOpen: true, type: 'warning', title: 'Close Request',
            message: `Are you sure you want to close the course request "${request.course_topic}"?`,
            onConfirm: async () => {
                try {
                    await closeCourseRequest(id);
                    navigate('/course-requests/dashboard');
                } catch (error) {
                    // Show error notification
                } finally {
                    setConfirmationModal({ isOpen: false });
                }
            }
        });
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="space-y-6 animate-pulse">
                    <div className="flex justify-between items-center">
                        <div className="h-9 w-32 bg-gray-200 rounded-md"></div>
                        <div className="h-9 w-40 bg-gray-200 rounded-md"></div>
                    </div>
                    <div className="bg-card rounded-lg border">
                        <div className="h-14 border-b bg-gray-200"></div>
                        <div className="p-6 space-y-4">
                            <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
                            <div className="h-24 bg-gray-200 rounded-md"></div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (!request) {
        return (
            <DashboardLayout>
                <div className="text-center py-20">
                    <Icon name="SearchX" size={48} className="mx-auto text-destructive mb-4" />
                    <h3 className="text-xl font-semibold">Request Not Found</h3>
                    <p className="text-muted-foreground mb-6">The course demand you are looking for does not exist.</p>
                    <Button variant="outline" onClick={() => navigate('/course-requests/dashboard')} className="flex items-center gap-2">
                        <Icon name="ArrowLeft" /> Back to Requests
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <Button variant="ghost" onClick={() => navigate('/course-requests/dashboard')} className="flex items-center gap-2">
                        <Icon name="ArrowLeft"/> Back to Requests
                    </Button>
                    <Button variant="destructive" onClick={handleCloseRequest} iconName="Archive">Close Request</Button>
                </div>

                <div className="bg-card rounded-lg border">
                    <div className="border-b">
                        <nav className="flex space-x-8 px-6">
                            <button onClick={() => setActiveTab('general')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'general' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}>General Info</button>
                            <button onClick={() => setActiveTab('interested')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'interested' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}>Interested Users</button>
                        </nav>
                    </div>
                    {activeTab === 'general' && <GeneralInfoTab request={request} />}
                    {activeTab === 'interested' && <InterestedUsersTab requestId={id} />}
                </div>

                <ConfirmationModal isOpen={confirmationModal.isOpen} {...confirmationModal} onCancel={() => setConfirmationModal({ isOpen: false })} />
            </div>
        </DashboardLayout>
    );
};

export default CourseRequestDetails;