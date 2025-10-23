import React, { useState, useEffect, useCallback } from 'react';
import Icon from '../../../../components/AppIcon';
import Pagination from '../../../../components/ui/Pagination';
import { getInterestedUsers } from '../../../../api/courseRequestService';
import {cn} from "../../../../utils/cn.js";

const InterestedUsersTab = ({ requestId }) => {
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchUsers = useCallback(async () => {
        if (!requestId) return;
        setIsLoading(true);
        try {
            const response = await getInterestedUsers(requestId, { page: currentPage });
            if (response.success) {
                setUsers(response.data);
                setPagination(response.meta);
            }
        } catch (error) {
            console.error("Failed to fetch interested users", error);
        } finally {
            setIsLoading(false);
        }
    }, [requestId, currentPage]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    return (
        <div className="p-6">
            {isLoading ? (
                <div className="space-y-4 animate-pulse">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
                                <div className="h-3 w-2/3 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : users.length === 0 ? (
                <div className="text-center py-8">
                    <Icon name="Users" size={48} className="text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No other users are interested in this demand yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {users.map(item => (
                        <div key={item.id} className="bg-muted/30 rounded-lg p-3 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <img src={item.user.file_url} alt={item.user.name} className="w-12 h-12 object-cover rounded-full" />
                                <div>
                                    <p className="font-semibold">{item.user.name}</p>
                                    <p className="text-sm text-muted-foreground">{item.user.sub_name}</p>
                                </div>
                            </div>

                            {/* **NEW**: Display the user type */}
                            <span className={cn(
                                'px-2 py-1 text-xs font-medium rounded-full',
                                item.type === 'trainer' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                            )}>
                                {item.type}
                            </span>
                        </div>
                    ))}
                </div>
            )}
            <div className="mt-6">
                <Pagination meta={pagination} onPageChange={setCurrentPage} />
            </div>
        </div>
    );
};

export default InterestedUsersTab;