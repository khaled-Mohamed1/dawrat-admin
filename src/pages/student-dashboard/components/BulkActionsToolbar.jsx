import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const BulkActionsToolbar = ({ selectedCount, onStatusChange, onClearSelection }) => {
    const [showStatusMenu, setShowStatusMenu] = useState(false);

    return (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                    <Icon name="CheckSquare" size={20} className="text-primary" />
                    <span className="font-medium text-foreground">
            {selectedCount} student{selectedCount > 1 ? 's' : ''} selected
          </span>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowStatusMenu(!showStatusMenu)}
                            className="flex items-center gap-2"
                        >
                            <Icon name="UserCheck" size={16} />
                            Change Status
                            <Icon name="ChevronDown" size={14} />
                        </Button>

                        {showStatusMenu && (
                            <div className="absolute top-full mt-1 right-0 z-10 w-40 bg-card border border-border rounded-lg shadow-lg py-1">
                                <button
                                    onClick={() => {
                                        onStatusChange('Active');
                                        setShowStatusMenu(false);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted flex items-center gap-2"
                                >
                                    <Icon name="UserCheck" size={16} className="text-green-600" />
                                    Activate
                                </button>

                                <button
                                    onClick={() => {
                                        onStatusChange('Inactive');
                                        setShowStatusMenu(false);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted flex items-center gap-2"
                                >
                                    <Icon name="UserX" size={16} className="text-red-600" />
                                    Deactivate
                                </button>
                            </div>
                        )}
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            // Handle bulk export
                            console.log('Export selected students');
                        }}
                        className="flex items-center gap-2"
                    >
                        <Icon name="Download" size={16} />
                        Export
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClearSelection}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        Clear Selection
                    </Button>
                </div>
            </div>

            {/* Click outside to close status menu */}
            {showStatusMenu && (
                <div
                    className="fixed inset-0 z-5"
                    onClick={() => setShowStatusMenu(false)}
                />
            )}
        </div>
    );
};

export default BulkActionsToolbar;