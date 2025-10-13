import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PayoutTable = ({ payoutsData = [], isLoading }) => {
    const [showAll, setShowAll] = useState(false);

    const payoutsToDisplay = showAll ? payoutsData : payoutsData.slice(0, 5);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Scheduled':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Processing':
                return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'Completed':
                return 'bg-green-100 text-green-700 border-green-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date?.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);

    return (
        <div className="bg-card rounded-lg border p-6 flex flex-col">
            <h3 className="text-lg font-medium text-foreground mb-6">Upcoming Payout Batches</h3>

            <div className="space-y-4 flex-grow">
                {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-20 bg-gray-200 rounded-lg animate-pulse" />)
                ) : payoutsToDisplay.length > 0 ? (
                    payoutsToDisplay.map((batch) => (
                        <div key={batch.batch_identifier} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="font-medium text-foreground text-sm">{batch.batch_identifier}</div>
                                    <div className="text-lg font-bold text-green-600">{formatCurrency(batch.amount)}</div>
                                </div>
                                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                    <div className="flex items-center space-x-1"><Icon name="Calendar" size={14} /><span>{batch.date}</span></div>
                                    <span>•</span>
                                    <div className="flex items-center space-x-1"><Icon name="Users" size={14} /><span>{batch.trainers_included.length} trainers</span></div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 ml-4">
                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(batch.status)}`}>
                                    {batch.status}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-muted-foreground py-10">No upcoming payouts.</div>
                )}
            </div>

            {payoutsData.length > 5 && (
                <div className="mt-6 text-center">
                    <Button variant="outline" size="sm" onClick={() => setShowAll(!showAll)}>
                        {showAll ? 'Show Less' : `Show ${payoutsData.length - 5} More`}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default PayoutTable;