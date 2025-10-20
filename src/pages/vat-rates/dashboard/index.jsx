import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../components/ui/DashboardLayout.jsx";
import Button from "../../../components/ui/Button.jsx";
import Pagination from "../../../components/ui/Pagination.jsx";
import ConfirmationModal from "../../../components/ui/ConfirmationModal.jsx";
import VatRateTable from './components/VatRateTable';
import { getVatRates, deleteVatRate } from '../../../api/vatRateService';

const VatRatesDashboard = () => {
    const navigate = useNavigate();
    const [vatRates, setVatRates] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [confirmationModal, setConfirmationModal] = useState({ isOpen: false });
    const [currentPage, setCurrentPage] = useState(1);

    const fetchRates = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getVatRates({ page: currentPage });
            if (response.success) {
                setVatRates(response.data);
                setPagination(response.meta);
            }
        } catch (error) {
            console.error("Failed to fetch VAT rates", error);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage]);

    useEffect(() => {
        fetchRates();
    }, [fetchRates]);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: '', type: '' }), 5000);
    };

    const handleDelete = (rate) => {
        setConfirmationModal({
            isOpen: true,
            type: 'delete',
            title: 'Delete VAT Rate',
            message: `Are you sure you want to delete the rate with code "${rate.code}"?`,
            onConfirm: async () => {
                try {
                    await deleteVatRate(rate.id);
                    showNotification('VAT rate deleted successfully.', 'success');
                    fetchRates();
                } catch (error) {
                    showNotification('Failed to delete rate.', 'error');
                } finally {
                    setConfirmationModal({ isOpen: false });
                }
            }
        });
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
                        <h1 className="text-3xl font-bold">VAT Rates Management</h1>
                        <p className="text-muted-foreground mt-1">Configure tax rates and their effective dates.</p>
                    </div>
                    <Button onClick={() => navigate('/vat-rates/details/new')} iconName="Plus">
                        Add New Rate
                    </Button>
                </div>

                <VatRateTable
                    rates={vatRates}
                    isLoading={isLoading}
                    onDelete={handleDelete}
                    onEdit={(id) => navigate(`/vat-rates/details/${id}?mode=edit`)}
                    onView={(id) => navigate(`/vat-rates/details/${id}`)}
                />

                <Pagination meta={pagination} onPageChange={setCurrentPage} />
                <ConfirmationModal isOpen={confirmationModal.isOpen} {...confirmationModal} onCancel={() => setConfirmationModal({ isOpen: false })} />
            </div>
        </DashboardLayout>
    );
};

export default VatRatesDashboard;