import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../../components/ui/DashboardLayout';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { getCouponDetails } from '../../../api/couponService';

const InfoItem = ({ label, value }) => (
    <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-semibold text-foreground mt-1">{value || 'N/A'}</p>
    </div>
);

const CouponProfile = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [coupon, setCoupon] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getCouponDetails(id)
            .then(res => setCoupon(res.data))
            .catch(err => {
                console.error("Failed to fetch coupon details", err);
                setCoupon(null);
            })
            .finally(() => setIsLoading(false));
    }, [id]);

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="space-y-6 animate-pulse">
                    <div className="h-9 w-36 bg-gray-200 rounded-md"></div>
                    <div className="bg-card rounded-lg border p-6 space-y-4">
                        <div className="h-7 w-1/3 bg-gray-200 rounded"></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="h-10 bg-gray-200 rounded-md"></div>
                            <div className="h-10 bg-gray-200 rounded-md"></div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (!coupon) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center text-center py-20">
                    <Icon name="Ticket" size={48} className="mx-auto text-destructive mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">Coupon Not Found</h3>
                    <p className="text-muted-foreground mb-6">The coupon you are looking for does not exist.</p>
                    <Button
                        variant="outline"
                        onClick={() => navigate('/coupons/dashboard')}
                        className="flex items-center gap-2"
                    >
                        <Icon name="ArrowLeft" size={16} />
                        Back to Coupons
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <Button variant="ghost" onClick={() => navigate('/coupons/dashboard')} className="flex items-center gap-2">
                    <Icon name="ArrowLeft"/> Back to Coupons
                </Button>
                <div className="bg-card rounded-lg border p-6">
                    <div className="flex justify-between items-start pb-4 border-b">
                        <div>
                            <h2 className="text-xl font-bold text-foreground">{coupon.title}</h2>
                            <p className="font-mono text-primary">{coupon.code}</p>
                        </div>
                        <span className="text-sm font-medium bg-blue-100 text-blue-800 px-3 py-1 rounded-full">{coupon.status}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
                        {/* Owner Info */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-foreground">Owner Details</h3>
                            <InfoItem label="Name" value={coupon.owner.full_name} />
                            <InfoItem label="Email" value={coupon.owner.email} />
                            <InfoItem label="Type" value={coupon.owner.type} />
                        </div>

                        {/* Coupon Details */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-foreground">Coupon Details</h3>
                            <InfoItem label="Discount Type" value={coupon.discount_type} />
                            <InfoItem label="Discount Value" value={coupon.discount_type === 'fixed' ? `$${coupon.discount}` : `${coupon.discount}%`} />
                            <InfoItem label="Start Date" value={new Date(coupon.started_at).toLocaleDateString()} />
                            <InfoItem label="End Date" value={new Date(coupon.ended_at).toLocaleDateString()} />
                        </div>

                        {/* Usage & Limits */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-foreground">Usage & Limits</h3>
                            <InfoItem label="Scope" value={coupon.scope.replace('_', ' ')} />
                            <InfoItem label="Times Used" value={`${coupon.uses_count} / ${coupon.uses_total}`} />
                            {coupon.scope === 'course_scope' && (
                                <InfoItem label="Min. Courses Threshold" value={coupon.min_courses_threshold} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CouponProfile;