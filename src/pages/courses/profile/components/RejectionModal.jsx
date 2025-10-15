import React, { useState } from 'react';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/AppIcon';

const RejectionModal = ({ isOpen, onClose, onSubmit }) => {
    const [reason, setReason] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) {
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!reason.trim()) return;

        setIsLoading(true);
        try {
            await onSubmit(reason);
        } finally {
            setIsLoading(false);
            setReason('');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-card rounded-lg shadow-xl w-full max-w-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-foreground">Rejection Reason</h3>
                    <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                        <Icon name="X" size={16} />
                    </Button>
                </div>

                <p className="text-sm text-muted-foreground mb-4">
                    Please provide a clear reason for rejecting this course. This will be sent to the provider.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="e.g., The course description is unclear..."
                        className="w-full h-32 p-2 border rounded-md bg-transparent text-sm"
                        required
                    />

                    <div className="flex justify-end space-x-3">
                        <Button variant="outline" type="button" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button variant="destructive" type="submit" disabled={isLoading || !reason.trim()}>
                            {isLoading ? 'Submitting...' : 'Submit Rejection'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RejectionModal;