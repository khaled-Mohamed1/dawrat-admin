import React, { useState, useEffect  } from 'react';
import DashboardLayout from '../../components/ui/DashboardLayout';
import KPICard from './components/KPICard';
import CourseTable from './components/CourseTable';
import SubscriptionChart from './components/SubscriptionChart';
import SubscriptionTable from './components/SubscriptionTable';
import RevenueChart from './components/RevenueChart';
import PayoutDonutChart from './components/PayoutDonutChart';
import OrdersTable from './components/OrdersTable';
import PayoutTable from './components/PayoutTable';
import FilterButtons from './components/FilterButtons';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

import { getKpiStats, getCourseStats, getSubscriptionData, getRevenueData, getDashboardTablesData } from '../../api/dashboardService';

const AnalyticalDashboard = () => {
    const [timeFilter, setTimeFilter] = useState('7-day');

    const [kpiData, setKpiData] = useState(null);
    const [courseStats, setCourseStats] = useState(null);
    const [subscriptionData, setSubscriptionData] = useState(null);
    const [timeFilterRevenue, setTimeFilterRevenue] = useState('week');
    const [revenueData, setRevenueData] = useState(null);
    const [isRevenueLoading, setIsRevenueLoading] = useState(true);
    const [tablesData, setTablesData] = useState(null);
    const [isTablesLoading, setIsTablesLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);


    // Mock KPI Data
    useEffect(() => {
        // We define an async function inside so we can use await
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Fetch both sets of data in parallel
                const [kpiResponse, coursesResponse, subsResponse] = await Promise.all([
                    getKpiStats(),
                    getCourseStats(),
                    getSubscriptionData()
                ]);

                if (kpiResponse.success) setKpiData(kpiResponse.data);
                if (coursesResponse.success) setCourseStats(coursesResponse.data);
                if (subsResponse.success) setSubscriptionData(subsResponse);


            } catch (err) {
                setError('Failed to fetch dashboard data. Please try again later.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchFilteredData = async () => {
            // Set loading for both sections
            setIsRevenueLoading(true);
            setIsTablesLoading(true);
            try {
                // Fetch both in parallel
                const [revenueRes, tablesRes] = await Promise.all([
                    getRevenueData(timeFilterRevenue),
                    getDashboardTablesData(timeFilterRevenue)
                ]);

                if (revenueRes.success) setRevenueData(revenueRes);
                if (tablesRes.success) setTablesData(tablesRes);

            } catch (err) {
                console.error("Failed to fetch filtered data", err);
            } finally {
                setIsRevenueLoading(false);
                setIsTablesLoading(false);
            }
        };
        fetchFilteredData();
    }, [timeFilterRevenue]);
    const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-64">
                    <p className="text-muted-foreground">Loading dashboard...</p>
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-64 bg-red-100 text-red-700 p-4 rounded-lg">
                    <p>{error}</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
                        <p className="text-muted-foreground mt-1">
                            Comprehensive business intelligence and performance metrics
                        </p>
                    </div>
                </div>

                {/* Section 1: KPI Cards */}
                <section>
                    <div className="flex items-center mb-6">
                        <Icon name="BarChart3" size={24} className="text-primary mr-3" />
                        <h2 className="text-xl font-semibold text-foreground">Key Performance Indicators</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Use the fetched kpiData */}
                        <KPICard title="All Users" value={kpiData?.all_users} breakdown={`Students: ${kpiData?.students} • Trainers: ${kpiData?.trainers} • Centers: ${kpiData?.centers}`} icon="Users" color="from-blue-500 to-blue-600" />
                        <KPICard title="Pending Courses" value={courseStats?.Pending} breakdown="Awaiting approval" icon="Clock" color="from-orange-500 to-orange-600" />
                        <KPICard title="Published Courses" value={courseStats?.Published} breakdown="Active courses" icon="BookOpen" color="from-green-500 to-green-600" />
                        <KPICard
                            title="Active Subscriptions"
                            value={subscriptionData?.total_active_subscriptions?.toLocaleString() ?? '...'}
                            breakdown="Current subscribers"
                            icon="CreditCard"
                            color="from-purple-500 to-purple-600"
                        />
                    </div>
                </section>

                {/* Section 2: Courses */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <Icon name="BookOpen" size={24} className="text-primary mr-3" />
                            <h2 className="text-xl font-semibold text-foreground">Course Management</h2>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 xl:grid-cols-1 gap-6">
                        <CourseTable />
                    </div>
                </section>

                {/* Section 3: Subscriptions */}
                <section>
                    <div className="flex items-center mb-6">
                        <Icon name="CreditCard" size={24} className="text-primary mr-3" />
                        <h2 className="text-xl font-semibold text-foreground">Subscription Analytics</h2>
                    </div>
                    <div className="grid grid-cols-1 xl:grid-cols-1 gap-6 mb-6">
                        <div className="xl:col-span-2">
                            <SubscriptionChart chartData={subscriptionData?.chart_data} />
                        </div>
                    </div>
                    <SubscriptionTable summaryTable={subscriptionData?.summary_table} />
                </section>

                {/* Section 4: Revenue & Payouts */}
                <section>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                        <div className="flex items-center">
                            <Icon name="DollarSign" size={24} className="text-primary mr-3" />
                            <h2 className="text-xl font-semibold text-foreground">Revenue & Payouts</h2>
                        </div>
                        {/* **NEW**: Filter buttons */}
                        <div className="flex items-center space-x-1 bg-muted p-1 rounded-md mt-4 sm:mt-0">
                            <Button variant={timeFilterRevenue === 'week' ? 'default' : 'ghost'} size="sm" onClick={() => setTimeFilterRevenue('week')}>This Week</Button>
                            <Button variant={timeFilterRevenue === 'month' ? 'default' : 'ghost'} size="sm" onClick={() => setTimeFilterRevenue('month')}>This Month</Button>
                        </div>
                    </div>

                    {/* Revenue KPIs */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        {/* **UPDATED** to use live data */}
                        <div className="bg-card rounded-lg border p-6">
                            <h3 className="text-sm font-medium text-muted-foreground mb-2">Gross Sales (7-day)</h3>
                            <div className="text-2xl font-bold">{formatCurrency(revenueData?.counters?.gross_sales_7day)}</div>
                        </div>
                        <div className="bg-card rounded-lg border p-6">
                            <h3 className="text-sm font-medium text-muted-foreground mb-2">Gross Sales (MTD)</h3>
                            <div className="text-2xl font-bold">{formatCurrency(revenueData?.counters?.gross_sales_mtd)}</div>
                        </div>
                        <div className="bg-card rounded-lg border p-6">
                            <h3 className="text-sm font-medium text-muted-foreground mb-2">Net Revenue (MTD)</h3>
                            <div className="text-2xl font-bold">{formatCurrency(revenueData?.counters?.net_revenue_mtd)}</div>
                        </div>
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                        <RevenueChart revenueChartData={revenueData?.revenue_chart} isLoading={isRevenueLoading} />
                        <PayoutDonutChart payoutChartData={revenueData?.payout_status_chart} isLoading={isRevenueLoading} />
                    </div>

                    {/* Tables Row */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <OrdersTable
                            ordersData={tablesData?.latest_orders}
                            isLoading={isTablesLoading}
                            timeFilterRevenue={timeFilterRevenue}
                        />
                        <PayoutTable
                            payoutsData={tablesData?.upcoming_payout_batches}
                            isLoading={isTablesLoading}
                        />
                    </div>
                </section>
            </div>
        </DashboardLayout>
    );
};

export default AnalyticalDashboard;