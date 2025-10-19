import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../../components/ui/DashboardLayout.jsx";
import Button from "../../../components/ui/Button.jsx";
import Icon from "../../../components/AppIcon.jsx";
import { getOrderDetails, downloadOrderInvoice } from '../../../api/orderService';

const InfoCard = ({ title, icon, children }) => (
    <div className="bg-card rounded-lg border p-6">
        <div className="flex items-center gap-3 mb-4">
            <Icon name={icon} size={20} className="text-primary" />
            <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <div className="space-y-3">{children}</div>
    </div>
);

const InfoItem = ({ label, value }) => (
    <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium text-foreground">{value}</span>
    </div>
);

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getOrderDetails(id).then(res => {
            if (res.success) setOrder(res.data);
        }).catch(console.error).finally(() => setIsLoading(false));
    }, [id]);

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="space-y-6 animate-pulse">
                    {/* Header Skeleton */}
                    <div className="flex justify-between items-center">
                        <div className="h-9 w-40 bg-gray-200 rounded-md"></div>
                        <div className="h-9 w-44 bg-gray-200 rounded-md"></div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="h-64 bg-gray-200 rounded-lg"></div>
                            <div className="h-48 bg-gray-200 rounded-lg"></div>
                        </div>
                        <div className="space-y-6">
                            <div className="h-32 bg-gray-200 rounded-lg"></div>
                            <div className="h-40 bg-gray-200 rounded-lg"></div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (!order) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center text-center py-20">
                    <Icon name="SearchX" size={48} className="mx-auto text-destructive mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">Order Not Found</h3>
                    <p className="text-muted-foreground mb-6">
                        The order you are looking for does not exist or could not be loaded.
                    </p>
                    <Button
                        variant="outline"
                        onClick={() => navigate('/orders/dashboard')}
                        className="flex items-center gap-2"
                    >
                        <Icon name="ArrowLeft" size={16} />
                        Back to Orders
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" onClick={() => navigate('/orders/dashboard')}><Icon name="ArrowLeft"/> Back to Orders</Button>
                        <div>
                            <h1 className="text-2xl font-bold">Order #{order.order_number}</h1>
                            <p className="text-sm text-muted-foreground">Placed on {new Date(order.created_at).toLocaleString()}</p>
                        </div>
                    </div>
                    <Button iconName="Download" onClick={() => downloadOrderInvoice(order.id)}>Download Invoice</Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content (Left) */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Items */}
                        <InfoCard title="Order Items" icon="ShoppingCart">
                            {order.items.map(item => (
                                <div key={item.id} className="flex items-center gap-4 p-3 bg-muted/50 rounded-md">
                                    <img src={item.course.file_url} alt={item.course.title} className="w-16 h-16 object-cover rounded" />
                                    <div className="flex-1">
                                        <p className="font-semibold">{item.course.title}</p>
                                        <p className="text-xs text-muted-foreground">{item.course.trainer_name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">{formatCurrency(item.grand_total_price)}</p>
                                        {item.total_price_discount > 0 && <p className="text-xs text-muted-foreground line-through">{formatCurrency(item.total_price)}</p>}
                                    </div>
                                </div>
                            ))}
                        </InfoCard>

                        {/* Trainer Earnings */}
                        <InfoCard title="Trainer Earnings" icon="Users">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead><tr className="border-b"><th className="pb-2 text-left font-medium">Trainer</th><th className="pb-2 text-right font-medium">Net Earning</th></tr></thead>
                                    <tbody>
                                    {order.trainer_earnings.map((earning, i) => (
                                        <tr key={i} className="border-b last:border-b-0"><td className="py-2">{earning.trainer_name}</td><td className="py-2 text-right font-semibold">{formatCurrency(earning.trainer_net_earning)}</td></tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </InfoCard>
                    </div>

                    {/* Sidebar (Right) */}
                    <div className="space-y-6">
                        {/* User Details */}
                        <InfoCard title="Customer" icon="User">
                            <InfoItem label="Name" value={order.user.name} />
                            <InfoItem label="Email" value={order.user.email} />
                            <InfoItem label="Phone" value={`${order.user.phone.phone_code} ${order.user.phone.phone_number}`} />
                        </InfoCard>

                        {/* Pricing Summary */}
                        <InfoCard title="Pricing" icon="DollarSign">
                            <InfoItem label="Subtotal" value={formatCurrency(order.total_price)} />
                            <InfoItem label="Discount" value={`-${formatCurrency(order.total_price_discount)}`} />
                            <InfoItem label="VAT (15%)" value={formatCurrency(order.vat)} />
                            <div className="border-t my-2"></div>
                            <InfoItem label="Grand Total" value={formatCurrency(order.grand_total_price)} />
                        </InfoCard>

                        {/* Transaction */}
                        <InfoCard title="Transaction" icon="CreditCard">
                            <InfoItem label="Transaction ID" value={order.invoice.transaction.transaction_number} />
                            <InfoItem label="Payment Method" value={order.payment_method} />
                            <InfoItem label="Status" value={order.invoice.transaction.status} />
                            <InfoItem label="Date" value={new Date(order.invoice.transaction.created_at).toLocaleString()} />
                        </InfoCard>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default OrderDetails;