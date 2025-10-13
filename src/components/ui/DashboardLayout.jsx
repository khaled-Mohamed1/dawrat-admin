import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '/src/context/AuthContext.jsx';
import { logout as apiLogout } from '/src/api/authService.js';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '/src/api/notificationService.js';
import Sidebar from './Sidebar';
import Button from './Button';
import Icon from '../AppIcon';

import { formatDistanceToNow } from 'date-fns';

const DashboardLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const userMenuRef = useRef(null);
    const notificationRef = useRef(null);

    const { user, logout: contextLogout } = useAuth();

    // State for notifications
    const [notifications, setNotifications] = useState([]);
    const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);

    const loadNotifications = async () => {
        setIsLoadingNotifications(true);
        try {
            const response = await getNotifications();
            setNotifications(response.data || []);
        } catch (error) {
            console.error("Failed to fetch notifications");
            setNotifications([]); // Clear notifications on error
        } finally {
            setIsLoadingNotifications(false);
        }
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    const handleBellClick = () => {
        setIsNotificationOpen(!isNotificationOpen);
    };

    // Data for notifications
    const handleMarkAsRead = async (notificationId) => {
        try {
            await markNotificationAsRead(notificationId);
            setNotifications(prev => prev.filter(n => n.id !== notificationId));
        } catch (error) {
            console.error("Failed to mark notification as read");
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllNotificationsAsRead();
            setNotifications([]);
        } catch (error) {
            console.error("Failed to mark all as read");
        }
    };

    // Toggles the mobile sidebar
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleLogout = async () => {
        try {
            await apiLogout();
        } catch (error) {
            console.error("Logout API call failed, but logging out client-side.");
        } finally {
            contextLogout();
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setIsNotificationOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getUserInitials = (name) => {
        if (!name) return '';
        const nameParts = name.split(' ');
        if (nameParts.length > 1) {
            return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
        }
        return name[0].toUpperCase();
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'collaboration_ended':
                return 'UserX';
            case 'new_message':
                return 'MessageSquare';
            default:
                return 'Info';
        }
    };

    return (
        <div className="min-h-screen bg-background">

            <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />

            {/* Main Content Area */}
            <div className="lg:pl-64">
                {/* Top Header Bar */}
                <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-card border-b border-border">
                    {/* Left side: Mobile Sidebar Toggle */}
                    <div className="flex items-center">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleSidebar}
                            className="lg:hidden"
                        >
                            <Icon name="Menu" size={20} />
                        </Button>
                    </div>

                    {/* Right side: Notifications and User Menu */}
                    <div className="flex items-center space-x-2 md:space-x-4">
                        <div className="relative" ref={notificationRef}>
                            {/* Fetch notifications on click */}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleBellClick}
                                className="relative"
                            >
                                <Icon name="Bell" size={20} />
                                {/* Show unread count */}
                                {notifications.length > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                      {notifications.length}
                                    </span>
                                )}
                            </Button>

                            {isNotificationOpen && (
                                <div className="absolute right-0 top-full mt-2 w-80 bg-white border rounded-lg shadow-lg z-50">
                                    <div className="p-4 border-b flex justify-between items-center">
                                        <h3 className="font-semibold">Notifications</h3>
                                        {notifications.length > 0 && (
                                            <button onClick={handleMarkAllAsRead} className="text-sm text-blue-600 hover:underline">
                                                Mark all as read
                                            </button>
                                        )}
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        {isLoadingNotifications ? (
                                            <p className="p-4 text-center text-gray-500">Loading...</p>
                                        ) : notifications.length > 0 ? (
                                            notifications.map((notification) => (
                                                <div
                                                    key={notification.id}
                                                    className="p-4 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
                                                    onClick={() => handleMarkAsRead(notification.id)}
                                                >
                                                    <div className="flex items-start space-x-3">
                                                        <Icon
                                                            name={getNotificationIcon(notification.data.type)}
                                                            size={16}
                                                            className="text-gray-600 mt-1"
                                                        />
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium">{notification.data.title}</p>
                                                            <p className="text-sm text-gray-500 mt-1">{notification.data.message}</p>
                                                            <p className="text-xs text-gray-400 mt-2">
                                                                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="p-8 text-center text-gray-500">You have no new notifications.</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* User Profile & Dropdown */}
                        <div className="relative" ref={userMenuRef}>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="flex items-center space-x-2 px-2"
                            >
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                    {/* Use user's initials */}
                                    <span className="text-sm font-medium text-white">
                                        {getUserInitials(user?.name)}
                                    </span>
                                </div>
                                {/* Use user's name */}
                                <span className="hidden md:block text-sm font-medium">
                                    {user?.name || 'User'}
                                </span>
                                <Icon name="ChevronDown" size={16} />
                            </Button>

                            {isUserMenuOpen && (
                                <div className="absolute right-0 top-full mt-2 w-56 bg-white border rounded-lg shadow-lg z-50">
                                    <div className="p-3 border-b">
                                        {/* Use user's name and email */}
                                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                        <p className="text-xs text-gray-500">{user?.email}</p>
                                    </div>
                                    <div className="py-2">
                                        <a href="#" className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            <Icon name="User" size={16} />
                                            <span>Profile Settings</span>
                                        </a>
                                        {/* ... (other links) ... */}
                                        <div className="border-t my-2"></div>
                                        {/* Changed to a button with the onClick handler */}
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left flex items-center space-x-3 px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
                                        >
                                            <Icon name="LogOut" size={16} />
                                            <span>Sign Out</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;