import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import { resetUserPassword } from '../../../api/userService';

const ResetPasswordModal = ({ isOpen, onClose, user, onSuccess }) => {
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen || !user) {
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await resetUserPassword(user.id, newPassword);
            onSuccess(`Password for ${user.full_name} has been reset successfully.`);
            onClose();
            setNewPassword('');
        } catch (err) {
            setError(err.response.data.message || 'Failed to reset password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-card rounded-lg shadow-xl w-full max-w-md p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-foreground">Reset Password</h3>
                    <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                        <Icon name="X" size={16} />
                    </Button>
                </div>

                <p className="text-sm text-muted-foreground mb-4">
                    Enter a new password for <span className="font-medium text-foreground">{user.full_name}</span>.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Input
                            id="new-password"
                            type="text"
                            placeholder="Enter new password (min. 8 characters)"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <div className="p-3 text-sm text-red-800 bg-red-100 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end space-x-3">
                        <Button variant="outline" type="button" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Resetting...' : 'Reset Password'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordModal;