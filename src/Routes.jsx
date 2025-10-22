import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";

// Component Imports
import ProtectedRoute from "./components/ProtectedRoute";
import AnalyticalDashboard from './pages/dashboard';
import AllUsersDashboard from './pages/all-users-dashboard';
import UserProfileManagement from './pages/user-profile-management';
import StudentDashboard from './pages/students/dashboard';
import StudentDetails from './pages/students/profile';
import CourseDashboard from './pages/courses/dashboard';
import CourseProfile from './pages/courses/profile';
import TrainerDashboard from './pages/trainers/dashboard';
import TrainerProfile from './pages/trainers/profile';
import SubscriptionsPlanDashboard from './pages/subscriptions-plans/dashboard';
import SubscriptionsPlanProfile from './pages/subscriptions-plans/profile';
import SubscriptionsDashboard from './pages/subscriptions/dashboard';
import SubscriptionsProfile from './pages/subscriptions/profile';
import LoginPage from './pages/login/LoginPage';
import FeaturesDashboard from './pages/features/dashboard';
import FeatureProfile from './pages/features/profile';
import RolesDashboard from './pages/roles/dashboard';
import RoleProfile from './pages/roles/profile';
import CategoriesDashboard from './pages/categories/dashboard';
import CategoryProfile from './pages/categories/profile';
import JobsDashboard from './pages/jobs/dashboard';
import JobProfile from './pages/jobs/profile';
import AdminsDashboard from './pages/admins/dashboard';
import AdminProfile from './pages/admins/profile';
import OrdersDashboard from './pages/orders/dashboard';
import OrderProfile from './pages/orders/profile';
import InvoicesDashboard from './pages/invoices/dashboard';
import InvoiceProfile from './pages/invoices/profile';
import TransactionsDashboard from './pages/transactions/dashboard';
import TransactionProfile from './pages/transactions/profile';
import ContactUsDashboard from './pages/contact-us/dashboard';
import ContactUsProfile from './pages/contact-us/profile';
import SettingsDashboard from './pages/settings/dashboard';
import SettingProfile from './pages/settings/profile';
import VatRatesDashboard from './pages/vat-rates/dashboard';
import VatRateProfile from './pages/vat-rates/profile';
import CommissionsDashboard from './pages/commissions/dashboard';
import CommissionProfile from './pages/commissions/profile';
import RevenueDashboard from './pages/revenue/dashboard';
import RevenueProfile from './pages/revenue/profile';
import PayoutsDashboard from './pages/payouts/dashboard';
import PayoutProfile from './pages/payouts/profile';
import CenterRequestsDashboard from "./pages/center-requests/dashboard";
import CenterRequestProfile from "./pages/center-requests/profile";
import AdsDashboard from "./pages/ads/dashboard";
import AdProfile from "./pages/ads/profile";

const Routes = () => {
    return (
        <BrowserRouter>
            <ErrorBoundary>
                <ScrollToTop />
                <RouterRoutes>
                    {/* Public Route: Login */}
                    {/* Anyone can access this route. */}
                    <Route path="/login" element={<LoginPage />} />

                    {/* Protected Routes */}
                    {/* Only authenticated users can access these routes. */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/" element={<AnalyticalDashboard />} />
                        <Route path="/dashboard" element={<AnalyticalDashboard />} />
                        <Route path="/all-users-dashboard" element={<AllUsersDashboard />} />
                        <Route path="/user-profile-management" element={<UserProfileManagement />} />
                        <Route path="/student-dashboard" element={<StudentDashboard />} />
                        <Route path="/student-details/:id" element={<StudentDetails />} />
                        <Route path="/trainers/dashboard" element={<TrainerDashboard />} />
                        <Route path="/trainers/details/:id" element={<TrainerProfile />} />
                        <Route path="/courses/dashboard" element={<CourseDashboard />} />
                        <Route path="/courses/details/:id" element={<CourseProfile />} />
                        <Route path="/subscriptions-plans/dashboard" element={<SubscriptionsPlanDashboard  />} />
                        <Route path="/subscriptions-plans/details/:id" element={<SubscriptionsPlanProfile />} />
                        <Route path="/subscriptions/dashboard" element={<SubscriptionsDashboard  />} />
                        <Route path="/subscriptions/details/:id" element={<SubscriptionsProfile />} />
                        <Route path="/features/dashboard" element={<FeaturesDashboard />} />
                        <Route path="/features/details/:id" element={<FeatureProfile />} />
                        <Route path="/roles/dashboard" element={<RolesDashboard />} />
                        <Route path="/roles/details/:id" element={<RoleProfile />} />
                        <Route path="/categories/dashboard" element={<CategoriesDashboard />} />
                        <Route path="/categories/details/:id" element={<CategoryProfile />} />
                        <Route path="/jobs/dashboard" element={<JobsDashboard />} />
                        <Route path="/jobs/details/:id" element={<JobProfile />} />
                        <Route path="/admins/dashboard" element={<AdminsDashboard />} />
                        <Route path="/admins/details/:id" element={<AdminProfile />} />
                        <Route path="/orders/dashboard" element={<OrdersDashboard />} />
                        <Route path="/orders/details/:id" element={<OrderProfile />} />
                        <Route path="/invoices/dashboard" element={<InvoicesDashboard />} />
                        <Route path="/invoices/details/:id" element={<InvoiceProfile />} />
                        <Route path="/transactions/dashboard" element={<TransactionsDashboard />} />
                        <Route path="/transactions/details/:id" element={<TransactionProfile />} />
                        <Route path="/contact-us/dashboard" element={<ContactUsDashboard />} />
                        <Route path="/contact-us/details/:id" element={<ContactUsProfile />} />
                        <Route path="/settings/dashboard" element={<SettingsDashboard />} />
                        <Route path="/settings/details/:id" element={<SettingProfile />} />
                        <Route path="/vat-rates/dashboard" element={<VatRatesDashboard />} />
                        <Route path="/vat-rates/details/:id" element={<VatRateProfile />} />
                        <Route path="/commissions/dashboard" element={<CommissionsDashboard />} />
                        <Route path="/commissions/details/:id" element={<CommissionProfile />} />
                        <Route path="/revenue/dashboard" element={<RevenueDashboard />} />
                        <Route path="/revenue/details/:id" element={<RevenueProfile />} />
                        <Route path="/payouts/dashboard" element={<PayoutsDashboard />} />
                        <Route path="/payouts/details/:id" element={<PayoutProfile />} />
                        <Route path="/center-requests/dashboard" element={<CenterRequestsDashboard />} />
                        <Route path="/center-requests/details/:id" element={<CenterRequestProfile />} />
                        <Route path="/ads/dashboard" element={<AdsDashboard />} />
                        <Route path="/ads/details/:id" element={<AdProfile />} />
                    </Route>

                    {/* Catch-all route for pages that don't exist */}
                    <Route path="*" element={<NotFound />} />
                </RouterRoutes>
            </ErrorBoundary>
        </BrowserRouter>
    );
};

export default Routes;