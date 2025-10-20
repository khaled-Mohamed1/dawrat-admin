import React, { useCallback, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../../components/ui/DashboardLayout';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';
import { getSettingDetails, updateSetting } from '../../../api/settingService';
import { cn } from '../../../utils/cn';
import Switch from '../../../components/ui/Switch';

// --- Main Component ---
const SettingsProfile = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [setting, setSetting] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [reAccept, setReAccept] = useState(false);
    const [notification, setNotification] = useState({ message: '', type: '' });

    const fetchSetting = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await getSettingDetails(id);
            setSetting(res.data);
        } catch (error) {
            console.error("Failed to fetch setting", error);
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchSetting();
    }, [fetchSetting]);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: '', type: '' }), 5000);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            let payload;
            if (setting.key === 'payout_schedule') {
                payload = {
                    value: {
                        frequency: setting.frequency,
                        anchor_day: setting.anchor_day,
                        cutoff_time: setting.cutoff_time,
                        min_payout_amount: setting.min_payout_amount,
                        timezone: setting.timezone,
                        status: setting.status,
                    }
                };
            } else {
                payload = {
                    value: setting.value,
                    re_accept: reAccept,
                };
            }

            const response = await updateSetting(id, payload);

            showNotification(response.message || 'Settings saved successfully!', 'success');
            fetchSetting();
            setReAccept(false)
        } catch (error) {
            console.error("Failed to save setting", error);
            showNotification(error.message || 'Failed to save settings.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const dayOfWeekOptions = [
        { label: 'Monday', value: 1 },
        { label: 'Tuesday', value: 2 },
        { label: 'Wednesday', value: 3 },
        { label: 'Thursday', value: 4 },
        { label: 'Friday', value: 5 },
        { label: 'Saturday', value: 6 },
        { label: 'Sunday', value: 7 },
    ];

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="space-y-6 animate-pulse">
                    <div className="flex justify-between items-center">
                        <div className="h-9 w-36 bg-gray-200 rounded-md"></div>
                        <div className="h-9 w-32 bg-gray-200 rounded-md"></div>
                    </div>
                    <div className="bg-card rounded-lg border p-6 space-y-6">
                        <div className="h-7 w-1/3 bg-gray-200 rounded"></div>
                        <div className="h-40 bg-gray-200 rounded-md"></div>
                        <div className="h-40 bg-gray-200 rounded-md"></div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (!setting) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center text-center py-20">
                    <Icon name="Settings2" size={48} className="mx-auto text-destructive mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">Setting Not Found</h3>
                    <p className="text-muted-foreground mb-6">
                        The setting you are looking for does not exist or could not be loaded.
                    </p>
                    <Button
                        variant="outline"
                        onClick={() => navigate('/settings/dashboard')}
                        className="flex items-center gap-2"
                    >
                        <Icon name="ArrowLeft" size={16} />
                        Back to Settings
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">

                {notification.message && (
                    <div className={`p-4 rounded-md text-sm ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {notification.message}
                    </div>
                )}

                <div className="flex justify-between items-center">
                    <Button variant="ghost" onClick={() => navigate('/settings/dashboard')}><Icon name="ArrowLeft"/> Back to Settings</Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>

                <div className="bg-card rounded-lg border p-6">
                    <h2 className="text-xl font-bold mb-6 capitalize">{setting.key.replace(/_/g, ' ')}</h2>

                    {setting.key !== 'payout_schedule' ? (
                        <div className="space-y-6">
                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">Content (EN)</label>
                                <textarea
                                    value={setting.value.en}
                                    onChange={e => setSetting({...setting, value: {...setting.value, en: e.target.value}})}
                                    className="w-full h-48 p-3 border rounded-md bg-transparent text-sm"
                                    placeholder="Enter English content..."
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">Content (AR)</label>
                                <textarea
                                    value={setting.value.ar}
                                    onChange={e => setSetting({...setting, value: {...setting.value, ar: e.target.value}})}
                                    className="w-full h-48 p-3 border rounded-md bg-transparent text-sm"
                                    placeholder="Enter Arabic content..."
                                    dir="rtl"
                                />
                            </div>

                            <div className="pt-4 border-t">
                                <Switch
                                    checked={reAccept}
                                    onChange={setReAccept}
                                    label="Require all users to re-accept these terms"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Select label="Frequency" value={setting.frequency} onChange={val => setSetting({...setting, frequency: val})} options={[{label: 'Monthly', value: 'monthly'}, {label: 'Weekly', value: 'weekly'}]} />
                            {setting.frequency === 'weekly' ? (
                                <Select
                                    label="Anchor Day"
                                    value={setting.anchor_day}
                                    onChange={val => setSetting({...setting, anchor_day: val})}
                                    options={dayOfWeekOptions}
                                    helperText="Select the day of the week for payouts."
                                />
                            ) : (
                                <Input
                                    label="Anchor Day"
                                    type="number"
                                    value={setting.anchor_day}
                                    onChange={e => setSetting({...setting, anchor_day: e.target.value})}
                                    helperText="Enter the day of the month (e.g., 1 for the 1st)."
                                />
                            )}
                            <Input label="Cutoff Time" type="time" value={setting.cutoff_time} onChange={e => setSetting({...setting, cutoff_time: e.target.value})} />
                            <Input label="Min Payout Amount" type="number" value={setting.min_payout_amount} onChange={e => setSetting({...setting, min_payout_amount: e.target.value})} />
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Timezone</label>
                                <p className="font-semibold text-foreground h-10 flex items-center">{setting.timezone}</p>
                            </div>
                            <Select label="Status" value={setting.status} onChange={val => setSetting({...setting, status: val})} options={[{label: 'Active', value: 'active'}, {label: 'Inactive', value: 'inactive'}]} />
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default SettingsProfile;