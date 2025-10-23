import React from 'react';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/AppIcon';
import ActionsDropdown from '../../../../components/ui/ActionsDropdown';
import { cn } from '../../../../utils/cn';

const SectionTable = ({ sections, isLoading, onView, onEdit, onDelete, onStatusChange, onMove }) => {

    if (isLoading) {
        return <div className="bg-card rounded-lg border p-4"><div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />)}</div></div>;
    }
    if (sections.length === 0) {
        return <div className="bg-card rounded-lg border text-center py-12"><Icon name="LayoutDashboard" size={48} className="mx-auto text-muted-foreground mb-4" /><h3 className="text-lg font-semibold">No Sections Found</h3></div>;
    }

    return (
        <div className="bg-card rounded-lg border overflow-hidden">
            <table className="w-full">
                <thead className="bg-muted/50">
                <tr>
                    <th className="p-3 text-left font-medium text-sm">Order</th>
                    <th className="p-3 text-left font-medium text-sm">Section Title</th>
                    <th className="p-3 text-left font-medium text-sm">Type</th>
                    <th className="p-3 text-center font-medium text-sm">Status</th>
                    <th className="p-3 text-center font-medium text-sm">Actions</th>
                </tr>
                </thead>
                <tbody>
                {sections.map((section, index) => (
                    <tr key={section.id} className="border-b last:border-b-0 hover:bg-muted/25">
                        <td className="p-3">
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-sm">{index + 1}</span>
                                <div className="flex flex-col">
                                    <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => onMove(index, 'up')} disabled={index === 0}>
                                        <Icon name="ChevronUp" size={14} />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => onMove(index, 'down')} disabled={index === sections.length - 1}>
                                        <Icon name="ChevronDown" size={14} />
                                    </Button>
                                </div>
                            </div>
                        </td>
                        <td className="p-3">
                            <p className="font-medium text-foreground">{section.title_en}</p>
                            <p className="text-sm text-muted-foreground">{section.title_ar}</p>
                        </td>
                        <td className="p-3 font-mono text-xs text-blue-600">{section.type}</td>
                        <td className="p-3 text-center">
                                <span className={cn('px-2 py-1 text-xs font-medium rounded-full', section.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')}>
                                    {section.status ? 'Active' : 'Inactive'}
                                </span>
                        </td>
                        <td className="p-3">
                            <div className="flex items-center justify-center">
                                <ActionsDropdown item={section} onView={onView} onEdit={onEdit} onDelete={onDelete} onStatusChange={onStatusChange} />
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default SectionTable;