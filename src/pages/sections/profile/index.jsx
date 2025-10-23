import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import DashboardLayout from '../../../components/ui/DashboardLayout';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';
import { getSectionDetails, createSection, updateSection } from '../../../api/sectionService';
import { getAllCourses } from '../../../api/courseService';
import { getAllTrainers } from '../../../api/trainerService';
import { getAllCenters } from '../../../api/centerService';
import { getAllAds } from '../../../api/adService';
import { getAllCourseRequests } from '../../../api/courseRequestService.js';
import Switch from '../../../components/ui/Switch';
import { cn } from '../../../utils/cn';

// --- Helper Components ---
const InfoItem = ({ label, value, children }) => (
    <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className="font-semibold text-foreground mt-1">{children || value || 'N/A'}</div>
    </div>
);

// This component handles the complex part: selecting specific content
const ContentSelector = ({ type, allItems, selectedContent, onChange }) => {
    if (!type || !allItems || allItems.length === 0) {
        return <p className="text-sm text-muted-foreground">Select a 'Type' to see content options.</p>;
    }

    const toggleItem = (id) => {
        const isSelected = selectedContent.some(item => item.id === id);
        let newContent;
        if (isSelected) {
            newContent = selectedContent.filter(item => item.id !== id);
        } else {
            newContent = [...selectedContent, { id: id }];
        }
        onChange('content', newContent);
    };

    return (
        <div className="space-y-2 max-h-60 overflow-y-auto border rounded-md p-2">
            {allItems.map(item => {
                const isSelected = selectedContent.some(c => c.id === item.id);
                return (
                    <div
                        key={item.id}
                        className={cn(
                            "flex items-center gap-2 p-2 rounded-md cursor-pointer",
                            isSelected ? 'bg-primary/10' : 'hover:bg-muted/50'
                        )}
                        onClick={() => toggleItem(item.id)}
                    >
                        <Icon name={isSelected ? 'CheckSquare' : 'Square'} size={16} className={isSelected ? 'text-primary' : 'text-muted-foreground'} />
                        <span className="text-sm font-medium">{item.name || item.title}</span>
                    </div>
                );
            })}
        </div>
    );
};


