import React from 'react';
import Button from './Button';
import Icon from '../AppIcon';

const Pagination = ({ meta, onPageChange }) => {
    if (!meta || meta.last_page <= 1) {
        return null;
    }

    return (
        <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted-foreground">
                Showing {meta.from} to {meta.to} of {meta.total} results
            </div>
            <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(meta.current_page - 1)}
                    disabled={meta.current_page === 1}
                    iconName="ChevronLeft"
                />
                <span className="text-sm font-medium text-foreground px-2">
                    Page {meta.current_page} of {meta.last_page}
                </span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(meta.current_page + 1)}
                    disabled={meta.current_page === meta.last_page}
                    iconName="ChevronRight"
                />
            </div>
        </div>
    );
};

export default Pagination;