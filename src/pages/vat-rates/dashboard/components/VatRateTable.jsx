import React from 'react';
import Icon from '../../../../components/AppIcon';
import ActionsDropdown from '../../../../components/ui/ActionsDropdown';
import { cn } from '../../../../utils/cn';

const VatRateTable = ({ rates, isLoading, onView, onEdit, onDelete }) => {
    return (
        <div className="bg-card rounded-lg border overflow-hidden">
            <table className="w-full">
                <thead className="bg-muted/50 border-b">
                <tr>
                    <th className="p-4 text-left font-medium text-sm">Code</th>
                    <th className="p-4 text-center font-medium text-sm">Rate (%)</th>
                    <th className="p-4 text-left font-medium text-sm">Effective From</th>
                    <th className="p-4 text-center font-medium text-sm">Status</th>
                    <th className="p-4 text-center font-medium text-sm">Actions</th>
                </tr>
                </thead>
                <tbody>
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <tr key={i} className="border-b last:border-b-0">
                            <td className="p-4" colSpan={5}><div className="h-6 bg-gray-200 rounded animate-pulse"></div></td>
                        </tr>
                    ))
                ) : rates.length === 0 ? (
                    <tr>
                        <td colSpan={5} className="text-center py-12">
                            <Icon name="Percent" size={48} className="mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold">No VAT Rates Found</h3>
                            <p className="text-muted-foreground">Click "Add New Rate" to create one.</p>
                        </td>
                    </tr>
                ) : (
                    rates.map((rate) => (
                        <tr key={rate.id} className="border-b last:border-b-0 hover:bg-muted/25">
                            <td className="p-4 font-mono text-xs">{rate.code}</td>
                            <td className="p-4 text-center font-semibold">{parseFloat(rate.rate).toFixed(2)}%</td>
                            <td className="p-4 text-sm text-muted-foreground">{new Date(rate.effective_from).toLocaleDateString()}</td>
                            <td className="p-4 text-center">
                                    <span className={cn('px-2 py-1 text-xs font-medium rounded-full', rate.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')}>
                                        {rate.status === 'active' ? 'Active' : 'Inactive'}
                                    </span>
                            </td>
                            <td className="p-4">
                                <div className="flex items-center justify-center">
                                    <ActionsDropdown item={rate} onView={onView} onEdit={onEdit} onDelete={onDelete} />
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

export default VatRateTable;