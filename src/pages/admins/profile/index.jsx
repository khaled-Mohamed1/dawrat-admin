import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import DashboardLayout from '../../../components/ui/DashboardLayout';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';
import { getAdminDetails, createAdmin, updateAdmin } from '../../../api/adminService';
import { getRoles } from '../../../api/roleService';

const AdminProfile = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const isCreateMode = id === 'new';
    const isEditMode = searchParams.get('mode') === 'edit';

    const [admin, setAdmin] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            getRoles().then(res => {
                if (res.success) {
                    const adminRoles = res.data.filter(role => !['student', 'trainer', 'center'].includes(role.name));
                    setRoles(adminRoles);
                }
            });

            if (isCreateMode) {
                setAdmin({ name: '', email: '', password: '', password_confirmation: '', role: '' });
            } else {
                try {
                    const response = await getAdminDetails(id);
                    setAdmin({ ...response.data, password: '', password_confirmation: '', role: response.data.roles?.[0]?.name });
                } catch (error) {
                    setAdmin(null);
                }
            }
            setIsLoading(false);
        };
        fetchData();
    }, [id, isCreateMode]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            if (isCreateMode) await createAdmin(admin);
            else await updateAdmin(id, admin);
            navigate('/admins/dashboard');
        } catch (error) {
            console.error("Failed to save admin", error);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="space-y-6 animate-pulse">
                    <div className="h-9 w-36 bg-gray-200 rounded-md"></div>
                    <div className="bg-card rounded-lg border p-6 space-y-4">
                        <div className="h-7 w-1/3 bg-gray-200 rounded"></div>
                        <div className="h-10 bg-gray-200 rounded-md"></div>
                        <div className="h-10 bg-gray-200 rounded-md"></div>
                        <div className="flex justify-end pt-6 mt-6 border-t">
                            <div className="h-9 w-24 bg-gray-200 rounded-md"></div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (!admin) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center text-center py-20">
                    <Icon name="UserX" size={48} className="mx-auto text-destructive mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">Admin Not Found</h3>
                    <p className="text-muted-foreground mb-6">
                        The admin you are looking for does not exist or could not be loaded.
                    </p>
                    <Button
                        variant="outline"
                        onClick={() => navigate('/admins/dashboard')}
                        className="flex items-center gap-2"
                    >
                        <Icon name="ArrowLeft" size={16} />
                        Back to Admins
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
                        <Button variant="ghost" onClick={() => navigate('/admins/dashboard')}><Icon name="ArrowLeft"/> Back to Admins</Button>
                        <Button onClick={() => navigate(`?mode=edit`)} iconName="Edit">Edit Admin</Button>
                    </div>
                    <div className="bg-card rounded-lg border p-6 space-y-4">
                        <p className="text-sm text-muted-foreground">Name</p><h2 className="text-xl font-bold">{admin.name}</h2>
                        <p className="text-sm text-muted-foreground">Email</p><p>{admin.email}</p>
                        <p className="text-sm text-muted-foreground">Role</p><p className="font-semibold capitalize">{admin.roles?.[0]?.name.replace('_', ' ')}</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    const roleOptions = roles.map(r => ({ label: r.name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()), value: r.name }));

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <Button variant="ghost" onClick={() => navigate('/admins/dashboard')}><Icon name="ArrowLeft"/> Back to Admins</Button>
                <div className="bg-card rounded-lg border p-6">
                    <h2 className="text-xl font-bold mb-6">{isCreateMode ? 'Create New Admin' : 'Edit Admin'}</h2>
                    <div className="space-y-4 max-w-lg">
                        <Input label="Name" value={admin.name} onChange={e => setAdmin({ ...admin, name: e.target.value })} />
                        <Input label="Email" type="email" value={admin.email} onChange={e => setAdmin({ ...admin, email: e.target.value })} />
                        <Select label="Role" value={admin.role} onChange={val => setAdmin({ ...admin, role: val })} options={roleOptions} />
                        <Input label="Password" type="password" value={admin.password} onChange={e => setAdmin({ ...admin, password: e.target.value })} helperText={isEditMode ? "Leave blank to keep current password." : ""} />
                        <Input label="Confirm Password" type="password" value={admin.password_confirmation} onChange={e => setAdmin({ ...admin, password_confirmation: e.target.value })} />
                    </div>
                    <div className="flex justify-end gap-4 pt-6 mt-6 border-t">
                        <Button variant="outline" onClick={() => navigate('/admins/dashboard')}>Cancel</Button>
                        <Button onClick={handleSave} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</Button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminProfile;