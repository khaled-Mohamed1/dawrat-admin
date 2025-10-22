import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../../components/ui/DashboardLayout';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { getPayoutDetails, lockPayout, sendPayout, retryPayout } from '../../../api/payoutService';

const PayoutDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [payout, setPayout] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [notification, setNotification] = useState({ message: '', type: '' });

    const fetchDetails = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getPayoutDetails(id);
            if (response.success) setPayout(response.data);
        } catch (error) {
            console.error("Failed to fetch details", error);
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchDetails();
    }, [fetchDetails]);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: '', type: '' }), 5000);
    };

    const handleAction = async (action, successMessage) => {
        setIsActionLoading(true);
        try {
            const response = await action(id);
            showNotification(response.message || successMessage, 'success');
            fetchDetails(); // Refresh data after action
        } catch (error) {
            showNotification(error.message || 'An error occurred.', 'error');
        } finally {
            setIsActionLoading(false);
        }
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="space-y-6 animate-pulse">
                    <div className="flex justify-between items-center">
                        <div className="h-9 w-32 bg-gray-200 rounded-md"></div>
                        <div className="h-9 w-36 bg-gray-200 rounded-md"></div>
                    </div>
                    <div className="bg-card rounded-lg border p-6">
                        <div className="h-7 w-1/2 bg-gray-200 rounded"></div>
                        <div className="h-4 w-1/3 bg-gray-200 rounded mt-2"></div>
                        <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t">
                            <div className="h-10 bg-gray-200 rounded"></div>
                            <div className="h-10 bg-gray-200 rounded"></div>
                            <div className="h-10 bg-gray-200 rounded"></div>
                            <div className="h-10 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                    <div className="bg-card rounded-lg border h-48"></div>
                </div>
            </DashboardLayout>
        );
    }

    if (!payout) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center text-center py-20">
                    <Icon name="SearchX" size={48} className="mx-auto text-destructive mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">Payout Batch Not Found</h3>
                    <p className="text-muted-foreground mb-6">The payout you are looking for does not exist.</p>
                    <Button variant="outline" onClick={() => navigate('/payouts/dashboard')} className="flex items-center gap-2">
                        <Icon name="ArrowLeft" size={16} /> Back to Payouts
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    const { batch_details, items } = payout;
    const status = batch_details.status.toLowerCase();

    return (
        <DashboardLayout>
            <div className="space-y-6">

                {notification.message && (
                    <div className={`p-4 rounded-md text-sm ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {notification.message}
                    </div>
                )}

                <div className="flex justify-between items-center">
                    <Button variant="ghost" onClick={() => navigate('/payouts/dashboard')}><Icon name="ArrowLeft"/> Back</Button>
                    <div className="flex gap-2">
                        {status === 'draft' && <Button onClick={() => handleAction(lockPayout, 'Batch locked successfully.')} disabled={isActionLoading} iconName="Lock">Lock Batch</Button>}
                        {status === 'locked' && <Button onClick={() => handleAction(sendPayout, 'Batch sent successfully.')} disabled={isActionLoading} iconName="Send">Send Batch</Button>}
                        {status === 'failed' && <Button variant="destructive" onClick={() => handleAction(retryPayout, 'Batch retry initiated.')} disabled={isActionLoading} iconName="RefreshCw">Retry Batch</Button>}
                    </div>
                </div>

                <div className="bg-card rounded-lg border p-6">
                    <h2 className="text-xl font-bold mb-1">Payout Batch #{batch_details.batch_id}</h2>
                    <p className="text-sm text-muted-foreground">Cutoff on {new Date(batch_details.cutoff_date).toLocaleString()}</p>
                    <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t">
                        <div><p className="text-sm text-muted-foreground">Status</p><p className="font-semibold">{batch_details.status}</p></div>
                        <div><p className="text-sm text-muted-foreground">Total Amount</p><p className="font-semibold">{batch_details.total_amount}</p></div>
                        <div><p className="text-sm text-muted-foreground">Trainers</p><p className="font-semibold">{batch_details.trainers}</p></div>
                        <div><p className="text-sm text-muted-foreground">Reference #</p><p className="font-mono text-xs">{batch_details.sent_ref || 'N/A'}</p></div>
                    </div>
                </div>

                <div className="bg-card rounded-lg border">
                    <table className="w-full">
                        <thead className="bg-muted/50">
                        <tr>
                            <th className="p-3 text-left font-medium text-sm">Trainer Name</th>
                            <th className="p-3 text-right font-medium text-sm">Payout Amount</th>
                        </tr>
                        </thead>
                        <tbody>
                        {items.map(item => (
                            <tr key={item.trainer_id} className="border-b last:border-b-0">
                                <td className="p-3 font-medium">{item.trainer_name}</td>
                                <td className="p-3 text-right font-semibold">{item.total_payout}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default PayoutDetails;