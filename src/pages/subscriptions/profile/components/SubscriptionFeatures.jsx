import React, { useState, useEffect } from 'react';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';

const FeatureRow = ({ feature, usage, isEditMode, onAmountChange, editableValue }) => {
    const usageValue = usage[`usage_${feature.type}`] ?? 0;
    const limitValue = usage[feature.type] ?? '∞';

    const percentage = limitValue !== '∞' && limitValue > 0
        ? Math.min(100, (usageValue / limitValue) * 100)
        : 0;

    return (
        <div className="bg-muted/30 p-4 rounded-lg border">
            <div className="flex justify-between items-center">
                <div>
                    <p className="font-semibold">{feature.name_en}</p>
                    <p className="text-xs text-muted-foreground">{feature.description_en}</p>
                </div>
                {isEditMode ? (
                    <Input
                        type="number"
                        className="w-24"
                        value={editableValue ?? ''}
                        onChange={e => onAmountChange(feature.id, e.target.value)}
                    />
                ) : (
                    <p className="text-lg font-bold text-primary">{usageValue} / {limitValue}</p>
                )}
            </div>
            {!isEditMode && limitValue !== '∞' && (
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2 overflow-hidden">
                    <div className="bg-primary h-1.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                </div>
            )}
        </div>
    );
};


const SubscriptionFeatures = ({ subscription, onSave, isSaving }) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [editableFeatures, setEditableFeatures] = useState([]);

    useEffect(() => {
        // Initialize editable state when the component loads or subscription changes
        if (subscription?.subscription_plan?.features) {
            const initialFeatures = subscription.subscription_plan.features.map(feature => ({
                id: feature.id,
                amount: subscription.usage_feature[feature.type] ?? 0,
            }));
            setEditableFeatures(initialFeatures);
        }
    }, [subscription]);

    const handleAmountChange = (featureId, amount) => {
        setEditableFeatures(prev =>
            prev.map(f => (f.id === featureId ? { ...f, amount: parseInt(amount, 10) || 0 } : f))
        );
    };

    const handleSaveClick = () => {
        onSave(editableFeatures);
        setIsEditMode(false);
    };

    const handleCancelClick = () => {
        // Reset changes from the original subscription prop
        const initialFeatures = subscription.subscription_plan.features.map(feature => ({
            id: feature.id,
            amount: subscription.usage_feature[feature.type] ?? 0,
        }));
        setEditableFeatures(initialFeatures);
        setIsEditMode(false);
    };

    return (
        <div className="bg-card rounded-lg border p-6 space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Plan Features & Usage</h3>
                {isEditMode ? (
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleCancelClick}>Cancel</Button>
                        <Button size="sm" onClick={handleSaveClick} disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save Addons'}
                        </Button>
                    </div>
                ) : (
                    <Button
                        variant="outline"
                        size="sm"
                        iconName={isSaving ? 'Loader' : 'Edit'}
                        onClick={() => setIsEditMode(true)}
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving...' : 'Edit Addons'}
                    </Button>
                )}
            </div>

            <div className="space-y-3">
                {subscription.subscription_plan.features.map(feature => {
                    const editableValue = editableFeatures.find(f => f.id === feature.id)?.amount;

                    return (
                        <FeatureRow
                            key={feature.id}
                            feature={feature}
                            usage={subscription.usage_feature}
                            isEditMode={isEditMode}
                            onAmountChange={handleAmountChange}
                            editableValue={editableValue}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default SubscriptionFeatures;