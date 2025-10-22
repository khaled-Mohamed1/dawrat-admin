import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../components/ui/DashboardLayout.jsx";
import Pagination from "../../../components/ui/Pagination.jsx";
import ConfirmationModal from "../../../components/ui/ConfirmationModal.jsx";
import CenterRequestTable from './components/CenterRequestTable';
import { getCenterRequests, deleteCenterRequest } from '../../../api/centerRequestService';

const CenterRequestsDashboard = () => {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [confirmationModal, setConfirmationModal] = useState({ isOpen: false });
    const [currentPage, setCurrentPage] = useState(1);

    const fetchRequests = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getCenterRequests({ page: currentPage });
            if (response.success) {
                setRequests(response.data);
                setPagination(response.meta);
            }
        } catch (error) {
            console.error("Failed to fetch requests", error);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage]);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const handleDelete = (request) => {
        setConfirmationModal({
            isOpen: true, type: 'delete', title: 'Delete Request',
            message: `Are you sure you want to delete the request from "${request.center_name}"?`,
            onConfirm: async () => {
                try {
                    await deleteCenterRequest(request.id);
                    fetchRequests();
                } catch (error) {
                    console.error("Delete failed", error);
                } finally {
                    setConfirmationModal({ isOpen: false });
                }
            }
        });
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Center Registration Requests</h1>
                    <p className="text-muted-foreground mt-1">Review and approve or reject new center applications.</p>
                </div>

                <CenterRequestTable
                    requests={requests}
                    isLoading={isLoading}
                    onDelete={handleDelete}
                    onView={(id) => navigate(`/center-requests/details/${id}`)}
                />

                <Pagination meta={pagination} onPageChange={setCurrentPage} />
                <ConfirmationModal isOpen={confirmationModal.isOpen} {...confirmationModal} onCancel={() => setConfirmationModal({ isOpen: false })} />
            </div>
        </DashboardLayout>
    );
};

export default CenterRequestsDashboard;