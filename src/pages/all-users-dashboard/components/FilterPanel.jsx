import React from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';


const FilterPanel = ({ isOpen, onClose, filters, onFiltersChange }) => {
    const handleFilterChange = (key, value) => {
        onFiltersChange(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const resetFilters = () => {
        onFiltersChange({
            country: 'all',
            registrationDateFrom: '',
            registrationDateTo: '',
            lastLoginFrom: '',
            lastLoginTo: ''
        });
    };

    const applyFilters = () => {
        // Filters are applied in real-time, just close the panel
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={onClose}
            />
            {/* Filter Panel */}
            <div className="fixed right-0 top-0 h-full w-80 bg-card border-l border-border z-50 shadow-xl">
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-border">
                        <h2 className="text-lg font-semibold text-foreground">Advanced Filters</h2>
                        <Button
                            variant="ghost"
                            size="sm"
                            iconName="X"
                            onClick={onClose}
                            className="h-8 w-8 p-0"
                        />
                    </div>

                    {/* Filter Content */}
                    <div className="flex-1 p-4 space-y-6 overflow-y-auto">
                        {/* Country Filter */}
                        <div>
                            <label className="text-sm font-medium text-foreground mb-2 block">
                                Country
                            </label>
                            <Select
                                value={filters?.country || 'all'}
                                onValueChange={(value) => handleFilterChange('country', value)}
                                className="w-full"
                            >
                                <option value="all">All Countries</option>
                                <option value="UAE">United Arab Emirates</option>
                                <option value="Saudi Arabia">Saudi Arabia</option>
                                <option value="Qatar">Qatar</option>
                                <option value="Kuwait">Kuwait</option>
                                <option value="Bahrain">Bahrain</option>
                                <option value="Oman">Oman</option>
                            </Select>
                        </div>

                        {/* Registration Date Range */}
                        <div>
                            <label className="text-sm font-medium text-foreground mb-2 block">
                                Registration Date Range
                            </label>
                            <div className="space-y-3">
                                <Input
                                    type="date"
                                    label="From"
                                    value={filters?.registrationDateFrom || ''}
                                    onChange={(e) => handleFilterChange('registrationDateFrom', e?.target?.value)}
                                />
                                <Input
                                    type="date"
                                    label="To"
                                    value={filters?.registrationDateTo || ''}
                                    onChange={(e) => handleFilterChange('registrationDateTo', e?.target?.value)}
                                />
                            </div>
                        </div>

                        {/* Last Login Date Range */}
                        <div>
                            <label className="text-sm font-medium text-foreground mb-2 block">
                                Last Login Date Range
                            </label>
                            <div className="space-y-3">
                                <Input
                                    type="date"
                                    label="From"
                                    value={filters?.lastLoginFrom || ''}
                                    onChange={(e) => handleFilterChange('lastLoginFrom', e?.target?.value)}
                                />
                                <Input
                                    type="date"
                                    label="To"
                                    value={filters?.lastLoginTo || ''}
                                    onChange={(e) => handleFilterChange('lastLoginTo', e?.target?.value)}
                                />
                            </div>
                        </div>

                        {/* Quick Presets */}
                        <div>
                            <label className="text-sm font-medium text-foreground mb-2 block">
                                Quick Date Presets
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        const today = new Date();
                                        const lastWeek = new Date(today?.getTime() - 7 * 24 * 60 * 60 * 1000);
                                        handleFilterChange('registrationDateFrom', lastWeek?.toISOString()?.split('T')?.[0]);
                                        handleFilterChange('registrationDateTo', today?.toISOString()?.split('T')?.[0]);
                                    }}
                                >
                                    Last Week
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        const today = new Date();
                                        const lastMonth = new Date(today?.getFullYear(), today?.getMonth() - 1, today?.getDate());
                                        handleFilterChange('registrationDateFrom', lastMonth?.toISOString()?.split('T')?.[0]);
                                        handleFilterChange('registrationDateTo', today?.toISOString()?.split('T')?.[0]);
                                    }}
                                >
                                    Last Month
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        const today = new Date();
                                        const lastQuarter = new Date(today?.getFullYear(), today?.getMonth() - 3, today?.getDate());
                                        handleFilterChange('registrationDateFrom', lastQuarter?.toISOString()?.split('T')?.[0]);
                                        handleFilterChange('registrationDateTo', today?.toISOString()?.split('T')?.[0]);
                                    }}
                                >
                                    Last Quarter
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        const today = new Date();
                                        const lastYear = new Date(today?.getFullYear() - 1, today?.getMonth(), today?.getDate());
                                        handleFilterChange('registrationDateFrom', lastYear?.toISOString()?.split('T')?.[0]);
                                        handleFilterChange('registrationDateTo', today?.toISOString()?.split('T')?.[0]);
                                    }}
                                >
                                    Last Year
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="border-t border-border p-4 space-y-3">
                        <Button
                            variant="outline"
                            fullWidth
                            iconName="RotateCcw"
                            onClick={resetFilters}
                        >
                            Reset Filters
                        </Button>
                        <Button
                            fullWidth
                            iconName="Check"
                            onClick={applyFilters}
                        >
                            Apply Filters
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FilterPanel;