import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../../components/ui/DashboardLayout';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { getRevenueDetails } from '../../../api/revenueService';

const RevenueDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [details, setDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getRevenueDetails(id).then(res => {
            if (res.success) setDetails(res.data);
        }).finally(() => setIsLoading(false));
    }, [id]);
    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="space-y-6 animate-pulse">
                    <div className="flex justify-between items-center">
                        <div className="h-9 w-40 bg-gray-200 rounded-md"></div>
                        <div className="h-9 w-36 bg-gray-200 rounded-md"></div>
                    </div>
                    <div className="bg-card rounded-lg border p-6">
                        <div className="h-7 w-1/2 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
                        <div className="mt-6 border-t pt-4 space-y-2">
                            <div className="h-8 bg-gray-200 rounded"></div>
                            <div className="h-8 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (!details) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center text-center py-20">
                    <Icon name="SearchX" size={48} className="mx-auto text-destructive mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">Revenue Details Not Found</h3>
                    <p className="text-muted-foreground mb-6">The details for this order could not be loaded.</p>
                    <Button
                        variant="outline"
                        onClick={() => navigate('/revenue/dashboard')}
                        className="flex items-center gap-2"
                    >
                        <Icon name="ArrowLeft" size={16} />
                        Back to Revenue
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <Button variant="ghost" onClick={() => navigate('/revenue/dashboard')}><Icon name="ArrowLeft"/> Back to Revenue</Button>
                    {details.order_link && <Button onClick={() => navigate(details.order_link)}>View Full Order</Button>}
                </div>
                <div className="bg-card rounded-lg border p-6">
                    <h2 className="text-xl font-bold mb-1">Revenue for Order #{details.order_number}</h2>
                    <p className="text-sm text-muted-foreground">Date: {new Date(details.date).toLocaleDateString()}</p>
                    <div className="mt-6 border-t">
                        <table className="w-full">
                            <thead className="text-sm text-muted-foreground">
                            <tr>
                                <th className="py-2 text-left font-medium">Course Title</th>
                                <th className="py-2 text-right font-medium">Price</th>
                                <th className="py-2 text-right font-medium">Commission</th>
                                <th className="py-2 text-right font-medium">Net Amount</th>
                            </tr>
                            </thead>
                            <tbody>
                            {details.commission_breakdown.map((item, index) => (
                                <tr key={index} className="border-t">
                                    <td className="py-3 font-medium">{item.course.title}</td>
                                    <td className="py-3 text-right">{formatCurrency(item.price)}</td>
                                    <td className="py-3 text-right">{formatCurrency(item.commission.amount)} ({item.commission.rate}%)</td>
                                    <td className="py-3 text-right font-semibold">{formatCurrency(item.net_amount)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default RevenueDetails;