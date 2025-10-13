import React from 'react';
import Button from './Button';
import Icon from '../AppIcon';

const ConfirmationModal = ({ isOpen, type, title, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    const isWarning = type === 'warning';
    const isDestructive = type === 'delete-user';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-card rounded-lg shadow-xl w-full max-w-md m-4">

                    <div className="p-6 border-b border-border">
                        <div className="flex items-center space-x-3">
                            <div  className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 ${
                            isDestructive ? 'bg-red-100' : isWarning ? 'bg-yellow-100' : 'bg-blue-100'
                        }`}>
                            <Icon 
                                name={isDestructive ? 'Trash2' : isWarning ? 'AlertTriangle' : 'AlertCircle'}
                                size={20}
                                className={isDestructive ? 'text-red-600' : isWarning ? 'text-yellow-600' : 'text-blue-600'}
                            />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-foreground">{title}</h2>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <p className="text-muted-foreground whitespace-pre-line">
                            {message}
                        </p>
                    </div>

                <div className="bg-muted/50 px-6 py-3 flex flex-row-reverse space-x-2 space-x-reverse border-t border-border">
                    <Button
                        variant={isDestructive ? 'destructive' : 'default'}
                        onClick={onConfirm}
                        className={onConfirm ? '' : 'hidden'}
                    >
                        Confirm
                    </Button>
                    <Button variant="outline" onClick={onCancel}>
                        {isWarning ? 'OK' : 'Cancel'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;