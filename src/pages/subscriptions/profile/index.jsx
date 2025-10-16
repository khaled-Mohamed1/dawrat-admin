import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../../components/ui/DashboardLayout.jsx";
import Button from "../../../components/ui/Button.jsx";
import Icon from "../../../components/AppIcon.jsx";
import { getSubscriptionDetails, addAddonToSubscription } from '../../../api/subscriptionService';
import SubscriptionFeatures from './components/SubscriptionFeatures';
import { cn } from '../../../utils/cn';

// Header Component
const SubscriptionProfileHeader = ({ subscription }) => {
    const formatDate = (dateString) => new Date(dateString).toLocaleString();
    const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
    const StatusBadge = ({ status }) => {
        const colorMap = {
            trial: 'bg-blue-100 text-blue-800', active: 'bg-green-100 text-green-800',
            expired: 'bg-gray-100 text-gray-800', paused: 'bg-yellow-100 text-yellow-800',
        };
        return <span className={cn('px-2.5 py-1 text-xs font-semibold rounded-full', colorMap[status?.toLowerCase()] || 'bg-gray-100')}>{status}</span>;
    };

    return (
        <div className="bg-card rounded-lg border p-6">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-bold">{subscription.subscription_plan.plan_tier} - {subscription.subscription_plan.plan_level}</h2>
                    <p className="text-muted-foreground">Subscribed by: <span className="font-medium text-foreground">{subscription.user}</span></p>
                </div>
                <StatusBadge status={subscription.status} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t">
                <div><p className="text-sm text-muted-foreground">Start Date</p><p className="font-semibold">{formatDate(subscription.start_date)}</p></div>
                <div><p className="text-sm text-muted-foreground">Next Renewal</p><p className="font-semibold">{formatDate(subscription.renewal_date)}</p></div>
                <div><p className="text-sm text-muted-foreground">Price</p><p className="font-semibold">{formatCurrency(subscription.subscription_plan.price)} / {subscription.subscription_plan.plan_type}</p></div>
            </div>
        </div>
    );
};


// Main Page Component
const SubscriptionDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [subscription, setSubscription] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [notification, setNotification] = useState({ message: '', type: '' });

    const fetchSubscription = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getSubscriptionDetails(id);
            if (response.success) {
                setSubscription(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch subscription", error);
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchSubscription();
    }, [fetchSubscription]);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: '', type: '' }), 5000);
    };

    const handleSaveAddons = async (updatedFeatures) => {
        setIsSaving(true);
        try {
            // Create an array of promises for each feature that needs to be updated
            const updatePromises = updatedFeatures.map(feature =>
                addAddonToSubscription(id, { feature_id: feature.id, amount: feature.amount })
            );

            // Wait for all updates to complete
            await Promise.all(updatePromises);

            showNotification('Addons updated successfully!', 'success');
            fetchSubscription();
        } catch (error) {
            showNotification('Failed to update one or more addons.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="space-y-6 animate-pulse">
                    {/* Header Skeleton */}
                    <div className="flex justify-between items-center">
                        <div className="h-9 w-44 bg-gray-200 rounded-md"></div>
                    </div>

                    {/* Profile Header Skeleton */}
                    <div className="bg-card rounded-lg border p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="h-7 w-48 bg-gray-200 rounded mb-2"></div>
                                <div className="h-4 w-64 bg-gray-200 rounded"></div>
                            </div>
                            <div className="h-7 w-20 bg-gray-200 rounded-full"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t">
                            <div className="h-10 bg-gray-200 rounded"></div>
                            <div className="h-10 bg-gray-200 rounded"></div>
                            <div className="h-10 bg-gray-200 rounded"></div>
                        </div>
                    </div>

                    {/* Features Skeleton */}
                    <div className="bg-card rounded-lg border p-6 space-y-4">
                        <div className="flex justify-between items-center">
                            <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
                            <div className="h-8 w-28 bg-gray-200 rounded-md"></div>
                        </div>
                        <div className="space-y-3">
                            <div className="h-16 bg-gray-200 rounded-lg"></div>
                            <div className="h-16 bg-gray-200 rounded-lg"></div>
                            <div className="h-16 bg-gray-200 rounded-lg"></div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (!subscription) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center text-center py-20">
                    <Icon name="AlertCircle" size={48} className="mx-auto text-destructive mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">Subscription Not Found</h3>
                    <p className="text-muted-foreground mb-6">
                        The subscription you are looking for does not exist or could not be loaded.
                    </p>
                    <Button
                        variant="outline"
                        onClick={() => navigate('/subscriptions/dashboard')}
                        className="flex items-center gap-2"
                    >
                        <Icon name="ArrowLeft" size={16} />
                        Back to Subscriptions
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
                    <Button variant="ghost" size="sm" onClick={() => navigate('/subscriptions/dashboard')} className="flex items-center gap-2">
                        <Icon name="ArrowLeft" size={16} /> Back to Subscriptions
                    </Button>
                </div>

                <SubscriptionProfileHeader subscription={subscription} />

                <SubscriptionFeatures
                    subscription={subscription}
                    onSave={handleSaveAddons}
                    isSaving={isSaving}
                />
            </div>
        </DashboardLayout>
    );
};

export default SubscriptionDetails;