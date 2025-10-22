import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../../components/ui/DashboardLayout';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { getCommissionDetails } from '../../../api/commissionService';

const InfoItem = ({ label, value }) => (
    <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-semibold text-foreground mt-1">{value || 'N/A'}</p>
    </div>
);

const CommissionDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [commission, setCommission] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getCommissionDetails(id).then(res => {
            if (res.success) setCommission(res.data);
        }).finally(() => setIsLoading(false));
    }, [id]);

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="space-y-6 animate-pulse">
                    <div className="h-9 w-40 bg-gray-200 rounded-md"></div>
                    <div className="bg-card rounded-lg border p-6">
                        <div className="h-7 w-1/2 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
                        <div className="grid grid-cols-2 gap-6 mt-6 pt-6 border-t">
                            <div className="h-10 bg-gray-200 rounded"></div>
                            <div className="h-10 bg-gray-200 rounded"></div>
                            <div className="h-10 bg-gray-200 rounded"></div>
                            <div className="h-10 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (!commission) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center text-center py-20">
                    <Icon name="SearchX" size={48} className="mx-auto text-destructive mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">Commission Data Not Found</h3>
                    <p className="text-muted-foreground mb-6">
                        The commission details for this user could not be loaded.
                    </p>
                    <Button
                        variant="outline"
                        onClick={() => navigate('/commissions/dashboard')}
                        className="flex items-center gap-2"
                    >
                        <Icon name="ArrowLeft" size={16} />
                        Back to Commissions
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString() : 'N/A';

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <Button variant="ghost" onClick={() => navigate('/commissions/dashboard')}><Icon name="ArrowLeft"/> Back to Commissions</Button>
                <div className="bg-card rounded-lg border p-6">
                    <h2 className="text-xl font-bold mb-1">Commission for: {commission.user_name}</h2>
                    <p className="text-sm text-muted-foreground">User ID: {commission.user_id}</p>
                    <div className="grid grid-cols-2 gap-6 mt-6 pt-6 border-t">
                        <InfoItem label="Plan" value={commission.plan} />
                        <InfoItem label="Platform Commission" value={`${commission.platform_percentage}%`} />
                        <InfoItem label="Effective From" value={formatDate(commission.effective_from)} />
                        <InfoItem label="Effective To" value={formatDate(commission.effective_to)} />
                        <InfoItem label="Status" value={commission.status || 'N/A'} />
                        <InfoItem label="Is Accepted Finance" value={commission.is_accepted_finance ? 'Yes' : 'No'} />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CommissionDetails;