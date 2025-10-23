import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../components/ui/DashboardLayout.jsx";
import Button from "../../../components/ui/Button.jsx";
import Pagination from "../../../components/ui/Pagination.jsx";
import ConfirmationModal from "../../../components/ui/ConfirmationModal.jsx";
import SectionTable from './components/SectionTable';
import { getSections, deleteSection, changeSectionStatus, updateSectionOrder } from '../../../api/sectionService';

const SectionsDashboard = () => {
    const navigate = useNavigate();
    const [sections, setSections] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [confirmationModal, setConfirmationModal] = useState({ isOpen: false });
    const [currentPage, setCurrentPage] = useState(1);
    const [hasOrderChanges, setHasOrderChanges] = useState(false);
    const [isSavingOrder, setIsSavingOrder] = useState(false);

    const fetchSections = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getSections({ page: currentPage });
            if (response.success) {
                setSections(response.data);
                setPagination(response.meta);
            }
        } catch (error) { console.error("Failed to fetch sections", error); }
        finally { setIsLoading(false); }
    }, [currentPage]);

    useEffect(() => { fetchSections(); }, [fetchSections]);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: '', type: '' }), 5000);
    };

    const handleDelete = (section) => {
        setConfirmationModal({
            isOpen: true,
            type: 'delete',
            title: 'Delete Section',
            message: `Are you sure you want to delete "${section.title_en}"? This may affect your homepage layout.`,
            onConfirm: async () => {
                try {
                    const response = await deleteSection(section.id);
                    showNotification(response.message || 'Section deleted successfully.', 'success');
                    fetchSections();
                } catch (error) {
                    showNotification(error.message || 'Failed to delete section.', 'error');
                } finally {
                    setConfirmationModal({ isOpen: false });
                }
            }
        });
    };

    const handleStatusChange = (section) => {
        const newStatus = section.status ? 0 : 1;
        const actionText = newStatus === 1 ? 'activate' : 'deactivate';
        setConfirmationModal({
            isOpen: true,
            type: 'status-change',
            title: `${actionText.charAt(0).toUpperCase() + actionText.slice(1)} Section`,
            message: `Are you sure you want to ${actionText} the "${section.title_en}" section?`,
            onConfirm: async () => {
                try {
                    const response = await changeSectionStatus(section.id, { status: newStatus });
                    showNotification(response.message || 'Status updated successfully.', 'success');
                    fetchSections();
                } catch (error) {
                    showNotification(error.message || 'Failed to update status.', 'error');
                } finally {
                    setConfirmationModal({ isOpen: false });
                }
            }
        });
    };

    const handleMove = (index, direction) => {
        const newSections = [...sections];
        if (direction === 'up' && index > 0) {
            [newSections[index-1], newSections[index]] = [newSections[index], newSections[index-1]];
        } else if (direction === 'down' && index < newSections.length - 1) {
            [newSections[index], newSections[index+1]] = [newSections[index+1], newSections[index]];
        }
        setSections(newSections);
        setHasOrderChanges(true);
    };

    const handleSaveOrder = async () => {
        setIsSavingOrder(true);
        const orderIds = sections.map(s => s.id);
        try {
            await updateSectionOrder(orderIds);
            showNotification('Section order saved successfully.', 'success');
            setHasOrderChanges(false);
        } catch (error) {
            showNotification('Failed to save order.', 'error');
            fetchSections(); // Revert to server order on failure
        } finally {
            setIsSavingOrder(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {notification.message && (
                    <div className={`p-4 rounded-md text-sm ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {notification.message}
                    </div>
                )}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Home Page Sections</h1>
                        <p className="text-muted-foreground mt-1">Manage and reorder homepage content sections.</p>
                    </div>
                    <div className="flex gap-2">
                        {hasOrderChanges && (
                            <Button onClick={handleSaveOrder} iconName={isSavingOrder ? 'Loader' : 'Save'} disabled={isSavingOrder}>
                                {isSavingOrder ? 'Saving...' : 'Save Order'}
                            </Button>
                        )}
                        <Button onClick={() => navigate('/sections/details/new')} iconName="Plus">
                            Add New Section
                        </Button>
                    </div>
                </div>

                <SectionTable
                    sections={sections}
                    isLoading={isLoading}
                    onDelete={handleDelete}
                    onEdit={(id) => navigate(`/sections/details/${id}?mode=edit`)}
                    onView={(id) => navigate(`/sections/details/${id}`)}
                    onStatusChange={handleStatusChange}
                    onMove={handleMove}
                />

                <Pagination meta={pagination} onPageChange={setCurrentPage} />
                <ConfirmationModal isOpen={confirmationModal.isOpen} {...confirmationModal} onCancel={() => setConfirmationModal({ isOpen: false })} />
            </div>
        </DashboardLayout>
    );
};

export default SectionsDashboard;