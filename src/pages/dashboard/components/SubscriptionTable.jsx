import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

// **UPDATED**: Component now accepts 'summaryTable' as a prop
const SubscriptionTable = ({ summaryTable = [] }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Use the prop 'summaryTable' instead of a mock array
    const subscriptions = summaryTable;

    const totalPages = Math.ceil(subscriptions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentSubscriptions = subscriptions.slice(startIndex, startIndex + itemsPerPage);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'Canceled':
                return 'bg-red-100 text-red-700 border-red-200';
            case 'Expired':
                return 'bg-gray-100 text-gray-700 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const formatPrice = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    if (!summaryTable) {
        return (
            <div className="bg-card rounded-lg border border-border p-6">
                <p className="text-muted-foreground text-center py-8">Loading subscriptions...</p>
            </div>
        );
    }

    return (
        <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="text-lg font-medium text-foreground">Subscription Summary</h3>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                    <tr className="border-b border-border">
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Owner</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Plan</th>
                        <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Price</th>
                        <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">Start Date</th>
                        <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">End Date</th>
                        <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
                        <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentSubscriptions?.map((subscription) => (
                        <tr key={subscription?.id} className="border-b border-border">
                            <td className="py-4 px-2">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                        <Icon name="User" size={14} color="white" />
                                    </div>
                                    <div className="font-medium text-foreground text-sm">{subscription?.owner}</div>
                                </div>
                            </td>
                            <td className="py-4 px-2">
                                <div className="text-sm text-foreground">{subscription.plan}</div>
                            </td>
                            <td className="py-4 px-2 text-right">
                                {/* **UPDATED**: Format the price from the API */}
                                <div className="text-sm font-medium text-foreground">{formatPrice(subscription.price)}</div>
                            </td>
                            <td className="py-4 px-2 text-center">
                                <div className="text-sm text-muted-foreground">{subscription.start_date}</div>
                            </td>
                            <td className="py-4 px-2 text-center">
                                <div className="text-sm text-muted-foreground">{subscription.end_date}</div>
                            </td>
                            <td className="py-4 px-2 text-center">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(subscription?.status)}`}>
                    {subscription?.status}
                  </span>
                            </td>
                            <td className="py-4 px-2 text-center">
                                <div className="flex items-center justify-center space-x-2">
                                    <Button variant="ghost" size="sm">
                                        <Icon name="Eye" size={14} />
                                    </Button>
                                    {/*<Button variant="ghost" size="sm">*/}
                                    {/*    <Icon name="Edit" size={14} />*/}
                                    {/*</Button>*/}
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-muted-foreground">
                    Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, subscriptions?.length)} of {subscriptions?.length} entries
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                    >
                        <Icon name="ChevronLeft" size={16} />
                    </Button>
                    <span className="text-sm font-medium text-foreground px-3 py-1">
            {currentPage} of {totalPages}
          </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                    >
                        <Icon name="ChevronRight" size={16} />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionTable;