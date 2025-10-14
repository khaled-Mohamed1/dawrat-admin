import React, { useState, useEffect, useCallback } from 'react';
import Icon from '../../../../components/AppIcon';
import Pagination from '../../../../components/ui/Pagination';
import { getTrainerCenters } from '../../../../api/trainerService';
import { cn } from '../../../../utils/cn';

const CentersTab = ({ trainerId }) => {
    const [centers, setCenters] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchCenters = useCallback(async () => {
        if (!trainerId) return;
        setIsLoading(true);
        try {
            const response = await getTrainerCenters(trainerId, { page: currentPage });
            if (response.success) {
                setCenters(response.data);
                setPagination(response.meta);
            }
        } catch (error) {
            console.error("Failed to fetch trainer centers", error);
        } finally {
            setIsLoading(false);
        }
    }, [trainerId, currentPage]);

    useEffect(() => {
        fetchCenters();
    }, [fetchCenters]);

    const StatusBadge = ({ isActive }) => (
        <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
            isActive ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'
        )}>
            {isActive ? 'Active' : 'Inactive'}
        </span>
    );

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground">Centers</h3>

            {isLoading ? (
                <div className="flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading details...</p>
                    </div>
                </div>
            ) : centers.length === 0 ? (
                <div className="text-center py-12">
                    <Icon name="Building" size={48} className="mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">This trainer is not affiliated with any centers.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {centers.map(center => (
                        <div key={center.id} className="bg-muted/30 rounded-lg p-4 border border-border/50 flex items-start gap-4">
                            <img src={center.file_url} alt={center.name} className="w-16 h-16 object-contain rounded-md flex-shrink-0" />
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-semibold text-foreground">{center.name}</h4>
                                        <p className="text-sm text-muted-foreground">{center.sub_title}</p>
                                    </div>
                                    <StatusBadge isActive={center.is_active} />
                                </div>
                                <div className="border-t my-3"></div>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                    <a href={`mailto:${center.email}`} className="flex items-center gap-1 hover:text-primary">
                                        <Icon name="Mail" size={14} />{center.email}
                                    </a>
                                    <span className="flex items-center gap-1">
                                        <Icon name="Phone" size={14} />{center.phone.phone_code} {center.phone.phone_number}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Icon name="BookOpen" size={14} />{center.assign_courses} Courses
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Pagination meta={pagination} onPageChange={setCurrentPage} />
        </div>
    );
};

export default CentersTab;