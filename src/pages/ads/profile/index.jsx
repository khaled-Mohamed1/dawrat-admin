import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import DashboardLayout from '../../../components/ui/DashboardLayout';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import { getAdDetails, createAd, updateAd, approveAd, rejectAd } from '../../../api/adService';
import RejectionModal from './components/RejectionModal';

const InfoItem = ({ label, value, children }) => (
    <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className="font-semibold text-foreground mt-1">
            {children || value || 'N/A'}
        </div>
    </div>
);

const AdProfile = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const isCreateMode = id === 'new';
    const isEditMode = searchParams.get('mode') === 'edit';

    const [ad, setAd] = useState(null);
    const [originalAd, setOriginalAd] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            if (isCreateMode) {
                setAd({ title: '', description: '', link: '', start_date: '', end_date: '' });
            } else {
                try {
                    const response = await getAdDetails(id);
                    setAd(response.data);
                    setOriginalAd(response.data);
                    setImagePreview(response.data.file_url);
                } catch (error) { setAd(null); }
            }
            setIsLoading(false);
        };
        fetchData();
    }, [id, isCreateMode]);

    const handleInputChange = (field, value) => setAd(prev => ({ ...prev, [field]: value }));

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        const formData = new FormData();
        Object.keys(ad).forEach(key => {
            if (['title', 'description', 'link', 'start_date', 'end_date'].includes(key)) {
                formData.append(key, ad[key] || '');
            }
        });
        if (imageFile) formData.append('image', imageFile);

        try {
            if (isCreateMode) await createAd(formData);
            else await updateAd(id, formData);
            navigate('/ads/dashboard');
        } catch (error) {
            console.error("Failed to save ad", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleReview = async (action, reason = null) => {
        try {
            if (action === 'approve') await approveAd(id);
            else if (action === 'reject') await rejectAd(id, { rejection_reason: reason });
            navigate('/ads/dashboard');
        } catch (error) { console.error(`Failed to ${action} ad`, error); }
    };

    const handleCancel = () => {
        setAd(originalAd);
        setImagePreview(originalAd.file_url);
        setImageFile(null);
        setSearchParams({}, { replace: true });
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="space-y-6 animate-pulse">
                    <div className="flex justify-between items-center">
                        <div className="h-9 w-36 bg-gray-200 rounded-md"></div>
                        <div className="flex gap-2"><div className="h-9 w-24 bg-gray-200 rounded-md"></div><div className="h-9 w-24 bg-gray-200 rounded-md"></div></div>
                    </div>
                    <div className="bg-card rounded-lg border p-6">
                        <div className="w-full h-64 bg-gray-200 rounded-md mb-6"></div>
                        <div className="h-8 w-1/2 bg-gray-200 rounded"></div>
                        <div className="h-4 w-3/4 bg-gray-200 rounded mt-4"></div>
                        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t">
                            <div className="h-10 bg-gray-200 rounded"></div>
                            <div className="h-10 bg-gray-200 rounded"></div>
                            <div className="h-10 bg-gray-200 rounded"></div>
                            <div className="h-10 bg-gray-200 rounded"></div>
                        </div>

                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (!ad) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center text-center py-20">
                    <Icon name="ImageOff" size={48} className="mx-auto text-destructive mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">Ad Not Found</h3>
                    <p className="text-muted-foreground mb-6">The advertisement you are looking for does not exist or could not be loaded.</p>
                    <Button
                        variant="outline"
                        onClick={() => navigate('/ads/dashboard')}
                        className="flex items-center gap-2"
                    >
                        <Icon name="ArrowLeft" size={16} />
                        Back to Ads
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
                        <Button variant="ghost" onClick={() => navigate('/ads/dashboard')}><Icon name="ArrowLeft"/> Back</Button>
                        <div className="flex gap-2">
                            {(ad.is_verify === 'Pending' || ad.is_verify === 'Rejected') && <Button variant="success" onClick={() => handleReview('approve')}>Approve</Button>}
                            {ad.is_verify === 'Pending' && <Button variant="destructive" onClick={() => handleReview('reject', 'Reason needed')}>Reject</Button>}
                            <Button onClick={() => setSearchParams({mode: 'edit'})} iconName="Edit">Edit</Button>
                        </div>
                    </div>
                    <div className="bg-card rounded-lg border p-6">
                        <img src={ad.file_url} alt={ad.title} className="w-full h-64 object-contain rounded-md mb-6 bg-muted"/>
                        <h2 className="text-2xl font-bold">{ad.title}</h2>
                        <p className="text-muted-foreground mt-4">{ad.description}</p>
                        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t">
                            <InfoItem label="Status" value={ad.is_active ? 'Active' : 'Inactive'} />
                            <InfoItem label="Verification" value={ad.is_verify} />
                            <InfoItem label="Start Date" value={new Date(ad.start_date).toLocaleDateString()} />
                            <InfoItem label="End Date" value={new Date(ad.end_date).toLocaleDateString()} />
                            <InfoItem label="Link" value={<a href={ad.link} className="text-primary">{ad.link}</a>} />
                            <InfoItem label="Submitted by" value={ad.user.name} />
                        </div>
                        {ad.is_verify === 'Rejected' && <div className="mt-4 p-4 bg-red-50 rounded-md text-red-800"><p className="font-semibold">Rejection Reason:</p><p>{ad.reason}</p></div>}
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    // --- CREATE / EDIT FORM ---
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <Button variant="ghost" onClick={isEditMode ? handleCancel : () => navigate('/ads/dashboard')}><Icon name="ArrowLeft"/> Back</Button>
                <div className="bg-card rounded-lg border p-6">
                    <h2 className="text-xl font-bold mb-6">{isCreateMode ? 'Create New Ad' : 'Edit Ad'}</h2>
                    <div className="space-y-4 max-w-2xl">
                        <Input label="Title" value={ad.title} onChange={e => handleInputChange('title', e.target.value)} />
                        <Input label="Description" type="textarea" value={ad.description} onChange={e => handleInputChange('description', e.target.value)} />
                        <Input label="Link URL" type="url" value={ad.link} onChange={e => handleInputChange('link', e.target.value)} />
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Start Date" type="date" value={ad.start_date} onChange={e => handleInputChange('start_date', e.target.value)} />
                            <Input label="End Date" type="date" value={ad.end_date} onChange={e => handleInputChange('end_date', e.target.value)} />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Image</label>
                            {imagePreview && <img src={imagePreview} alt="Ad preview" className="w-full h-48 object-contain my-2 rounded-md bg-muted"/>}
                            <Input type="file" onChange={handleImageChange} accept="image/*" />
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 pt-6 mt-6 border-t">
                        <Button variant="outline" onClick={isEditMode ? handleCancel : () => navigate('/ads/dashboard')}>Cancel</Button>
                        <Button onClick={handleSave} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</Button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdProfile;