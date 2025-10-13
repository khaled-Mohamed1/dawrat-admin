import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const OrdersTable = ({ ordersData = [], isLoading, timeFilterRevenue }) => {
    const [showAll, setShowAll] = useState(false);

    // Slice the array based on the showAll state
    const ordersToDisplay = showAll ? ordersData : ordersData.slice(0, 5);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'bg-green-100 text-green-700 border-green-200';
            case 'Processing': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Cancelled': return 'bg-gray-100 text-gray-700 border-gray-200';
            case 'Failed': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    // Helper to format currency
    const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);

    return (
        <div className="bg-card rounded-lg border p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-foreground">Latest Orders</h3>
                <div className="text-sm text-muted-foreground">
                    {timeFilterRevenue === 'week' ? 'This Week' : 'This Month'}
                </div>
            </div>

            <div className="space-y-4 flex-grow">
                {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-20 bg-gray-200 rounded-lg animate-pulse" />)
                ) : ordersToDisplay.length > 0 ? (
                    ordersToDisplay.map((order) => (
                        <div key={order.order_number} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="font-medium text-foreground text-sm">{order.order_number}</div>
                                    <div className="text-lg font-bold text-foreground">{formatCurrency(order.amount)}</div>
                                </div>
                                <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                                    <span>{order.student_name}</span>
                                    <span>•</span>
                                    <span>{order.date}</span>
                                    <span>•</span>
                                    <span>{order.items_count} items</span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 ml-4">
                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(order.status)}`}>
                                    {order.status}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-muted-foreground py-10">No orders found for this period.</div>
                )}
            </div>

            {ordersData.length > 5 && (
                <div className="mt-6 text-center">
                    <Button variant="outline" size="sm" onClick={() => setShowAll(!showAll)}>
                        {showAll ? 'Show Less' : `Show ${ordersData.length - 5} More`}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default OrdersTable;