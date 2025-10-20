import React from 'react';
import { cn } from '../../utils/cn';
const Switch = ({ checked, onChange, label, disabled = false }) => {
    return (
        <div className="flex items-center">
            <button
                type="button"
                className={cn(
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                    checked ? 'bg-primary' : 'bg-gray-200',
                    disabled && 'opacity-50 cursor-not-allowed'
                )}
                onClick={() => !disabled && onChange(!checked)}
                disabled={disabled}
            >
                <span className={cn(
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    checked ? 'translate-x-6' : 'translate-x-1'
                )} />
            </button>
            {label && (
                <span className="ml-3 text-sm font-medium text-foreground">{label}</span>
            )}
        </div>
    );
};

export default Switch;