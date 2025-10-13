import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

const SubscriptionChart = ({ chartData }) => {

    // useMemo will transform the data only when chartData changes
    const processedData = useMemo(() => {
        if (!chartData?.labels || !chartData?.datasets) {
            return [];
        }

        // Transform API data into the format recharts expects
        return chartData.labels.map((label, index) => {
            const entry = {
                // Format date for display, e.g., "Oct 08"
                date: format(new Date(label), 'MMM dd'),
            };
            chartData.datasets.forEach(dataset => {
                // Lowercase label for use as a key, e.g., 'New' -> 'new'
                entry[dataset.label.toLowerCase()] = dataset.data[index];
            });
            return entry;
        });
    }, [chartData]);

    // Define colors for each line
    const lineColors = {
        new: '#22c55e',       // Green
        cancelled: '#ef4444', // Red
        expired: '#f59e0b',   // Amber
    };

    if (!chartData) {
        return (
            <div className="bg-card rounded-lg border border-border p-6 h-[424px] flex items-center justify-center">
                <p className="text-muted-foreground">Loading chart data...</p>
            </div>
        );
    }

    return (
        <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-medium text-foreground mb-6">Subscription Trends (Last 30 Days)</h3>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={processedData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                        <Legend />
                        {chartData.datasets.map(dataset => (
                            <Line
                                key={dataset.label}
                                type="monotone"
                                dataKey={dataset.label.toLowerCase()}
                                stroke={lineColors[dataset.label.toLowerCase()] || '#8884d8'}
                                strokeWidth={2}
                                name={dataset.label}
                                dot={false}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default SubscriptionChart;