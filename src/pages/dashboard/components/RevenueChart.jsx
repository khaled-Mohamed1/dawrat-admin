import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

const RevenueChart = ({ revenueChartData, isLoading }) => {
    const processedData = useMemo(() => {
        if (!revenueChartData?.labels || !revenueChartData?.datasets) return [];

        return revenueChartData.labels.map((label, index) => {
            const entry = { date: format(new Date(label), 'MMM dd') };
            revenueChartData.datasets.forEach(dataset => {
                entry[dataset.label.toLowerCase()] = dataset.data[index];
            });
            return entry;
        });
    }, [revenueChartData]);

    if (isLoading) {
        return <div className="bg-card rounded-lg border p-6 h-[424px] flex items-center justify-center"><p className="text-muted-foreground">Loading Chart...</p></div>;
    }

    return (
        <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-medium text-foreground mb-6">Revenue Over Time</h3>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={processedData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                        <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, null]} contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                        <Legend />
                        <Line type="monotone" dataKey="sales" name="Sales" stroke="#3b82f6" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="payouts" name="Payouts" stroke="#10b981" strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default RevenueChart;