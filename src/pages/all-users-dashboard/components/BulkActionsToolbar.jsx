import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const BulkActionsToolbar = ({ selectedCount, onBulkAction, onClearSelection }) => {
    const [isActionsOpen, setIsActionsOpen] = useState(false);

    const handleAction = (action) => {
        setIsActionsOpen(false);
        onBulkAction(action);
    };

    return (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 rounded bg-primary flex items-center justify-center">
                            <Icon name="Check" size={12} color="white" />
                        </div>
                        <span className="text-sm font-medium text-foreground">
              {selectedCount} user{selectedCount > 1 ? 's' : ''} selected
            </span>
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        iconName="X"
                        onClick={onClearSelection}
                    >
                        Clear Selection
                    </Button>
                </div>

                <div className="flex items-center space-x-2">
                    <div className="relative">
                        <Button
                            variant="outline"
                            size="sm"
                            iconName="Settings"
                            onClick={() => setIsActionsOpen(!isActionsOpen)}
                        >
                            Bulk Actions
                        </Button>

                        {isActionsOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setIsActionsOpen(false)}
                                />
                                <div className="absolute right-0 top-10 z-20 w-48 bg-card border border-border rounded-md shadow-lg py-1">
                                    <button
                                        onClick={() => handleAction('activate')}
                                        className="w-full px-4 py-2 text-left text-sm hover:bg-accent transition-colors flex items-center text-green-600"
                                    >
                                        <Icon name="UserCheck" size={16} className="mr-2" />
                                        Activate Users
                                    </button>

                                    <button
                                        onClick={() => handleAction('deactivate')}
                                        className="w-full px-4 py-2 text-left text-sm hover:bg-accent transition-colors flex items-center text-orange-600"
                                    >
                                        <Icon name="UserX" size={16} className="mr-2" />
                                        Deactivate Users
                                    </button>

                                    <button
                                        onClick={() => handleAction('export')}
                                        className="w-full px-4 py-2 text-left text-sm hover:bg-accent transition-colors flex items-center text-blue-600"
                                    >
                                        <Icon name="Download" size={16} className="mr-2" />
                                        Export Selected
                                    </button>

                                    <div className="border-t my-1" />

                                    <button
                                        onClick={() => handleAction('delete')}
                                        className="w-full px-4 py-2 text-left text-sm hover:bg-accent text-destructive transition-colors flex items-center"
                                    >
                                        <Icon name="Trash2" size={16} className="mr-2" />
                                        Delete Users
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BulkActionsToolbar;