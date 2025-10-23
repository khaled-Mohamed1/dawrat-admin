import React from 'react';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/AppIcon';
import ActionsDropdown from '../../../../components/ui/ActionsDropdown';
import { cn } from '../../../../utils/cn';

const CouponTable = ({ coupons, isLoading, onView, onDelete, onStatusChange }) => {

    const getStatusColor = (status) => {
        const s = status?.toLowerCase();
        if (s === 'active') return 'bg-green-100 text-green-800';
        if (s === 'expired' || s === 'inactive') return 'bg-gray-100 text-gray-800';
        if (s === 'draft') return 'bg-yellow-100 text-yellow-800';
        return 'bg-gray-100';
    };

    return (
        <div className="bg-card rounded-lg border overflow-hidden">
            <table className="w-full">
                <thead className="bg-muted/50">
                <tr>
                    <th className="p-3 text-left font-medium text-sm">Code</th>
                    <th className="p-3 text-left font-medium text-sm">Owner</th>
                    <th className="p-3 text-left font-medium text-sm">Discount</th>
                    <th className="p-3 text-left font-medium text-sm">Effective Dates</th>
                    <th className="p-3 text-center font-medium text-sm">Status</th>
                    <th className="p-3 text-center font-medium text-sm">Actions</th>
                </tr>
                </thead>
                <tbody>
                {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i} className="border-b last:border-b-0">
                            <td className="p-3" colSpan={6}><div className="h-6 bg-gray-200 rounded animate-pulse"></div></td>
                        </tr>
                    ))
                ) : coupons.length === 0 ? (
                    <tr>
                        <td colSpan={6} className="text-center py-12">
                            <Icon name="Ticket" size={48} className="mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold">No Coupons Found</h3>
                            <p className="text-muted-foreground">Try adjusting your filters or add a new coupon.</p>
                        </td>
                    </tr>
                ) : (
                    coupons.map((coupon) => (
                        <tr key={coupon.id} className="border-b last:border-b-0 hover:bg-muted/25">
                            <td className="p-3">
                                <p className="font-mono text-sm font-semibold">{coupon.code}</p>
                                <p className="text-xs text-muted-foreground">{coupon.title}</p>
                            </td>
                            <td className="p-3">
                                <p className="font-medium text-foreground">{coupon.owner.full_name}</p>
                                <p className="text-sm text-muted-foreground capitalize">{coupon.owner.type}</p>
                            </td>
                            <td className="p-3 text-sm">
                                {coupon.discount_type === 'fixed' ? `$${coupon.discount}` : `${coupon.discount}%`}
                            </td>
                            <td className="p-3 text-sm text-muted-foreground">
                                {new Date(coupon.started_at).toLocaleDateString()} - {new Date(coupon.ended_at).toLocaleDateString()}
                            </td>
                            <td className="p-3 text-center">
                                <span className={cn('px-2 py-1 text-xs font-medium rounded-full capitalize', getStatusColor(coupon.status))}>
                                    {coupon.status}
                                </span>
                            </td>
                            <td className="p-3">
                                <div className="flex items-center justify-center">
                                    <ActionsDropdown item={coupon} onView={onView} onDelete={onDelete} onStatusChange={onStatusChange} />
                                </div>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
};

export default CouponTable;