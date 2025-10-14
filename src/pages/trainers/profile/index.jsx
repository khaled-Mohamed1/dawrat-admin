import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import Button from "../../../components/ui/Button.jsx";
import Icon from "../../../components/AppIcon.jsx";
import DashboardLayout from "../../../components/ui/DashboardLayout.jsx";
import ProfileHeader from "./components/ProfileHeader.jsx";
import {getTrainerDetails, updateTrainer, sendTrainerReminder} from "../../../api/trainerService.js";
import GeneralInfoTab from "./components/GeneralInfoTab.jsx";
import KycTab from "./components/KycTab.jsx";
import CoursesTab from './components/CoursesTab.jsx';
import CentersTab from './components/CentersTab.jsx';
import ReviewsTab from './components/ReviewsTab.jsx';
import SubscriptionsTab from './components/SubscriptionsTab.jsx';
import InvoicesTab from './components/InvoicesTab.jsx';
import PayoutsTab from './components/PayoutsTab.jsx';

const TrainerProfile = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState('general');
    const [isEditMode, setIsEditMode] = useState(searchParams.get('mode') === 'edit');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [trainer, setTrainer] = useState(null);
    const [originalTrainer, setOriginalTrainer] = useState(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [isSendingReminder, setIsSendingReminder] = useState(false);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: '', type: '' }), 5000);
    };

    const fetchTrainerData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getTrainerDetails(id);
            if (response.success) {
                const trainerData = {
                    ...response.data,
                };
                setTrainer(trainerData);
                setOriginalTrainer(trainerData);
            }
        } catch (error) {
            console.error('Failed to fetch trainer', error);
            setTrainer(null);
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchTrainerData();
    }, [fetchTrainerData]);

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
                first_name_ar: trainer.first_name_ar,
                last_name_ar: trainer.last_name_ar,
                first_name_en: trainer.first_name_en,
                last_name_en: trainer.last_name_en,
                email: trainer.email,
                phone_code: trainer.phone?.phone_code,
                phone_number: trainer.phone?.phone_number,
                country_id: trainer.country_id,
                qualifications_en: trainer.qualifications_en,
                qualifications_ar: trainer.qualifications_ar,
            };

            await updateTrainer(id, payload);
            setHasChanges(false);
            setIsEditMode(false);
            fetchTrainerData();
            showNotification('Trainer details updated successfully.', 'success');
        } catch (error) {
            console.error('Error saving trainer:', error);
            showNotification(error.message || 'Failed to save changes. Please try again.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setTrainer(originalTrainer);
        setIsEditMode(false);
        setHasChanges(false);
    };

    const handleSendReminder = async () => {
        setIsSendingReminder(true);
        try {
            const response = await sendTrainerReminder(id);
            showNotification(response.message || 'Reminder sent successfully!', 'success');
        } catch (error) {
            showNotification(error.message || 'Failed to send reminder. Please try again.', 'error');
        } finally {
            setIsSendingReminder(false);
        }
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading trainer details...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (!trainer) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <Icon name="UserX" size={48} className="text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">Trainer Not Found</h3>
                        <p className="text-muted-foreground mb-4">The requested trainer could not be found.</p>
                        <Button onClick={() => navigate('/trainer/dashboard')}>
                            Back to Trainers
                        </Button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    const tabs = [
        { id: 'general', label: 'General Information', icon: 'User' },
        { id: 'kyc', label: 'KYC Information', icon: 'Landmark' },
        { id: 'courses', label: 'Courses', icon: 'BookOpen' },
        { id: 'centers', label: 'Centers', icon: 'Building' },
        { id: 'reviews', label: 'Reviews', icon: 'Star' },
        { id: 'subscriptions', label: 'Subscriptions', icon: 'CreditCard' },
        { id: 'invoices', label: 'Invoices', icon: 'FileText' },
        { id: 'payouts', label: 'Payouts', icon: 'DollarSign' },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-6">

                {notification.message && (
                    <div className={`p-4 rounded-md text-sm ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {notification.message}
                    </div>
                )}

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate('/trainers/dashboard')} // Make sure this path is correct
                            className="flex items-center gap-2"
                        >
                            <Icon name="ArrowLeft" size={16} />
                            Back to Trainers
                        </Button>
                        <div className="h-6 w-px bg-border"></div>
                        <h1 className="text-2xl font-bold text-foreground">Trainer Details</h1>
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
                            <>
                                {/* **NEW**: Send Reminder Button */}
                                <Button
                                    variant="outline"
                                    onClick={handleSendReminder}
                                    disabled={isSendingReminder}
                                    iconName={isSendingReminder ? 'Loader' : 'Bell'}
                                >
                                    {isSendingReminder ? 'Sending...' : 'Send Reminder'}
                                </Button>
                                <Button onClick={() => setIsEditMode(true)} iconName="Edit">
                                    Edit Trainer
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                {/* Profile Header */}
                <ProfileHeader trainer={trainer} />

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
                                trainer={trainer}
                                setTrainer={setTrainer}
                                isEditMode={isEditMode}
                                setHasChanges={setHasChanges}
                            />
                        )}

                        {activeTab === 'kyc' && (
                            <KycTab
                                trainer={trainer}
                            />
                        )}

                        {activeTab === 'courses' && (
                            <CoursesTab trainerId={trainer?.id} />
                        )}

                        {activeTab === 'centers' && (
                            <CentersTab trainerId={trainer?.id} />
                        )}

                        {activeTab === 'reviews' && (
                            <ReviewsTab trainerId={trainer?.id} />
                        )}

                        {activeTab === 'subscriptions' && (
                            <SubscriptionsTab trainerId={trainer?.id} />
                        )}

                        {activeTab === 'invoices' && (
                            <InvoicesTab trainerId={trainer?.id} />
                        )}

                        {activeTab === 'payouts' && (
                            <PayoutsTab trainerId={trainer?.id} />
                        )}

                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}

export default TrainerProfile