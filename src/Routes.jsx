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
import StudentDashboard from './pages/student-dashboard';
import CourseDashboard from './pages/courses/dashboard';
import CourseProfile from './pages/courses/profile';
import TrainerDashboard from './pages/trainers/dashboard';
import TrainerProfile from './pages/trainers/profile';
import StudentDetails from './pages/student-details';
import SubscriptionsPlanDashboard from './pages/subscriptions-plans/dashboard';
import SubscriptionsPlanProfile from './pages/subscriptions-plans/profile';
import LoginPage from './pages/login/LoginPage';

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
                    </Route>

                    {/* Catch-all route for pages that don't exist */}
                    <Route path="*" element={<NotFound />} />
                </RouterRoutes>
            </ErrorBoundary>
        </BrowserRouter>
    );
};

export default Routes;