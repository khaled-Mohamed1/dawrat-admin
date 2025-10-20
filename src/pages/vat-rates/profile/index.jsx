import React, { useCallback, useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import DashboardLayout from '../../../components/ui/DashboardLayout';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';
import { getVatRateDetails, createVatRate, updateVatRate } from '../../../api/vatRateService';
import { cn } from '../../../utils/cn';
import Switch from '../../../components/ui/Switch';

const VatRateProfile = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const isCreateMode = id === 'new';
    const isEditMode = searchParams.get('mode') === 'edit';

    const [rate, setRate] = useState(null);
    const [originalRate, setOriginalRate] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [notification, setNotification] = useState({ message: '', type: '' });

    const fetchRate = useCallback(async () => {
        setIsLoading(true);
        if (isCreateMode) {
            setRate({ rate: '', code: '', effective_from: '', effective_to: null, show_vat: true, must_reaccept: false, status: 'active' });
        } else {
            try {
                const response = await getVatRateDetails(id);
                setRate(response.data);
                setOriginalRate(response.data);
            } catch (error) {
                setRate(null);
            }
        }
        setIsLoading(false);
    }, [id, isCreateMode]);

    useEffect(() => {
        fetchRate();
    }, [fetchRate]);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: '', type: '' }), 5000);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            if (isCreateMode) {
                await createVatRate(rate);
                showNotification('VAT Rate created successfully.', 'success');
                navigate('/vat-rates/dashboard');
            } else {
                await updateVatRate(id, rate);
                showNotification('VAT Rate updated successfully.', 'success');
                setSearchParams({}, { replace: true });
                fetchRate();
            }
        } catch (error) {
            console.error("Failed to save VAT rate", error);
            showNotification('Failed to save VAT rate.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setRate(originalRate);
        setSearchParams({}, { replace: true });
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="space-y-6 animate-pulse">
                    <div className="h-9 w-40 bg-gray-200 rounded-md"></div>
                    <div className="bg-card rounded-lg border p-6 space-y-4">
                        <div className="h-7 w-1/3 bg-gray-200 rounded"></div>
                        <div className="h-10 bg-gray-200 rounded-md"></div>
                        <div className="h-10 bg-gray-200 rounded-md"></div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (!rate) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center text-center py-20">
                    <Icon name="SearchX" size={48} className="mx-auto text-destructive mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">VAT Rate Not Found</h3>
                    <p className="text-muted-foreground mb-6">The rate you are looking for does not exist.</p>
                    <Button
                        variant="outline"
                        onClick={() => navigate('/vat-rates/dashboard')}
                        className="flex items-center gap-2"
                    >
                        <Icon name="ArrowLeft" size={16} />
                        Back to VAT Rates
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    if (!isCreateMode && !isEditMode) {
        return (
            <DashboardLayout>
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <Button variant="ghost" onClick={() => navigate('/vat-rates/dashboard')}><Icon name="ArrowLeft"/> Back</Button>
                        <Button onClick={() => setSearchParams({ mode: 'edit' })} iconName="Edit">Edit</Button>
                    </div>
                    <div className="bg-card rounded-lg border p-6 grid grid-cols-2 gap-4">
                        <div><p className="text-sm text-muted-foreground">Code</p><h2 className="font-mono">{rate.code}</h2></div>
                        <div><p className="text-sm text-muted-foreground">Rate</p><h2 className="text-xl font-bold">{rate.rate}%</h2></div>
                        <div><p className="text-sm text-muted-foreground">Effective From</p><p>{new Date(rate.effective_from).toLocaleDateString()}</p></div>
                        <div><p className="text-sm text-muted-foreground">Status</p><p className="capitalize">{rate.status}</p></div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    const statusOptions = [{label: 'Active', value: 'active'}, {label: 'Inactive', value: 'inactive'}];

    return (
        <DashboardLayout>
            <div className="space-y-6">

                {notification.message && (
                    <div className={`p-4 rounded-md text-sm ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {notification.message}
                    </div>
                )}

                <Button variant="ghost" onClick={isEditMode ? handleCancel : () => navigate('/vat-rates/dashboard')}>
                    <Icon name="ArrowLeft"/> {isEditMode ? 'Cancel Edit' : 'Back to VAT Rates'}
                </Button>
                <div className="bg-card rounded-lg border p-6">
                    <h2 className="text-xl font-bold mb-6">{isCreateMode ? 'Create New VAT Rate' : 'Edit VAT Rate'}</h2>
                    <div className="space-y-4 max-w-lg">
                        <Input label="Code" value={rate.code} onChange={e => setRate({ ...rate, code: e.target.value })} />
                        <Input label="Rate (%)" type="number" value={rate.rate} onChange={e => setRate({ ...rate, rate: e.target.value })} />
                        <Input label="Effective From" type="date" value={rate.effective_from.split(' ')[0]} onChange={e => setRate({ ...rate, effective_from: e.target.value })} />
                        <Input label="Effective To (Optional)" type="date" value={rate.effective_to?.split(' ')[0] || ''} onChange={e => setRate({ ...rate, effective_to: e.target.value })} />
                        <Select label="Status" value={rate.status} onChange={val => setRate({ ...rate, status: val })} options={statusOptions} />
                        <Switch checked={rate.show_vat} onChange={val => setRate({ ...rate, show_vat: val })} label="Show VAT on Invoices" />
                        <Switch checked={rate.must_reaccept} onChange={val => setRate({ ...rate, must_reaccept: val })} label="Require Users to Re-accept Terms" />
                    </div>
                    <div className="flex justify-end gap-4 pt-6 mt-6 border-t">
                        <Button variant="outline" onClick={isEditMode ? handleCancel : () => navigate('/vat-rates/dashboard')}>Cancel</Button>
                        <Button onClick={handleSave} disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save'}
                        </Button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default VatRateProfile;