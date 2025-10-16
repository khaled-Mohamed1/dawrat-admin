import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import DashboardLayout from '../../../components/ui/DashboardLayout';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';
import { getJobDetails, createJob, updateJob } from '../../../api/jobService';
import { getAllCategories } from '../../../api/categoryService';

const JobProfile = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const isCreateMode = id === 'new';
    const isEditMode = searchParams.get('mode') === 'edit';

    const [job, setJob] = useState(null);
    const [originalJob, setOriginalJob] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            getAllCategories().then(setCategories); // Fetch categories for the dropdown
            if (isCreateMode) {
                setJob({ job_title_en: '', job_title_ar: '', category_id: '', status: true });
            } else {
                try {
                    const response = await getJobDetails(id);
                    const jobData = { ...response.data, category_id: response.data.category.id };
                    setJob(jobData);
                    setOriginalJob(jobData);
                } catch (error) {
                    setJob(null);
                }
            }
            setIsLoading(false);
        };
        fetchData();
    }, [id, isCreateMode]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            if (isCreateMode) await createJob(job);
            else await updateJob(id, job);
            navigate('/jobs/dashboard');
        } catch (error) {
            console.error("Failed to save job", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setJob(originalJob);
        setSearchParams({}, { replace: true });
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="space-y-6 animate-pulse">
                    <div className="h-9 w-32 bg-gray-200 rounded-md"></div>
                    <div className="bg-card rounded-lg border p-6 space-y-4">
                        <div className="h-7 w-1/3 bg-gray-200 rounded"></div>
                        <div className="h-10 bg-gray-200 rounded-md"></div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (!job) {
        return (
            <DashboardLayout>
                <div className="text-center py-20">
                    <Icon name="Briefcase" size={48} className="mx-auto text-destructive mb-4" />
                    <h3 className="text-xl font-semibold">Job Not Found</h3>
                    <Button variant="outline" onClick={() => navigate('/jobs/dashboard')} className="mt-4"><Icon name="ArrowLeft" /> Back to Jobs</Button>
                </div>
            </DashboardLayout>
        );
    }

    if (!isCreateMode && !isEditMode) {
        return (
            <DashboardLayout>
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <Button variant="ghost" onClick={() => navigate('/jobs/dashboard')}><Icon name="ArrowLeft"/> Back</Button>
                        <Button onClick={() => setSearchParams({ mode: 'edit' })} iconName="Edit">Edit</Button>
                    </div>
                    <div className="bg-card rounded-lg border p-6 space-y-4">
                        <p className="text-sm text-muted-foreground">Job Title (EN)</p>
                        <h2 className="text-xl font-bold">{job.job_title_en}</h2>
                        <p className="text-sm text-muted-foreground">Job Title (AR)</p>
                        <h2 className="text-xl font-bold" dir="rtl">{job.job_title_ar}</h2>
                        <p className="text-sm text-muted-foreground">Category</p>
                        <p className="font-semibold">{job.category?.name}</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    const categoryOptions = categories.map(c => ({ label: c.name, value: c.id }));

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <Button variant="ghost" onClick={isEditMode ? handleCancel : () => navigate('/jobs/dashboard')}><Icon name="ArrowLeft"/> {isEditMode ? 'Cancel Edit' : 'Back to Jobs'}</Button>
                <div className="bg-card rounded-lg border p-6">
                    <h2 className="text-xl font-bold mb-6">{isCreateMode ? 'Create New Job' : 'Edit Job'}</h2>
                    <div className="space-y-4">
                        <Input label="Job Title (EN)" value={job.job_title_en} onChange={e => setJob({ ...job, job_title_en: e.target.value })} />
                        <Input label="Job Title (AR)" value={job.job_title_ar} onChange={e => setJob({ ...job, job_title_ar: e.target.value })} dir="rtl"/>
                        <Select label="Category" value={job.category_id} onChange={val => setJob({ ...job, category_id: val })} options={categoryOptions} />
                    </div>
                    <div className="flex justify-end gap-4 pt-6 mt-6 border-t">
                        <Button variant="outline" onClick={isEditMode ? handleCancel : () => navigate('/jobs/dashboard')}>Cancel</Button>
                        <Button onClick={handleSave} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</Button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default JobProfile;