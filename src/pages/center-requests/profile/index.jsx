import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../../components/ui/DashboardLayout';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { getCenterRequestDetails, approveCenterRequest, rejectCenterRequest } from '../../../api/centerRequestService';
import RejectionModal from './components/RejectionModal';

const InfoItem = ({ label, value, children }) => (
    <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className="font-semibold text-foreground mt-1">
            {children || value || 'N/A'}
        </div>
    </div>
);

const CenterRequestDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [request, setRequest] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
    const [notification, setNotification] = useState({ message: '', type: '' });

    useEffect(() => {
        getCenterRequestDetails(id).then(res => setRequest(res.data)).finally(() => setIsLoading(false));
    }, [id]);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: '', type: '' }), 5000);
    };

    const handleApprove = async () => {
        setIsActionLoading(true);
        try {
            const response = await approveCenterRequest(id);
            showNotification(response.message || 'Request approved successfully.', 'success');
            navigate('/center-requests/dashboard');
        } catch (error) {
            showNotification(error.message || 'Failed to approve request.', 'error');
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleReject = async (rejection_reason) => {
        setIsActionLoading(true);
        try {
            const response = await rejectCenterRequest(id, { rejection_reason });
            showNotification(response.message || 'Request rejected successfully.', 'success');
            navigate('/center-requests/dashboard');
        } catch (error) {
            showNotification(error.message || 'Failed to reject request.', 'error');
        } finally {
            setIsActionLoading(false);
            setIsRejectionModalOpen(false);
        }
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="space-y-6 animate-pulse">
                    <div className="flex justify-between items-center">
                        <div className="h-9 w-32 bg-gray-200 rounded-md"></div>
                        <div className="flex gap-2"><div className="h-9 w-24 bg-gray-200 rounded-md"></div><div className="h-9 w-24 bg-gray-200 rounded-md"></div></div>
                    </div>
                    <div className="bg-card rounded-lg border">
                        <div className="p-6 border-b h-24 bg-gray-200"></div>
                        <div className="p-6 grid grid-cols-2 gap-6">
                            <div className="h-10 bg-gray-200 rounded"></div><div className="h-10 bg-gray-200 rounded"></div>
                            <div className="h-10 bg-gray-200 rounded"></div><div className="h-10 bg-gray-200 rounded"></div>
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
                    <p className="text-muted-foreground mb-6">The center registration request could not be found.</p>
                    <Button variant="outline" onClick={() => navigate('/center-requests/dashboard')} className="flex items-center gap-2">
                        <Icon name="ArrowLeft" /> Back to Requests
                    </Button>
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

                <div className="flex justify-between items-center">
                    <Button variant="ghost" onClick={() => navigate('/center-requests/dashboard')}><Icon name="ArrowLeft"/> Back</Button>
                    <div className="flex gap-2">
                        <Button variant="destructive" onClick={() => setIsRejectionModalOpen(true)} disabled={isActionLoading} iconName="XCircle">Reject</Button>
                        <Button variant="success" onClick={handleApprove} disabled={isActionLoading} iconName="CheckCircle">Approve</Button>
                    </div>
                </div>

                <div className="bg-card rounded-lg border">
                    <div className="p-6 border-b flex items-center gap-4">
                        <img src={request.logo} alt="Logo" className="w-16 h-16 object-contain rounded-md" />
                        <div>
                            <h2 className="text-xl font-bold">{request.center_name}</h2>
                            <p className="text-sm text-muted-foreground">{request.registration_number}</p>
                        </div>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InfoItem label="Email" value={request.email} />
                        <InfoItem label="Phone" value={`${request.phone.phone_code} ${request.phone.phone_number}`} />
                        <InfoItem label="Country" value={request.country.name} />
                        <InfoItem label="Website">
                            <a href={request.website_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                {request.website_url}
                            </a>
                        </InfoItem>
                        <div className="col-span-2">
                            <p className="text-sm text-muted-foreground">Categories</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {request.categories.map(cat => <span key={cat.id} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{cat.name}</span>)}
                            </div>
                        </div>
                        <div className="col-span-2">
                            <p className="text-sm text-muted-foreground">Documents</p>
                            <div className="flex gap-4 mt-2">
                                <a href={request.registrationDocument} target="_blank" rel="noopener noreferrer"><Button variant="outline" size="sm" iconName="FileText">Registration Doc</Button></a>
                                <a href={request.SampleCourseOutline} target="_blank" rel="noopener noreferrer"><Button variant="outline" size="sm" iconName="FileText">Sample Outline</Button></a>
                            </div>
                        </div>
                    </div>
                </div>

                 <RejectionModal isOpen={isRejectionModalOpen} onClose={() => setIsRejectionModalOpen(false)} onSubmit={handleReject} />
            </div>
        </DashboardLayout>
    );
};

export default CenterRequestDetails;