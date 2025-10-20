import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../../components/ui/DashboardLayout';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { getContactSubmissionDetails } from '../../../api/contactUsService';

const InfoItem = ({ label, value }) => (
    <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-semibold text-foreground mt-1">{value || 'N/A'}</p>
    </div>
);

const ContactUsDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [submission, setSubmission] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getContactSubmissionDetails(id).then(res => {
            if (res.success) setSubmission(res.data);
        }).finally(() => setIsLoading(false));
    }, [id]);

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="space-y-6 animate-pulse">
                    <div className="h-9 w-40 bg-gray-200 rounded-md"></div>
                    <div className="bg-card rounded-lg border p-6">
                        <div className="p-6 border-b"><div className="h-7 w-1/3 bg-gray-200 rounded"></div></div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="h-10 bg-gray-200 rounded"></div>
                            <div className="h-10 bg-gray-200 rounded"></div>
                            <div className="h-10 bg-gray-200 rounded"></div>
                        </div>
                        <div className="p-6 border-t"><div className="space-y-2"><div className="h-4 bg-gray-200 rounded"></div><div className="h-4 w-5/6 bg-gray-200 rounded"></div></div></div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (!submission) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center text-center py-20">
                    <Icon name="SearchX" size={48} className="mx-auto text-destructive mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">Message Not Found</h3>
                    <p className="text-muted-foreground mb-6">The message you are looking for does not exist.</p>
                    <Button variant="outline" onClick={() => navigate('/contact-us/dashboard')} className="flex items-center gap-2">
                        <Icon name="ArrowLeft" size={16} /> Back to Messages
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <Button variant="ghost" onClick={() => navigate('/contact-us/dashboard')}><Icon name="ArrowLeft"/> Back to Messages</Button>

                <div className="bg-card rounded-lg border p-6">
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-bold">Message Details</h2>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <InfoItem label="From" value={submission.user.name} />
                        <InfoItem label="Email" value={submission.user.email} />
                        <InfoItem label="Phone" value={submission.user.phone_number} />
                        <InfoItem label="User Type" value={submission.type.charAt(0).toUpperCase() + submission.type.slice(1)} />
                    </div>
                    <div className="p-6 border-t">
                        <p className="text-sm text-muted-foreground mb-2">Message</p>
                        <p className="text-foreground whitespace-pre-wrap">{submission.message}</p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ContactUsDetails;