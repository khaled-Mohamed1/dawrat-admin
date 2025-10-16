import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import DashboardLayout from '../../../components/ui/DashboardLayout';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import { getRoleDetails, createRole, updateRole } from '../../../api/roleService';

const RoleProfile = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const isCreateMode = id === 'new';
    const isEditMode = searchParams.get('mode') === 'edit';

    const [role, setRole] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isCreateMode) {
            setRole({ name: '' });
            setIsLoading(false);
        } else {
            getRoleDetails(id).then(res => {
                setRole(res.data);
                setIsLoading(false);
            }).catch(() => setIsLoading(false));
        }
    }, [id, isCreateMode]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            if (isCreateMode) {
                await createRole(role);
            } else {
                await updateRole(id, role);
            }
            navigate('/roles/dashboard');
        } catch (error) {
            console.error("Failed to save role", error);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="space-y-6 animate-pulse">
                    {/* Header Skeleton */}
                    <div className="flex justify-between items-center">
                        <div className="h-9 w-36 bg-gray-200 rounded-md"></div>
                        <div className="h-9 w-28 bg-gray-200 rounded-md"></div>
                    </div>
                    {/* Form/View Skeleton */}
                    <div className="bg-card rounded-lg border p-6 space-y-4">
                        <div className="h-7 w-1/3 bg-gray-200 rounded"></div>
                        <div className="h-10 bg-gray-200 rounded-md"></div>
                        <div className="flex justify-end pt-6 mt-6 border-t">
                            <div className="h-9 w-24 bg-gray-200 rounded-md"></div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (!role) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center text-center py-20">
                    <Icon name="Lock" size={48} className="mx-auto text-destructive mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">Role Not Found</h3>
                    <p className="text-muted-foreground mb-6">
                        The role you are looking for does not exist or could not be loaded.
                    </p>
                    <Button
                        variant="outline"
                        onClick={() => navigate('/roles/dashboard')}
                        className="flex items-center gap-2"
                    >
                        <Icon name="ArrowLeft" size={16} />
                        Back to Roles
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
                        <Button variant="ghost" size="sm" onClick={() => navigate('/roles/dashboard')} className="flex items-center gap-2"><Icon name="ArrowLeft"/>Back to Roles</Button>
                        <Button onClick={() => navigate(`?mode=edit`)} iconName="Edit">Edit Role</Button>
                    </div>
                    <div className="bg-card rounded-lg border p-6">
                        <p className="text-sm text-muted-foreground">Role Name</p>
                        <h2 className="text-2xl font-bold capitalize">{role.name.replace('_', ' ')}</h2>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    // --- CREATE / EDIT FORM ---
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <Button variant="ghost" size="sm" onClick={() => navigate('/roles/dashboard')} className="flex items-center gap-2">
                    <Icon name="ArrowLeft"/> Back to Roles
                </Button>
                <div className="bg-card rounded-lg border p-6">
                    <h2 className="text-xl font-bold mb-6">{isCreateMode ? 'Create New Role' : 'Edit Role'}</h2>
                    <div className="space-y-4">
                        <Input
                            label="Role Name"
                            placeholder="e.g., content_manager"
                            value={role.name}
                            onChange={e => setRole({ ...role, name: e.target.value.toLowerCase().replace(' ', '_') })}
                            helperText="Use lowercase and underscores instead of spaces (e.g., 'super_admin')."
                        />
                    </div>
                    <div className="flex justify-end gap-4 pt-6 mt-6 border-t">
                        <Button variant="outline" onClick={() => navigate('/roles/dashboard')}>Cancel</Button>
                        <Button onClick={handleSave} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Role'}</Button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default RoleProfile;