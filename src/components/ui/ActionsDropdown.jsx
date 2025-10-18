import React, { useState } from 'react';
import Button from './Button';
import Icon from '../AppIcon';
import {
    useFloating,
    useClick,
    useDismiss,
    useInteractions,
    FloatingPortal,
    offset,
    flip,
} from '@floating-ui/react';
import { cn } from '../../utils/cn';

const ActionsDropdown = ({
                             item,
                             onView,
                             onEdit,
                             onDelete,
                             onStatusChange,
                             onResetPassword,
                             onTogglePause
                         }) => {
    const [isOpen, setIsOpen] = useState(false);

    const { refs, floatingStyles, context } = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
        placement: 'bottom-end',
        middleware: [offset(5), flip()],
    });

    const { getReferenceProps, getFloatingProps } = useInteractions([
        useClick(context),
        useDismiss(context),
    ]);

    const handleAction = (action) => {
        setIsOpen(false);
        action();
    };

    const status = String(item.status ?? '').toLowerCase();

    const isActive = item.status === 1 || status === 'active';
    const isPaused = status === 'paused';
    const canTogglePause = ['active', 'trial', 'paused'].includes(status);

    return (
        <>
            <Button
                ref={refs.setReference}
                {...getReferenceProps()}
                variant="ghost"
                size="icon"
                className="h-8 w-8"
            >
                <Icon name="MoreVertical" />
            </Button>

            <FloatingPortal>
                {isOpen && (
                    <div
                        ref={refs.setFloating}
                        style={floatingStyles}
                        {...getFloatingProps()}
                        className="z-50 w-48 bg-card border rounded-md shadow-lg py-1"
                    >
                        {onView && (
                            <button onClick={() => handleAction(() => onView(item.id))} className="w-full px-4 py-2 text-left text-sm hover:bg-accent flex items-center gap-2">
                                <Icon name="Eye" size={14} /> View Details
                            </button>
                        )}
                        {onEdit && (
                            <button onClick={() => handleAction(() => onEdit(item.id))} className="w-full px-4 py-2 text-left text-sm hover:bg-accent flex items-center gap-2">
                                <Icon name="Edit" size={14} /> Edit
                            </button>
                        )}

                        {onStatusChange && <div className="border-t my-1" />}

                        {onStatusChange && (
                            <button
                                onClick={() => handleAction(() => onStatusChange(item))}
                                className={cn("w-full px-4 py-2 text-left text-sm hover:bg-accent flex items-center gap-2",
                                    isActive ? "text-orange-600" : "text-green-600"
                                )}
                            >
                                <Icon name={isActive ? 'ToggleLeft' : 'ToggleRight'} size={14} /> {isActive ? 'Deactivate' : 'Activate'}
                            </button>
                        )}

                        {onResetPassword && (
                            <button onClick={() => handleAction(() => onResetPassword(item))} className="w-full px-4 py-2 text-left text-sm text-blue-600 hover:bg-accent flex items-center gap-2">
                                <Icon name="Key" size={14} /> Reset Password
                            </button>
                        )}

                        {onTogglePause && canTogglePause && (
                            <button
                                onClick={() => handleAction(() => onTogglePause(item))}
                                className={cn("w-full px-4 py-2 text-left text-sm hover:bg-accent flex items-center gap-2",
                                    isPaused ? "text-green-600" : "text-yellow-600"
                                )}
                            >
                                <Icon name={isPaused ? 'Play' : 'Pause'} size={14} /> {isPaused ? 'Unpause' : 'Pause'}
                            </button>
                        )}

                        {onDelete && <div className="border-t my-1" />}

                        {onDelete && (
                            <button onClick={() => handleAction(() => onDelete(item))} className="w-full px-4 py-2 text-left text-sm text-destructive hover:bg-accent flex items-center gap-2">
                                <Icon name="Trash2" size={14} /> Delete
                            </button>
                        )}
                    </div>
                )}
            </FloatingPortal>
        </>
    );
};

export default ActionsDropdown;