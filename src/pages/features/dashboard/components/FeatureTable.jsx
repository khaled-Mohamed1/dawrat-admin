import React, { useState } from 'react';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/AppIcon';
import { cn } from '../../../../utils/cn';

// Sub-components
const StatusBadge = ({ status }) => {
    const isActive = status === 1;
    return <span className={cn('px-2 py-1 text-xs font-medium rounded-full', isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')}>{isActive ? 'Active' : 'Inactive'}</span>;
};

const ActionsDropdown = ({ feature, onViewDetails, onEditFeature, onStatusChange, onDeleteFeature }) => {
    const [isOpen, setIsOpen] = useState(false);
    const handleAction = (action) => { setIsOpen(false); action(); };

    return (
        <div className="relative">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="h-8 w-8"><Icon name="MoreVertical" /></Button>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 top-full mt-1 z-20 w-48 bg-card border rounded-md shadow-lg py-1">
                        <button onClick={() => handleAction(() => onViewDetails(feature.id))} className="w-full px-4 py-2 text-left text-sm hover:bg-accent flex items-center gap-2"><Icon name="Eye" size={14} /> View Details</button>
                        <button onClick={() => handleAction(() => onEditFeature(feature.id))} className="w-full px-4 py-2 text-left text-sm hover:bg-accent flex items-center gap-2"><Icon name="Edit" size={14} /> Edit Feature</button>
                        <button
                            onClick={() => handleAction(() => onStatusChange(feature))}
                            className={cn(
                                "w-full px-4 py-2 text-left text-sm hover:bg-accent flex items-center gap-2",
                                feature.status === 1 ? "text-red-600" : "text-green-600"
                            )}
                        >
                            <Icon name={feature.status === 1 ? "ToggleLeft" : "ToggleRight"} size={14} />
                            {feature.status === 1 ? "Deactivate" : "Activate"}
                        </button>
                        <div className="border-t my-1" />
                        <button onClick={() => handleAction(() => onDeleteFeature(feature))} className="w-full px-4 py-2 text-left text-sm text-destructive hover:bg-accent flex items-center gap-2"><Icon name="Trash2" size={14} /> Delete</button>
                    </div>
                </>
            )}
        </div>
    );
};

// Main Table Component
const FeatureTable = ({ features, isLoading, onViewDetails, onEditFeature, onStatusChange, onDeleteFeature }) => {
    if (isLoading) {
        return <div className="bg-card rounded-lg border p-4"><div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />)}</div></div>;
    }
    if (features.length === 0) {
        return <div className="bg-card rounded-lg border text-center py-12"><Icon name="List" size={48} className="mx-auto text-muted-foreground mb-4" /><h3 className="text-lg font-semibold">No Features Found</h3><p className="text-muted-foreground">Try adjusting your filters or adding a new feature.</p></div>;
    }

    return (
        <div className="bg-card rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-muted/50">
                    <tr>
                        <th className="p-4 text-left font-medium text-sm">Name</th>
                        <th className="p-4 text-left font-medium text-sm">Description</th>
                        <th className="p-4 text-left font-medium text-sm">Type Key</th>
                        <th className="p-4 text-center font-medium text-sm">Status</th>
                        <th className="p-4 text-center font-medium text-sm">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {features.map((feature) => (
                        <tr key={feature.id} className="border-b last:border-b-0 hover:bg-muted/25">
                            <td className="p-4 font-semibold text-foreground">{feature.name}</td>
                            <td className="p-4 text-sm text-muted-foreground max-w-md truncate">{feature.description}</td>
                            <td className="p-4 text-sm font-mono text-blue-600">{feature.type}</td>
                            <td className="p-4 text-center"><StatusBadge status={feature.status} /></td>
                            <td className="p-4">
                                <div className="flex items-center justify-center">
                                    <ActionsDropdown feature={feature} onViewDetails={onViewDetails} onEditFeature={onEditFeature} onStatusChange={onStatusChange} onDeleteFeature={onDeleteFeature} />
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FeatureTable;