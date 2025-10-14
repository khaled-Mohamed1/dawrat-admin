import React, { useState, useEffect } from 'react';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import { getCountries, getCenters } from '../../../../api/publicService';

const FilterPanel = ({ initialFilters, onApplyFilters, onClearFilters }) => {
    const [filters, setFilters] = useState(initialFilters);
    const [countries, setCountries] = useState([]);
    const [centers, setCenters] = useState([]);

    useEffect(() => {
        getCountries().then(setCountries);
        getCenters().then(setCenters);
    }, []);

    const handleChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const handleApply = () => {
        onApplyFilters(filters);
    };

    const handleClear = () => {
        const clearedFilters = {
            start_date: '', end_date: '', course_count_min: '',
            avg_rating_min: '', center_id: 'all', country_id: 'all', job_title: ''
        };
        setFilters(clearedFilters);
        onClearFilters(clearedFilters);
    };

    const countryOptions = countries.map(c => ({ label: c.name, value: c.id }));
    const centerOptions = centers.map(c => ({ label: c.title, value: c.id }));


    return (
        <div className="bg-card rounded-lg border p-6 space-y-4 animate-fade-in">
            <h4 className="font-semibold text-foreground">Advanced Filters</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Job Title */}
                <Input label="Job Title" value={filters.job_title} onChange={e => handleChange('job_title', e.target.value)} />

                {/* Country */}
                <Select label="Country" value={filters.country_id} onChange={value => handleChange('country_id', value)} options={[{label: 'All Countries', value: 'all'}, ...countryOptions]} />

                {/* Center */}
                <Select label="Center" value={filters.center_id} onChange={value => handleChange('center_id', value)} options={[{label: 'All Centers', value: 'all'}, ...centerOptions]} />

                {/* Min Course Count */}
                <Input type="number" min={0} label="Min. Courses" value={filters.course_count_min} onChange={e => handleChange('course_count_min', e.target.value)} />

                {/* Min Avg. Rating */}
                <Input type="number" label="Min. Rating" step="0.1" value={filters.avg_rating_min} onChange={e => handleChange('avg_rating_min', e.target.value)} />

                {/* Date Range */}
                <Input type="date" label="Registration From" value={filters.start_date} onChange={e => handleChange('start_date', e.target.value)} />
                <Input type="date" label="Registration To" value={filters.end_date} onChange={e => handleChange('end_date', e.target.value)} />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="ghost" onClick={handleClear}>Clear Advanced</Button>
                <Button onClick={handleApply}>Apply Filters</Button>
            </div>
        </div>
    );
};

export default FilterPanel;