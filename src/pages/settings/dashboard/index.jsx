import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../components/ui/DashboardLayout.jsx";
import Icon from "../../../components/AppIcon.jsx";
import { getSettings } from '../../../api/settingService';

const SettingsDashboard = () => {
    const navigate = useNavigate();
    const [settings, setSettings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getSettings().then(res => {
            if (res.success) setSettings(res.data);
        }).finally(() => setIsLoading(false));
    }, []);

    const formatKey = (key) => {
        return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Platform Settings</h1>
                    <p className="text-muted-foreground mt-1">Manage general platform settings, policies, and schedules.</p>
                </div>

                {isLoading ? (
                    <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />)}</div>
                ) : (
                    <div className="bg-card rounded-lg border">
                        {settings.map((setting, index) => (
                            <div
                                key={setting.id}
                                onClick={() => navigate(`/settings/details/${setting.id}`)}
                                className={`flex justify-between items-center p-4 hover:bg-muted/50 cursor-pointer ${index < settings.length - 1 ? 'border-b' : ''}`}
                            >
                                <span className="font-medium text-foreground">{formatKey(setting.key)}</span>
                                <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default SettingsDashboard;