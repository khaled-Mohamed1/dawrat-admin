import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import DashboardLayout from '../../../components/ui/DashboardLayout';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import { getCategoryDetails, createCategory, updateCategory } from '../../../api/categoryService';

const InfoItem = ({ label, value }) => (
    <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <h2 className="text-xl font-bold text-foreground mt-1">{value}</h2>
    </div>
);

const CategoryProfile = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const isCreateMode = id === 'new';
    const isEditMode = searchParams.get('mode') === 'edit';

    const [category, setCategory] = useState(null);
    const [originalCategory, setOriginalCategory] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [notification, setNotification] = useState({ message: '', type: '' });

    const fetchCategory = useCallback(async () => {
        setIsLoading(true);
        if (isCreateMode) {
            setCategory({ name_en: '', name_ar: '', status: true });
        } else {
            try {
                const response = await getCategoryDetails(id);
                setCategory(response.data);
                setOriginalCategory(response.data);
            } catch (error) {
                console.error("Failed to fetch category", error);
                setCategory(null);
            }
        }
        setIsLoading(false);
    }, [id, isCreateMode]);

    useEffect(() => {
        fetchCategory();
    }, [fetchCategory]);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: '', type: '' }), 5000);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const payload = {
                name_en: category.name_en,
                name_ar: category.name_ar,
                status: category.status,
            };

            if (isCreateMode) {
                await createCategory(payload);
                showNotification('Category created successfully.', 'success');
                navigate('/categories/dashboard');
            } else {
                await updateCategory(id, payload);
                showNotification('Category updated successfully.', 'success');
                // Go back to view mode by removing the '?mode=edit' param
                setSearchParams({}, { replace: true });
                fetchCategory(); // Refresh data to show the latest changes
            }
        } catch (error) {
            console.error("Failed to save category", error);
            showNotification(error.message || 'Failed to save category. Please try again.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setCategory(originalCategory);
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
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (!category) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center text-center py-20">
                    <Icon name="Tag" size={48} className="mx-auto text-destructive mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">Category Not Found</h3>
                    <p className="text-muted-foreground mb-6">The category you are looking for does not exist.</p>
                    <Button variant="outline" onClick={() => navigate('/categories/dashboard')} className="flex items-center gap-2">
                        <Icon name="ArrowLeft" size={16} /> Back to Categories
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
                        <Button variant="ghost" onClick={() => navigate('/categories/dashboard')} className="flex items-center gap-2"><Icon name="ArrowLeft"/> Back to Categories</Button>
                        <Button onClick={() => setSearchParams({ mode: 'edit' })} iconName="Edit">Edit Category</Button>
                    </div>
                    <div className="bg-card rounded-lg border p-6 space-y-6">
                        <InfoItem label="Name (EN)" value={category.name_en} />
                        <InfoItem label="Name (AR)" value={category.name_ar} />
                    </div>
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

                <Button variant="ghost" size="sm" onClick={() => navigate('/categories/dashboard')} className="flex items-center gap-2">
                    <Icon name="ArrowLeft"/> Back to Categories
                </Button>
                <div className="bg-card rounded-lg border p-6">
                    <h2 className="text-xl font-bold mb-6">{isCreateMode ? 'Create New Category' : 'Edit Category'}</h2>
                    <div className="space-y-4">
                        <Input
                            label="Name (EN)"
                            value={category.name_en}
                            onChange={e => setCategory({ ...category, name_en: e.target.value })}
                        />
                        <Input
                            label="Name (AR)"
                            value={category.name_ar}
                            onChange={e => setCategory({ ...category, name_ar: e.target.value })}
                            dir="rtl"
                        />
                    </div>
                    <div className="flex justify-end gap-4 pt-6 mt-6 border-t">
                        <Button variant="outline" onClick={isCreateMode ? () => navigate('/categories/dashboard') : handleCancel}>Cancel</Button>
                        <Button onClick={handleSave} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</Button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CategoryProfile;