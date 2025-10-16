import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import DashboardLayout from '../../../components/ui/DashboardLayout';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import { getFeatureDetails, createFeature, updateFeature } from '../../../api/featureService';
import { cn } from '../../../utils/cn';
import Select from '../../../components/ui/Select';

const Switch = ({ checked, onChange, label, disabled = false }) => (
    <div className="flex items-center">
        <button
            type="button"
            className={cn(
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                checked ? 'bg-primary' : 'bg-gray-200',
                disabled && 'opacity-50 cursor-not-allowed'
            )}
            onClick={() => !disabled && onChange(!checked)}
            disabled={disabled}
        >
            <span className={cn('inline-block h-4 w-4 transform rounded-full bg-white transition-transform', checked ? 'translate-x-6' : 'translate-x-1')} />
        </button>
        <span className="ml-3 text-sm font-medium text-foreground">{label}</span>
    </div>
);

const InfoItem = ({ label, children }) => (
    <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className="font-semibold text-foreground mt-1">{children}</div>
    </div>
);

// --- Main Component ---

const FeatureProfile = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const isCreateMode = id === 'new';
    const isEditMode = searchParams.get('mode') === 'edit';

    const [feature, setFeature] = useState(null);
    const [originalFeature, setOriginalFeature] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [generalError, setGeneralError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                if (isCreateMode) {
                    // Initialize a blank feature for creation
                    setFeature({
                        name_en: '', name_ar: '', description_en: '',
                        description_ar: '', type: '', status: true
                    });
                } else {
                    // Fetch existing feature for view/edit
                    const response = await getFeatureDetails(id);
                    setFeature(response.data);
                    setOriginalFeature(response.data);
                }
            } catch (error) {
                setGeneralError('Could not load feature data.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id, isCreateMode]);

    const handleInputChange = (field, value) => {
        setFeature(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        setErrors({});
        setGeneralError('');
        try {
            if (isEditMode) {
                await updateFeature(id, feature);
            } else {
                await createFeature(feature);
            }
            navigate('/features/dashboard');
        } catch (error) {
            if (error.status === 422 && error.errors) {
                setErrors(error.errors);
                setGeneralError(error.message || 'Please correct the errors below.');
            } else {
                setGeneralError(error.message || 'An unexpected error occurred.');
            }
        } finally {
            setIsSaving(false);
        }
    };

    const enableEditMode = () => setSearchParams({ mode: 'edit' }, { replace: true });
    const handleCancel = () => {
        setFeature(originalFeature);
        setSearchParams({}, { replace: true });
    };

    const featureTypeOptions = [
        { label: 'Select a type...', value: '' },
        { label: 'Max Active Courses', value: 'max_active_courses' },
        { label: 'Commission Rate (%)', value: 'commission_rate_pct' },
        { label: 'Max Linked Centers', value: 'max_linked_centers' },
        { label: 'Max Active Users', value: 'max_active_users' }
    ];

    // --- RENDER STATES ---

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="space-y-6 animate-pulse">
                    {/* Header Skeleton */}
                    <div className="flex justify-between items-center">
                        <div className="h-9 w-40 bg-gray-200 rounded-md"></div>
                        <div className="h-9 w-32 bg-gray-200 rounded-md"></div>
                    </div>
                    {/* Form/View Skeleton */}
                    <div className="bg-card rounded-lg border p-6 space-y-6">
                        <div className="h-7 w-1/3 bg-gray-200 rounded"></div>
                        <div className="h-7 w-1/2 bg-gray-200 rounded"></div>
                        <div className="grid grid-cols-2 gap-6 pt-4 border-t">
                            <div className="h-10 bg-gray-200 rounded-md"></div>
                            <div className="h-10 bg-gray-200 rounded-md"></div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (!feature) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center text-center py-20">
                    <Icon name="ListX" size={48} className="mx-auto text-destructive mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">Feature Not Found</h3>
                    <p className="text-muted-foreground mb-6">
                        The feature you are looking for does not exist or could not be loaded.
                    </p>
                    <Button
                        variant="outline"
                        onClick={() => navigate('/features/dashboard')}
                        className="flex items-center gap-2"
                    >
                        <Icon name="ArrowLeft" size={16} />
                        Back to Features
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    // --- VIEW MODE ---
    if (!isCreateMode && !isEditMode) {
        return (
            <DashboardLayout>
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <Button variant="ghost" size="sm" onClick={() => navigate('/features/dashboard')} className="flex items-center gap-2">
                            <Icon name="ArrowLeft" size={16} /> Back to Features
                        </Button>
                        <Button onClick={enableEditMode} iconName="Edit">Edit Feature</Button>
                    </div>
                    <div className="bg-card rounded-lg border p-6 space-y-6">
                        <InfoItem label="Name (EN)"><h2 className="text-xl font-bold">{feature.name_en}</h2></InfoItem>
                        <InfoItem label="Name (AR)"><h2 className="text-xl font-bold" dir="rtl">{feature.name_ar}</h2></InfoItem>
                        <InfoItem label="Description (EN)"><p className="text-sm">{feature.description_en}</p></InfoItem>
                        <InfoItem label="Description (AR)"><p className="text-sm" dir="rtl">{feature.description_ar}</p></InfoItem>
                        <div className="grid grid-cols-2 gap-6 pt-4 border-t">
                            <InfoItem label="Type Key"><code className="font-mono text-blue-600">{feature.type}</code></InfoItem>
                            <InfoItem label="Status"><span className={cn('px-2 py-1 text-xs font-medium rounded-full', feature.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')}>{feature.status ? 'Active' : 'Inactive'}</span></InfoItem>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    // --- CREATE / EDIT FORM ---
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <Button variant="ghost" size="sm" onClick={isEditMode ? handleCancel : () => navigate('/features/dashboard')} className="flex items-center gap-2">
                    <Icon name="ArrowLeft" size={16} /> {isEditMode ? 'Cancel Edit' : 'Back to Features'}
                </Button>
                <div className="bg-card rounded-lg border p-6">
                    <h2 className="text-xl font-bold mb-6">{isCreateMode ? 'Create New Feature' : 'Edit Feature'}</h2>
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Name (EN)" value={feature.name_en} onChange={e => handleInputChange('name_en', e.target.value)} error={errors.name_en?.[0]} />
                            <Input label="Name (AR)" value={feature.name_ar} onChange={e => handleInputChange('name_ar', e.target.value)} error={errors.name_ar?.[0]} dir="rtl" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Description (EN)" value={feature.description_en} onChange={e => handleInputChange('description_en', e.target.value)} error={errors.description_en?.[0]} />
                            <Input label="Description (AR)" value={feature.description_ar} onChange={e => handleInputChange('description_ar', e.target.value)} error={errors.description_ar?.[0]} dir="rtl" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Select
                                label="Type Key"
                                value={feature.type}
                                onChange={value => handleInputChange('type', value)}
                                options={featureTypeOptions}
                                error={errors.type?.[0]}
                            />
                            <Switch checked={!!feature.status} onChange={val => handleInputChange('status', val)} label="Feature is Active" />
                        </div>
                        {generalError && <div className="p-4 rounded-md text-sm bg-red-100 text-red-800">{generalError}</div>}
                        <div className="flex justify-end gap-4 pt-6 border-t">
                            <Button variant="outline" onClick={isEditMode ? handleCancel : () => navigate('/features/dashboard')}>Cancel</Button>
                            <Button onClick={handleSave} disabled={isSaving} iconName={isSaving ? 'Loader' : 'Save'}>{isSaving ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Create Feature')}</Button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default FeatureProfile;