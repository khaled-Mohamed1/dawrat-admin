import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import DashboardLayout from '../../../components/ui/DashboardLayout';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';
import { getFeatures } from '../../../api/featureService';
import { createSubscriptionPlan, getSubscriptionPlanDetails, updateSubscriptionPlan } from '../../../api/subscriptionPlanService';
import { cn } from '../../../utils/cn';

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

const StatusBadge = ({ isActive }) => (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border', isActive ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200')}>
        {isActive ? 'Active' : 'Inactive'}
    </span>
);

const SubscriptionsPlanProfile = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const isCreateMode = id === 'new';
    const isEditMode = searchParams.get('mode') === 'edit';

    const [plan, setPlan] = useState(null);
    const [originalPlan, setOriginalPlan] = useState(null);
    const [featuresList, setFeaturesList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [generalError, setGeneralError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const allFeatures = await getFeatures();
                setFeaturesList(allFeatures);

                if (isCreateMode) {
                    setPlan({
                        description_en: '', description_ar: '', price: '', discount: '',
                        plan_type: 'Monthly', plan_tier: 'Personal', plan_level: 'Free',
                        is_default: false, trial_period_days: '', status: true,
                        features: allFeatures.map(f => ({ id: f.id, amount: 0 }))
                    });
                } else {
                    const planResponse = await getSubscriptionPlanDetails(id);
                    const existingPlan = planResponse.data;

                    const mergedFeatures = allFeatures.map(feature => {
                        const existingFeature = existingPlan.features.find(f => f.id === feature.id);
                        return { ...feature, amount: existingFeature ? existingFeature.amount : 0 };
                    });

                    const fullPlanData = { ...existingPlan, features: mergedFeatures };
                    setPlan(fullPlanData);
                    setOriginalPlan(fullPlanData);
                }
            } catch (error) {
                console.error("Failed to load data:", error);
                setGeneralError("Could not load plan data. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id, isCreateMode]);

    const handleInputChange = (field, value) => {
        setPlan(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
    };

    const handleFeatureAmountChange = (featureId, amount) => {
        setPlan(prev => ({
            ...prev,
            features: prev.features.map(f => f.id === featureId ? { ...f, amount: parseInt(amount, 10) || 0 } : f)
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        setErrors({});
        setGeneralError('');
        try {
            if (isEditMode) {
                await updateSubscriptionPlan(id, plan);
            } else {
                await createSubscriptionPlan(plan);
            }
            navigate('/subscriptions-plans/dashboard');
        } catch (error) {
            console.error("Save operation failed:", error);
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

    const enableEditMode = () => {
        setOriginalPlan(plan);
        navigate(`?mode=edit`, { replace: true });
    };

    const handleCancel = () => {
        setPlan(originalPlan); // Revert any changes
        navigate(`/subscriptions-plans/details/${id}`, { replace: true });
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="space-y-6 animate-pulse">
                    {/* Header Skeleton */}
                    <div className="flex justify-between items-center">
                        <div className="h-9 w-36 bg-gray-200 rounded-md"></div>
                        <div className="h-9 w-32 bg-gray-200 rounded-md"></div>
                    </div>
                    {/* Form Skeleton */}
                    <div className="bg-card rounded-lg border p-6 space-y-8">
                        <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="h-10 bg-gray-200 rounded-md"></div>
                            <div className="h-10 bg-gray-200 rounded-md"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="h-10 bg-gray-200 rounded-md"></div>
                            <div className="h-10 bg-gray-200 rounded-md"></div>
                            <div className="h-10 bg-gray-200 rounded-md"></div>
                        </div>
                        <div>
                            <div className="h-5 w-1/4 bg-gray-200 rounded mb-4"></div>
                            <div className="space-y-3">
                                <div className="h-16 bg-gray-200 rounded-md"></div>
                                <div className="h-16 bg-gray-200 rounded-md"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (!plan) {
        return (
            <DashboardLayout>
                <div className="text-center py-20">
                    <Icon name="AlertCircle" size={48} className="mx-auto text-destructive mb-4" />
                    <h3 className="text-lg font-semibold">Could Not Load Plan</h3>
                    <p className="text-muted-foreground">The requested subscription plan could not be found or an error occurred.</p>
                </div>
            </DashboardLayout>
        );
    }

    if (!isCreateMode && !isEditMode) {
        return (
            <DashboardLayout>
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <Button variant="ghost" size="sm" onClick={() => navigate('/subscriptions-plans/dashboard')} className="flex items-center gap-2">
                            <Icon name="ArrowLeft" size={16} /> Back to Plans
                        </Button>
                        <Button onClick={enableEditMode} iconName="Edit">
                            Edit Plan
                        </Button>
                    </div>

                    <div className="bg-card rounded-lg border p-6 space-y-8">
                        {/* Header */}
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-bold">{plan.plan_tier} - {plan.plan_level}</h2>
                                <p className="text-muted-foreground">Version {plan.version}</p>
                            </div>
                            <StatusBadge isActive={plan.status} />
                        </div>

                        {/* Descriptions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InfoItem label="Description (EN)"><p className="text-sm">{plan.description_en}</p></InfoItem>
                            <InfoItem label="Description (AR)"><p className="text-sm">{plan.description_ar}</p></InfoItem>
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <InfoItem label="Price">{plan.price}</InfoItem>
                            <InfoItem label="Discount">{plan.discount}</InfoItem>
                            <InfoItem label="Plan Type">{plan.plan_type}</InfoItem>
                            <InfoItem label="Trial Period">{plan.trial_period_days > 0 ? `${plan.trial_period_days} days` : 'None'}</InfoItem>
                        </div>

                        {/* Features */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Plan Features</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {plan.features?.map(feature => (
                                    <div key={feature.id} className="flex items-center justify-between bg-muted/30 p-3 rounded-md">
                                        <p className="font-medium text-sm">{feature.name}</p>
                                        <p className="font-bold text-primary">{feature.amount}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    {isEditMode ? (
                        <Button variant="ghost" size="sm" onClick={handleCancel} className="flex items-center gap-2">
                            <Icon name="X" size={16} /> Cancel Edit
                        </Button>
                    ) : (
                        <Button variant="ghost" size="sm" onClick={() => navigate('/subscriptions-plans/dashboard')} className="flex items-center gap-2">
                            <Icon name="ArrowLeft" size={16} /> Back to Plans
                        </Button>
                    )}
                </div>

                <div className="bg-card rounded-lg border p-6">
                    <h2 className="text-xl font-bold mb-6">{isCreateMode ? 'Create New Plan' : 'Edit Subscription Plan'}</h2>
                    <div className="space-y-8">
                        {/* Plan Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Description (EN)" value={plan.description_en} onChange={e => handleInputChange('description_en', e.target.value)} error={errors.description_en?.[0]} />
                            <Input label="Description (AR)" value={plan.description_ar} onChange={e => handleInputChange('description_ar', e.target.value)} error={errors.description_ar?.[0]}/>
                        </div>

                        {/* Pricing */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input type="number" label="Price" value={plan.price} onChange={e => handleInputChange('price', e.target.value)} error={errors.price?.[0]} />
                            <Input type="number" label="Discount" value={plan.discount} onChange={e => handleInputChange('discount', e.target.value)} error={errors.discount?.[0]} />
                        </div>

                        {/* Plan Type & Tier */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Select label="Plan Type" value={plan.plan_type} onChange={val => handleInputChange('plan_type', val)} options={[{label: 'Monthly', value: 'Monthly'}, {label: 'Annual', value: 'Annual'}]} error={errors.plan_type?.[0]} />
                            <Select label="Plan Tier" value={plan.plan_tier} onChange={val => handleInputChange('plan_tier', val)} options={[{label: 'Personal', value: 'Personal'}, {label: 'Enterprise', value: 'Enterprise'}]} error={errors.plan_tier?.[0]} />
                            <Select label="Plan Level" value={plan.plan_level} onChange={val => handleInputChange('plan_level', val)} options={[{label: 'Free', value: 'Free'}, {label: 'Starter', value: 'Starter'}, {label: 'Pro', value: 'Pro'}, {label: 'Business', value: 'Business'}]} error={errors.plan_level?.[0]} />
                        </div>

                        {/* Settings */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                            <Switch checked={plan.status} onChange={val => handleInputChange('status', val)} label="Plan is Active" />
                            <Switch checked={plan.is_default} onChange={val => handleInputChange('is_default', val)} label="Set as Default Plan" />
                            {plan.is_default && (
                                <Input type="number" label="Trial Period (days)" value={plan.trial_period_days} onChange={e => handleInputChange('trial_period_days', e.target.value)} error={errors.trial_period_days?.[0]} />
                            )}
                        </div>

                        {/* Features */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Plan Features</h3>
                            <div className="space-y-4">
                                {featuresList.map(feature => (
                                    <div key={feature.id} className="flex items-center justify-between bg-muted/30 p-3 rounded-md">
                                        <div>
                                            <p className="font-medium">{feature.name}</p>
                                            <p className="text-xs text-muted-foreground">{feature.description}</p>
                                        </div>
                                        <Input
                                            type="number"
                                            className="w-24"
                                            value={plan.features.find(f => f.id === feature.id)?.amount || ''}
                                            onChange={e => handleFeatureAmountChange(feature.id, e.target.value)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {generalError && <div className="p-4 rounded-md text-sm bg-red-100 text-red-800">{generalError}</div>}

                        {/* Actions */}
                        <div className="flex justify-end gap-4 pt-6 border-t">
                            <Button
                                variant="outline"
                                onClick={isEditMode ? handleCancel : () => navigate('/subscriptions-plans/dashboard')}
                            >
                                Cancel
                            </Button>
                            <Button onClick={handleSave} disabled={isSaving} iconName={isSaving ? 'Loader' : 'Save'}>
                                {isSaving ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Create Plan')}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default SubscriptionsPlanProfile;