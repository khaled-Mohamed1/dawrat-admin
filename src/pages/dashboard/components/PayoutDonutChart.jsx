import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const PayoutDonutChart = ({ payoutChartData, isLoading }) => {
    const COLORS = ['#A9A9A9', '#696969', '#87CEEB', '#FFD700', '#22c55e', '#ef4444']; // Draft, Locked, Sent, Processing, Completed, Failed

    const processedData = useMemo(() => {
        if (!payoutChartData?.labels || !payoutChartData?.data) return [];
        const total = payoutChartData.data.reduce((sum, value) => sum + value, 0);

        return payoutChartData.labels.map((label, index) => ({
            name: label,
            count: payoutChartData.data[index],
            value: total > 0 ? (payoutChartData.data[index] / total) * 100 : 0,
            color: COLORS[index % COLORS.length]
        }));
    }, [payoutChartData]);

    if (isLoading) {
        return <div className="bg-card rounded-lg border p-6 h-[424px] flex items-center justify-center"><p className="text-muted-foreground">Loading Chart...</p></div>;
    }

    return (
        <div className="bg-card rounded-lg border p-6">
            <h3 className="text-lg font-medium text-foreground mb-6">Payout Status</h3>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={processedData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                            {processedData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                        </Pie>
                        <Tooltip formatter={(value, name, props) => [`${props.payload.count} (${value.toFixed(1)}%)`, name]} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default PayoutDonutChart;