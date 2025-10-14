import React, { useState, useEffect, useCallback } from 'react';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/AppIcon';
import { getTrainerPayouts } from '../../../../api/trainerService';
import { cn } from '../../../../utils/cn';

const PayoutsTab = ({ trainerId }) => {
    const [payoutsData, setPayoutsData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [period, setPeriod] = useState('all_time'); // 'all_time', 'year', 'month'
    const [currentPage, setCurrentPage] = useState(1);
    const payoutsPerPage = 6;

    const fetchPayouts = useCallback(async () => {
        if (!trainerId) return;
        setIsLoading(true);
        try {
            const response = await getTrainerPayouts(trainerId, { period });
            if (response.success) {
                setPayoutsData(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch payouts", error);
        } finally {
            setIsLoading(false);
        }
    }, [trainerId, period]);

    useEffect(() => {
        fetchPayouts();
    }, [fetchPayouts]);

    // Client-side pagination logic
    const history = payoutsData?.payout_history || [];
    const totalPages = Math.ceil(history.length / payoutsPerPage);
    const startIndex = (currentPage - 1) * payoutsPerPage;
    const currentHistory = history.slice(startIndex, startIndex + payoutsPerPage);

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed': return 'bg-green-100 text-green-800 border-green-200';
            case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'sent': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'failed': return 'bg-red-100 text-red-800 border-red-200';
            case 'draft':
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
    const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString() : 'N/A';

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-foreground">Payouts & Revenue</h3>
                <div className="flex items-center space-x-1 bg-muted p-1 rounded-md">
                    <Button variant={period === 'all_time' ? 'default' : 'ghost'} size="sm" onClick={() => setPeriod('all_time')}>All Time</Button>
                    <Button variant={period === 'year' ? 'default' : 'ghost'} size="sm" onClick={() => setPeriod('year')}>This Year</Button>
                    <Button variant={period === 'month' ? 'default' : 'ghost'} size="sm" onClick={() => setPeriod('month')}>This Month</Button>
                </div>
            </div>

            {isLoading ? (
                <div className="text-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div></div>
            ) : !payoutsData ? (
                <div className="text-center py-12"><p className="text-muted-foreground">Could not load payout data.</p></div>
            ) : (
                <>
                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-muted/30 p-4 rounded-lg border"><h4 className="text-sm text-muted-foreground">Commission Rate</h4><p className="text-2xl font-bold">{payoutsData.commission_rate}%</p></div>
                        <div className="bg-muted/30 p-4 rounded-lg border"><h4 className="text-sm text-muted-foreground">Total Revenue ({period.replace('_', ' ')})</h4><p className="text-2xl font-bold">{formatCurrency(payoutsData.revenue.total)}</p></div>
                        <div className="bg-muted/30 p-4 rounded-lg border"><h4 className="text-sm text-muted-foreground">Pending Payout</h4><p className="text-2xl font-bold">{formatCurrency(payoutsData.pending_payout.amount)}</p></div>
                        <div className="bg-muted/30 p-4 rounded-lg border"><h4 className="text-sm text-muted-foreground">Last Payout Amount</h4><p className="text-2xl font-bold">{formatCurrency(payoutsData.last_payout.amount)}</p></div>
                    </div>

                    {/* Payout History Table */}
                    <div>
                        <h4 className="text-lg font-semibold text-foreground mb-4">Payout History</h4>
                        <div className="bg-card rounded-lg border overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-muted/50">
                                <tr>
                                    <th className="p-3 text-left text-sm font-medium">Batch ID</th>
                                    <th className="p-3 text-left text-sm font-medium">Date</th>
                                    <th className="p-3 text-left text-sm font-medium">Courses</th>
                                    <th className="p-3 text-left text-sm font-medium">Status</th>
                                    <th className="p-3 text-right text-sm font-medium">Amount</th>
                                </tr>
                                </thead>
                                <tbody>
                                {currentHistory.map(item => (
                                    <tr key={item.id} className="border-b last:border-b-0">
                                        <td className="p-3 font-mono text-xs">{item.batch_identifier}</td>
                                        <td className="p-3 text-sm">{formatDate(item.batch_date)}</td>
                                        <td className="p-3 text-sm">{item.courses_count}</td>
                                        <td className="p-3"><span className={cn('px-2 py-1 text-xs font-medium rounded-full border capitalize', getStatusColor(item.status))}>{item.status}</span></td>
                                        <td className="p-3 text-right font-semibold">{formatCurrency(item.amount_net)}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                        {totalPages > 1 && (
                            <div className="flex justify-end items-center mt-4 gap-2">
                                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Previous</Button>
                                <span className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</span>
                                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</Button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default PayoutsTab;