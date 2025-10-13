import React from 'react';
import Button from '../../../components/ui/Button';

const FilterButtons = ({ activeFilter, onFilterChange }) => {
    const filters = [
        { key: '7-day', label: '7 Days' },
        { key: 'month', label: 'Month' },
        { key: 'quarter', label: 'Quarter' },
        { key: 'year', label: 'Year' }
    ];

    return (
        <div className="flex items-center space-x-2 bg-accent rounded-lg p-1">
            {filters?.map((filter) => (
                <Button
                    key={filter?.key}
                    variant={activeFilter === filter?.key ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => onFilterChange(filter?.key)}
                    className={`transition-all duration-200 ${
                        activeFilter === filter?.key
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'hover:bg-background'
                    }`}
                >
                    {filter?.label}
                </Button>
            ))}
        </div>
    );
};

export default FilterButtons;