// --- Main Component ---
const SectionProfile = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const isCreateMode = id === 'new';
    const isEditMode = searchParams.get('mode') === 'edit';

    const [section, setSection] = useState(null);
    const [originalSection, setOriginalSection] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [notification, setNotification] = useState({ message: '', type: '' });

    // State for content dropdowns
    const [contentSources, setContentSources] = useState({
        courses: [], trainers: [], centers: [], ads: [], courseRequests: []
    });

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            // Fetch all possible content types
            const [courses, trainers, centers, ads, courseRequests] = await Promise.all([
                getAllCourses(), getAllTrainers(), getAllCenters(), getAllAds(), getAllCourseRequests()
            ]);
            setContentSources({ courses, trainers, centers, ads, courseRequests });

            if (isCreateMode) {
                setSection({ title_ar: '', title_en: '', slug: '', details: '', type: 'courses', content: [], limit: 8, is_dynamic: true, status: true });
            } else {
                try {
                    const response = await getSectionDetails(id);
                    setSection(response.data);
                    setOriginalSection(response.data);
                } catch (error) { setSection(null); }
            }
            setIsLoading(false);
        };
        fetchData();
    }, [id, isCreateMode]);

    const fetchSection = useCallback(async () => {
        const fetchData = async () => {
            setIsLoading(true);

            // Fetch all possible content types
            const [courses, trainers, centers, ads, courseRequests] = await Promise.all([
                getAllCourses(), getAllTrainers(), getAllCenters(), getAllAds(), getAllCourseRequests()
            ]);
            setContentSources({ courses, trainers, centers, ads, courseRequests });

            if (isCreateMode) {
                setSection({ title_ar: '', title_en: '', slug: '', details: '', type: 'courses', content: [], limit: 8, is_dynamic: true, status: true });
            } else {
                try {
                    const response = await getSectionDetails(id);
                    setSection(response.data);
                    setOriginalSection(response.data);
                } catch (error) { setSection(null); }
            }
            setIsLoading(false);
        };
        fetchData();
        }, [id, isCreateMode]);

    useEffect(() => {
        fetchSection();
    }, [fetchSection]);

    const handleInputChange = (field, value) => {
        setSection(prev => ({ ...prev, [field]: value }));
        if(errors[field]) setErrors(prev => ({...prev, [field]: undefined}));
    };

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: '', type: '' }), 5000);
    };

    const handleSave = async () => {
        setIsSaving(true);
        setErrors({});
        try {
            let payload;
            if (isCreateMode) {
                payload = {
                    title_ar: section.title_ar,
                    title_en: section.title_en,
                    slug: section.slug,
                };
                await createSection(payload);
                showNotification('Section created successfully.', 'success');
                navigate('/sections/dashboard');
            } else {
                payload = {
                    title_ar: section.title_ar,
                    title_en: section.title_en,
                    slug: section.slug,
                    type: section.type,
                    content: section.is_dynamic ? null : (section.content || []).map(c => ({ id: c.id })),
                    details: section.details,
                    is_dynamic: section.is_dynamic,
                    limit: section.limit,
                    status: section.status,
                };
                const response = await updateSection(id, payload);
                showNotification(response.message || 'Section updated successfully.', 'success');
                setSearchParams({}, { replace: true });
                fetchSection();
            }
        } catch (error) {
            if (error.status === 422) setErrors(error.errors);
            showNotification(error.message || 'Failed to save section.', 'error');
            console.error("Failed to save section", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setSection(originalSection);
        setSearchParams({}, { replace: true });
    };

    // --- Loading and Error States ---
    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="space-y-6 animate-pulse">
                    <div className="h-9 w-36 bg-gray-200 rounded-md"></div>
                    <div className="bg-card rounded-lg border p-6 space-y-4">
                        <div className="h-7 w-1/3 bg-gray-200 rounded"></div>
                        <div className="h-10 bg-gray-200 rounded-md"></div>
                        <div className="h-10 bg-gray-200 rounded-md"></div>
                        <div className="h-24 bg-gray-200 rounded-md"></div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (!section) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center text-center py-20">
                    <Icon name="LayoutDashboard" size={48} className="mx-auto text-destructive mb-4" />
                    <h3 className="text-xl font-semibold">Section Not Found</h3>
                    <p className="text-muted-foreground mb-6">The section you are looking for does not exist.</p>
                    <Button variant="outline" onClick={() => navigate('/sections/dashboard')} className="flex items-center gap-2">
                        <Icon name="ArrowLeft" /> Back to Sections
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    // Determine which list of items to show in the content selector
    const itemsForContentSelector = {
        'courses': contentSources.courses,
        'trainer': contentSources.trainers,
        'centers': contentSources.centers,
        'ads': contentSources.ads,
        'courseRequest': contentSources.courseRequest,
    }[section.type] || [];

    const typeOptions = [
        { label: 'Courses', value: 'courses' },
        { label: 'Trainers', value: 'trainer' },
        { label: 'Centers', value: 'centers' },
        { label: 'Ads', value: 'ads' },
        { label: 'Course Request', value: 'courseRequest' },
    ];

    // --- VIEW MODE ---
    if (!isCreateMode && !isEditMode) {
        const allItemsForType = {
            'courses': contentSources.courses,
            'trainer': contentSources.trainers,
            'centers': contentSources.centers,
            'ads': contentSources.ads,
            'courseRequest': contentSources.courseRequest,
        }[section.type] || [];

        // Filter that list to get only the items selected in the section's content
        const selectedContentItems = allItemsForType.filter(item =>
            section.content?.some(contentItem => contentItem.id === item.id)
        );
        return (
            <DashboardLayout>
                <div className="space-y-6">

                    {notification.message && (
                        <div className={`p-4 rounded-md text-sm ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {notification.message}
                        </div>
                    )}

                    <div className="flex justify-between items-center">
                        <Button variant="ghost" onClick={() => navigate('/sections/dashboard')}><Icon name="ArrowLeft"/> Back</Button>
                        <Button onClick={() => setSearchParams({ mode: 'edit' })} iconName="Edit">Edit</Button>
                    </div>

                    <div className="bg-card rounded-lg border p-6 space-y-6">
                        <div>
                            <h2 className="text-xl font-bold">{section.title_en}</h2>
                            <p className="text-muted-foreground" dir="rtl">{section.title_ar}</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                            <InfoItem label="Type" value={section.type} />
                            <InfoItem label="Slug" value={section.slug} />
                            <InfoItem label="Dynamic Content" value={section.is_dynamic ? 'Yes' : 'No'} />
                            <InfoItem label="Status" value={section.status ? 'Active' : 'Inactive'} />
                        </div>

                        {!section.is_dynamic && (
                            <div>
                                <h3 className="text-md font-semibold text-foreground mb-3">Selected Content</h3>
                                <div className="flex flex-wrap gap-2 p-4 bg-muted/30 rounded-md">
                                    {selectedContentItems.length > 0 ? (
                                        selectedContentItems.map(item => (
                                            <span key={item.id} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full border border-blue-200">
                                            {item.name || item.title}
                                        </span>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground">No specific content selected.</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    // --- CREATE / EDIT FORM ---
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <Button variant="ghost" onClick={isEditMode ? handleCancel : () => navigate('/sections/dashboard')}><Icon name="ArrowLeft"/> Back</Button>
                <div className="bg-card rounded-lg border p-6">
                    <h2 className="text-xl font-bold mb-6">{isCreateMode ? 'Create New Section' : 'Edit Section'}</h2>
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Title (EN)" value={section.title_en} onChange={e => handleInputChange('title_en', e.target.value)} error={errors.title_en?.[0]} />
                            <Input label="Title (AR)" value={section.title_ar} onChange={e => handleInputChange('title_ar', e.target.value)} error={errors.title_ar?.[0]} dir="rtl" />
                        </div>
                        <Input label="Slug" value={section.slug} onChange={e => handleInputChange('slug', e.target.value)} error={errors.slug?.[0]} helperText="Leave blank to auto-generate" />

                        {isEditMode && (
                            <>
                                <Input label="Details" type="textarea" value={section.details} onChange={e => handleInputChange('details', e.target.value)} />
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <Select label="Section Type" value={section.type} onChange={val => handleInputChange('type', val)} options={typeOptions} error={errors.type?.[0]} />
                                    <Switch checked={section.is_dynamic} onChange={val => handleInputChange('is_dynamic', val)} label="Dynamic Content" />
                                    <Switch checked={section.status} onChange={val => handleInputChange('status', val)} label="Section is Active" />
                                </div>
                                {section.is_dynamic ? (
                                    <Input type="number" label="Content Limit" value={section.limit} onChange={e => handleInputChange('limit', e.target.value)} />
                                ) : (
                                    <div>
                                        <label className="text-sm font-medium text-foreground mb-2 block">Manual Content Selection</label>
                                        <ContentSelector
                                            type={section.type}
                                            allItems={itemsForContentSelector}
                                            selectedContent={section.content || []}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    <div className="flex justify-end gap-4 pt-6 mt-6 border-t">
                        <Button variant="outline" onClick={isEditMode ? handleCancel : () => navigate('/sections/dashboard')}>Cancel</Button>
                        <Button onClick={handleSave} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</Button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default SectionProfile;