import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Sidebar = ({ isOpen, onToggle }) => {
    const location = useLocation();

    const menuItems = [
        {
            title: 'Analytics Dashboard',
            icon: 'BarChart3',
            path: '/dashboard',
            subItems: []
        },
        {
            title: 'User Management',
            icon: 'Users',
            path: '/users',
            subItems: [
                { title: 'All Users', path: '/all-users-dashboard' },
                { title: 'Students', path: '/student-dashboard' },
                { title: 'Trainers', path: '/trainers/dashboard' },
                { title: 'Centers', path: '/users/centers' }
            ]
        },
        {
            title: 'Course Management',
            icon: 'BookOpen',
            path: '/courses',
            subItems: [
                { title: 'Courses', path: '/courses/dashboard' },
            ]
        },
        {
            title: 'Subscriptions',
            icon: 'CreditCard',
            path: '/subscriptions',
            subItems: [
                { title: 'Active Subscriptions', path: '/subscriptions/active' },
                { title: 'Subscription Plans', path: '/subscriptions-plans/dashboard' },
                { title: 'Billing History', path: '/subscriptions/billing' }
            ]
        },
        {
            title: 'Revenue & Payouts',
            icon: 'DollarSign',
            path: '/revenue',
            subItems: [
                { title: 'Revenue Overview', path: '/revenue' },
                { title: 'Payout Management', path: '/revenue/payouts' },
                { title: 'Financial Reports', path: '/revenue/reports' }
            ]
        },
        {
            title: 'Orders',
            icon: 'ShoppingCart',
            path: '/orders',
            subItems: []
        },
        {
            title: 'Settings',
            icon: 'Settings',
            path: '/settings',
            subItems: []
        }
    ];

    const [expandedItems, setExpandedItems] = useState({});

    const toggleExpanded = (index) => {
        setExpandedItems(prev => ({
            ...prev,
            [index]: !prev?.[index]
        }));
    };

    const isActivePath = (path) => {
        return location?.pathname === path || location?.pathname?.startsWith(path + '/');
    };

    return (
        <>
            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={onToggle}
                />
            )}
            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-50 w-64 h-full bg-card border-r border-border transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                }`}
            >
                {/* Sidebar Header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <Icon name="BarChart3" size={20} color="white" />
                        </div>
                        <h2 className="text-lg font-semibold text-foreground">Admin Panel</h2>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onToggle}
                        className="lg:hidden"
                    >
                        <Icon name="X" size={20} />
                    </Button>
                </div>

                {/* Navigation Menu */}
                <nav className="p-4">
                    <ul className="space-y-1">
                        {menuItems?.map((item, index) => (
                            <li key={index}>
                                <div>
                                    {item?.subItems?.length > 0 ? (
                                        <button
                                            onClick={() => toggleExpanded(index)}
                                            className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors duration-150 ${
                                                isActivePath(item?.path)
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                            }`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <Icon name={item?.icon} size={18} />
                                                <span>{item?.title}</span>
                                            </div>
                                            <Icon
                                                name="ChevronDown"
                                                size={16}
                                                className={`transition-transform duration-200 ${
                                                    expandedItems?.[index] ? 'rotate-180' : ''
                                                }`}
                                            />
                                        </button>
                                    ) : (
                                        <Link
                                            to={item?.path}
                                            className={`flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-colors duration-150 ${
                                                isActivePath(item?.path)
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                            }`}
                                            onClick={() => {
                                                if (window.innerWidth < 1024) {
                                                    onToggle();
                                                }
                                            }}
                                        >
                                            <Icon name={item?.icon} size={18} />
                                            <span>{item?.title}</span>
                                        </Link>
                                    )}
                                </div>

                                {/* Sub Items */}
                                {item?.subItems?.length > 0 && expandedItems?.[index] && (
                                    <ul className="ml-6 mt-2 space-y-1 border-l border-border pl-4">
                                        {item?.subItems?.map((subItem, subIndex) => (
                                            <li key={subIndex}>
                                                <Link
                                                    to={subItem?.path}
                                                    className={`block px-3 py-2 text-sm rounded-lg transition-colors duration-150 ${
                                                        isActivePath(subItem?.path)
                                                            ? 'bg-primary text-primary-foreground'
                                                            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                                    }`}
                                                    onClick={() => {
                                                        if (window.innerWidth < 1024) {
                                                            onToggle();
                                                        }
                                                    }}
                                                >
                                                    {subItem?.title}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;