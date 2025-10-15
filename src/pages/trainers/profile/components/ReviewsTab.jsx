import React, { useState, useEffect, useCallback } from 'react';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/AppIcon';
import ConfirmationModal from '../../../../components/ui/ConfirmationModal';
import { getTrainerReviews, deleteTrainerReview } from '../../../../api/trainerService';

const StarRating = ({ rating, size = 16 }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars.push(<Icon key={i} name="Star" size={size} className="text-yellow-400 fill-current" />);
        } else if (i - 0.5 <= rating) {
            stars.push(<Icon key={i} name="StarHalf" size={size} className="text-yellow-400 fill-current" />);
        } else {
            stars.push(<Icon key={i} name="Star" size={size} className="text-gray-300" />);
        }
    }
    return <div className="flex items-center">{stars}</div>;
};

const ReviewsTab = ({ trainerId }) => {
    const [reviewsData, setReviewsData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [filterRate, setFilterRate] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [confirmationModal, setConfirmationModal] = useState({ isOpen: false });
    const [notification, setNotification] = useState({ message: '', type: '' });
    const reviewsPerPage = 4;

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: '', type: '' }), 5000);
    };

    const fetchReviews = useCallback(async () => {
        if (!trainerId) return;
        setIsLoading(true);
        try {
            const params = filterRate !== 'all' ? { rate: filterRate } : {};
            const response = await getTrainerReviews(trainerId, params);
            if (response.success) {
                setReviewsData(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch reviews", error);
        } finally {
            setIsLoading(false);
        }
    }, [trainerId, filterRate]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    // Client-side pagination logic
    const reviews = reviewsData?.reviews || [];
    const totalPages = Math.ceil(reviews.length / reviewsPerPage);
    const startIndex = (currentPage - 1) * reviewsPerPage;
    const currentReviews = reviews.slice(startIndex, startIndex + reviewsPerPage);

    const handleDeleteClick = (review) => {
        setConfirmationModal({
            isOpen: true,
            type: 'delete',
            title: 'Delete Review',
            message: `Are you sure you want to delete the review by "${review.name}"? This action cannot be undone.`,
            onConfirm: async () => {
                try {
                    await deleteTrainerReview(trainerId, review.id);
                    showNotification('Review deleted successfully!', 'success');
                } catch (error) {
                    showNotification('Failed to delete review. Please try again.', 'error');
                } finally {
                    setConfirmationModal({ isOpen: false });
                    fetchReviews();
                }
            }
        });
    };

    const formatKpiLabel = (key) => {
        return key
            .replace('_avg', '')
            .replace(/_/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <div className="space-y-6">
            {notification.message && (
                <div className={`p-4 rounded-md text-sm ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {notification.message}
                </div>
            )}

            {isLoading ? (
                <div className="flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading details...</p>
                    </div>
                </div>
            ) : !reviewsData ? (
                <div className="text-center py-12"><p className="text-muted-foreground">Could not load reviews.</p></div>
            ) : (
                <>
                    {/* KPIs and Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Overall Rating */}
                        <div className="bg-muted/30 border rounded-lg p-4 text-center lg:col-span-1">
                            <h4 className="text-sm font-medium text-muted-foreground">Overall Rating</h4>
                            <div className="text-3xl font-bold text-foreground my-2">{reviewsData.avg_rating.toFixed(1)}</div>
                            <div className="flex justify-center my-2">
                                <StarRating rating={reviewsData.avg_rating} />
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">{reviewsData.number_student_rating} ratings</p>
                        </div>
                        {/* Detailed KPIs */}
                        <div className="bg-muted/30 border rounded-lg p-4 lg:col-span-2">
                            <h4 className="text-sm font-medium text-muted-foreground mb-3">Detailed Breakdown</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                                {Object.entries(reviewsData.reviews_kpi).map(([key, value]) => (
                                    <div key={key} className="flex justify-between items-center">
                                        <span className="text-sm text-foreground">{formatKpiLabel(key)}</span>
                                        <div className="flex items-center gap-2">
                                            <StarRating rating={value} size={14} />
                                            <span className="text-sm font-semibold w-8 text-right">{value.toFixed(1)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Filter and Reviews List */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-foreground">Student Reviews</h3>
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium">Filter by:</label>
                                <div className="flex items-center space-x-1 bg-muted p-1 rounded-md">
                                    {['all', 5, 4, 3, 2, 1].map(rate => (
                                        <Button
                                            key={rate}
                                            variant={filterRate === rate ? 'default' : 'ghost'}
                                            size="sm"
                                            onClick={() => { setFilterRate(rate); setCurrentPage(1); }}
                                        >
                                            {rate === 'all' ? 'All' : `${rate} ★`}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {currentReviews.length > 0 ? (
                            <div className="space-y-4">
                                {currentReviews.map(review => (
                                    <div key={review.id} className="bg-muted/30 p-4 rounded-lg border">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"><Icon name="User" size={20} className="text-primary"/></div>
                                                <div>
                                                    <p className="font-semibold text-foreground">{review.name}</p>
                                                    <p className="text-xs text-muted-foreground">{new Date(review.created_at).toLocaleString()}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <StarRating rating={review.final_rating} />
                                                <Button
                                                    variant="ghost"
                                                    className="h-8 w-8 text-destructive"
                                                    size="xs"
                                                    onClick={() => handleDeleteClick(review)}
                                                >
                                                    <Icon name="Trash2" size={14} />
                                                </Button>

                                            </div>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-3 pl-12 border-l-2 ml-5">{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12"><p className="text-muted-foreground">No reviews found for this rating.</p></div>
                        )}

                        {/* Client-side Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-end items-center mt-6 gap-2">
                                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Previous</Button>
                                <span className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</span>
                                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</Button>
                            </div>
                        )}
                    </div>
                </>
            )}

            <ConfirmationModal
                isOpen={confirmationModal.isOpen}
                type={confirmationModal.type}
                title={confirmationModal.title}
                message={confirmationModal.message}
                onConfirm={confirmationModal.onConfirm}
                onCancel={() => setConfirmationModal({ isOpen: false })}
            />
        </div>
    );
};

export default ReviewsTab;