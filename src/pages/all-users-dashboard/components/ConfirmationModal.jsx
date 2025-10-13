import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ConfirmationModal = ({ isOpen, title, message, type, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    const getModalConfig = (type) => {
        switch (type) {
            case 'delete-user':
                return {
                    iconName: 'Trash2',
                    iconColor: 'text-red-600',
                    confirmButtonVariant: 'destructive',
                    confirmButtonText: 'Delete User'
                };
            case 'reset-password':
                return {
                    iconName: 'Key',
                    iconColor: 'text-blue-600',
                    confirmButtonVariant: 'default',
                    confirmButtonText: 'Reset Password'
                };
            case 'status-change':
                return {
                    iconName: 'UserCheck',
                    iconColor: 'text-orange-600',
                    confirmButtonVariant: 'warning',
                    confirmButtonText: 'Change Status'
                };
            default:
                return {
                    iconName: 'AlertTriangle',
                    iconColor: 'text-yellow-600',
                    confirmButtonVariant: 'default',
                    confirmButtonText: 'Confirm'
                };
        }
    };

    const config = getModalConfig(type);

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                {/* Modal */}
                <div className="bg-card rounded-lg border shadow-xl max-w-md w-full">
                    {/* Header */}
                    <div className="p-6 border-b border-border">
                        <div className="flex items-center space-x-3">
                            <div className={`w-12 h-12 rounded-full bg-muted flex items-center justify-center ${config?.iconColor}`}>
                                <Icon name={config?.iconName} size={24} />
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

                    {/* Actions */}
                    <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
                        <Button
                            variant="outline"
                            onClick={onCancel}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant={config?.confirmButtonVariant}
                            onClick={onConfirm}
                        >
                            {config?.confirmButtonText}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ConfirmationModal;