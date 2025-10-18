import React from 'react';
import Button from '../../../../components/ui/Button';
import Select from '../../../../components/ui/Select';
import Input from '../../../../components/ui/Input';
import Icon from '../../../../components/AppIcon';

const FilterPanel = ({
                         hasTrainerAccount,
                         setHasTrainerAccount,
                         dateRange,
                         setDateRange,
                         onClose
                     }) => {
    const handleDateRangeChange = (field, value) => {
        setDateRange(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div className="bg-card rounded-lg border border-border p-6 relative">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-foreground">Advanced Filters</h3>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="h-8 w-8 p-0"
                >
                    <Icon name="X" size={16} />
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                        Has Trainer Account
                    </label>
                    <Select
                        value={hasTrainerAccount}
                        onValueChange={setHasTrainerAccount}
                        className="w-full"
                    >
                        <option value="all">All</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </Select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                        Registration From
                    </label>
                    <Input
                        type="date"
                        value={dateRange?.start || ''}
                        onChange={(e) => handleDateRangeChange('start', e?.target?.value)}
                        className="w-full"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                        Registration To
                    </label>
                    <Input
                        type="date"
                        value={dateRange?.end || ''}
                        onChange={(e) => handleDateRangeChange('end', e?.target?.value)}
                        className="w-full"
                    />
                </div>
            </div>
            <div className="flex justify-end mt-6 pt-4 border-t border-border">
                <Button
                    variant="outline"
                    onClick={() => {
                        setHasTrainerAccount('all');
                        setDateRange({ start: '', end: '' });
                    }}
                >
                    Clear Advanced Filters
                </Button>
            </div>
        </div>
    );
};

export default FilterPanel;