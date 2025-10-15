import React, { useState, useEffect, useMemo } from 'react';
import Icon from '../../../../components/AppIcon';
import Input from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import { getAllCategories } from '../../../../api/categoryService';
import Button from "../../../../components/ui/Button.jsx";

const InfoItem = ({ label, value, className = '' }) => (
    <div className={className}>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="font-semibold text-foreground mt-1">{value || 'N/A'}</p>
    </div>
);

const GeneralInfoTab = ({ course, setCourse, isEditMode, setHasChanges }) => {
    const [categories, setCategories] = useState([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);

    useEffect(() => {
        getAllCategories().then(data => {
            setCategories(data);
            setIsLoadingCategories(false);

            if (course?.category) {
                const matchingCategory = data.find(c => c.name === course.category);
                if (matchingCategory) {
                    setCourse(prev => ({ ...prev, category_id: matchingCategory.id }));
                }
            }
        });
    }, [course?.category]);

    useEffect(() => {
        if (isEditMode && course.start_date && course.end_date) {
            const startDate = new Date(course.start_date);
            const endDate = new Date(course.end_date);

            if (endDate > startDate) {
                const timeDiff = endDate.getTime() - startDate.getTime();
                const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
                if (dayDiff !== course.duration) {
                    handleInputChange('duration', dayDiff);
                }
            } else {
                handleInputChange('duration', 0);
            }
        }
    }, [course?.start_date, course?.end_date, isEditMode]);

    useEffect(() => {
        if (!isEditMode) return;

        const price = parseFloat(course.price) || 0;
        const discount = parseFloat(course.discount) || 0;
        let finalPrice = price;

        if (course.discount_type === 'P' && discount > 0) {
            finalPrice = price - (price * (discount / 100));
        } else if (course.discount_type === 'F' && discount > 0) {
            finalPrice = price - discount;
        }

        finalPrice = Math.max(0, finalPrice);

        if (finalPrice !== course.final_price) {
            handleInputChange('final_price', finalPrice);
        }

    }, [course.price, course.discount, course.discount_type, isEditMode]);

    const handleInputChange = (field, value) => {
        setCourse(prev => ({ ...prev, [field]: value }));
        setHasChanges(true);
    };

    const handleDetailsChange = (e) => {
        handleInputChange('details', e.target.value.split('\n'));
    };

    // --- Schedule Handlers ---
    const handleScheduleChange = (index, field, value) => {
        const newSchedules = [...course.schedules];
        newSchedules[index][field] = value;
        handleInputChange('schedules', newSchedules);
    };

    const addSchedule = () => {
        const newSchedules = [...course.schedules, { day: 'Sunday', start_time: '09:00', end_time: '11:00' }];
        handleInputChange('schedules', newSchedules);
    };

    const removeSchedule = (index) => {
        const newSchedules = course.schedules.filter((_, i) => i !== index);
        handleInputChange('schedules', newSchedules);
    };

    // --- Category Handler ---
    const handleCategoryChange = (categoryId) => {
        const selectedCategory = categories.find(c => c.id === parseInt(categoryId));
        if (selectedCategory) {
            setCourse(prev => ({
                ...prev,
                category: selectedCategory.name,
                category_id: selectedCategory.id
            }));
            setHasChanges(true);
        }
    };

    // --- Options for Selects ---
    const categoryOptions = useMemo(() => categories.map(c => ({ label: c.name, value: c.id })), [categories]);
    const dayOptions = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => ({ label: day, value: day }));
    const levelOptions = [{label: 'Beginner', value: 'Beginner'}, {label: 'Intermediate', value: 'Intermediate'}, {label: 'Advanced', value: 'Advanced'}];
    const langOptions = [{label: 'English', value: 'English'}, {label: 'Arabic', value: 'Arabic'}];
    const modeOptions = [{label: 'Online', value: 'Online'}, {label: 'Onsite', value: 'Onsite'}];
    const discountOptions = [{label: 'Percentage', value: 'P'}, {label: 'Fixed', value: 'F'}];

    const discountTypeDisplay = {
        'P': 'Percentage',
        'F': 'Fixed'
    };

    return (
        <div className="p-6 space-y-8">
            {/* Title & Description */}
            <div className="space-y-4">
                <div className="space-y-1">
                    <label className="text-sm font-medium">Course Title</label>
                    {isEditMode ? (<Input value={course.title} onChange={e => handleInputChange('title', e.target.value)} />)
                        : (<h3 className="text-lg font-semibold">{course.title}</h3>)}
                </div>
                <div className="space-y-1">
                    <label className="text-sm font-medium">Description</label>
                    {isEditMode ? (<textarea value={course.description} onChange={e => handleInputChange('description', e.target.value)} className="w-full h-24 p-2 border rounded-md bg-transparent" />)
                        : (<p className="text-muted-foreground text-sm">{course.description}</p>)}
                </div>
            </div>

            {/* **NEW**: Category Selection */}
            <div>
                <h3 className="text-lg font-semibold mb-3">Category</h3>
                {isEditMode ? (
                    <Select
                        value={course.category_id}
                        onChange={handleCategoryChange}
                        options={categoryOptions}
                        loading={isLoadingCategories}
                        placeholder="Select a category..."
                    />
                ) : (
                    <p className="font-semibold">{course.category}</p>
                )}
            </div>

            {/* What You'll Learn */}
            <div>
                <h3 className="text-lg font-semibold mb-3">What You'll Learn (Details)</h3>
                {isEditMode ? (
                    <textarea value={course.details.join('\n')} onChange={handleDetailsChange} placeholder="Enter each point on a new line..." className="w-full h-32 p-2 border rounded-md bg-transparent text-sm" />
                ) : (
                    <ul className="space-y-2">
                        {course.details.map((detail, index) => (
                            <li key={index} className="flex items-start gap-3"><Icon name="CheckCircle" size={16} className="text-green-500 mt-1 flex-shrink-0" /><span className="text-muted-foreground text-sm">{detail}</span></li>
                        ))}
                    </ul>
                )}
            </div>


            {/* Core Details */}
            <div>
                <h3 className="text-lg font-semibold mb-3">Core Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div><label className="text-sm font-medium">Level</label>{isEditMode ? (<Select value={course.level} onChange={val => handleInputChange('level', val)} options={levelOptions} />) : (<p className="font-semibold">{course.level}</p>)}</div>
                    <div><label className="text-sm font-medium">Language</label>{isEditMode ? (<Select value={course.language} onChange={val => handleInputChange('language', val)} options={langOptions} />) : (<p className="font-semibold">{course.language}</p>)}</div>
                    <div><label className="text-sm font-medium">Capacity</label>{isEditMode ? (<Input type="number" value={course.capacity} onChange={e => handleInputChange('capacity', e.target.value)} />) : (<p className="font-semibold">{course.capacity} Students</p>)}</div>
                    <div><label className="text-sm font-medium">Session Mode</label>{isEditMode ? (<Select value={course.session_mode} onChange={val => handleInputChange('session_mode', val)} options={modeOptions} />) : (<p className="font-semibold">{course.session_mode}</p>)}</div>
                </div>
                {isEditMode && course.session_mode === 'Onsite' && (
                    <div className="mt-4"><label className="text-sm font-medium">Address</label><Input value={course.address || ''} onChange={e => handleInputChange('address', e.target.value)} /></div>
                )}
                {!isEditMode && course.session_mode === 'Onsite' && <InfoItem label="Address" value={course.address} className="mt-4" />}
            </div>

            {/* Pricing & Duration */}
            <div>
                <h3 className="text-lg font-semibold mb-3">Pricing & Duration</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div><label className="text-sm font-medium">Price</label>{isEditMode ? (<Input type="number" value={course.price} onChange={e => handleInputChange('price', e.target.value)} />) : (<p className="font-semibold">{course.price}</p>)}</div>
                    <div>
                        <label className="text-sm font-medium">Discount Type</label>
                        {isEditMode ? (
                            <Select
                                value={course.discount_type}
                                onChange={val => handleInputChange('discount_type', val)}
                                options={discountOptions}
                            />
                        ) : (
                            <p className="font-semibold h-10 flex items-center">
                                {discountTypeDisplay[course.discount_type] || 'N/A'}
                            </p>
                        )}
                    </div>
                    <div><label className="text-sm font-medium">Discount</label>{isEditMode ? (<Input type="number" value={course.discount} onChange={e => handleInputChange('discount', e.target.value)} />) : (<p className="font-semibold">{course.discount}</p>)}</div>
                    <div>
                        <label className="text-sm font-medium">Final Price</label>
                        <p className="font-semibold h-10 flex items-center">
                            ${(course.final_price || 0).toFixed(2)}
                        </p>
                    </div>
                    <div><label className="text-sm font-medium">Start Date</label>{isEditMode ? (<Input type="date" value={course.start_date} onChange={e => handleInputChange('start_date', e.target.value)} />) : (<p className="font-semibold">{new Date(course.start_date).toLocaleDateString()}</p>)}</div>
                    <div><label className="text-sm font-medium">End Date</label>{isEditMode ? (<Input type="date" value={course.end_date} onChange={e => handleInputChange('end_date', e.target.value)} />) : (<p className="font-semibold">{new Date(course.end_date).toLocaleDateString()}</p>)}</div>
                    <div>
                        <label className="text-sm font-medium">Duration</label>
                        <p className="font-semibold h-10 flex items-center">{course.duration} Days</p>
                    </div>
                    <div><label className="text-sm font-medium">Total Hours</label>{isEditMode ? (<Input type="number" value={course.total_hours} onChange={e => handleInputChange('total_hours', e.target.value)} />) : (<p className="font-semibold">{course.total_hours} Hours</p>)}</div>
                </div>
            </div>

            {/* **UPDATED**: Schedule Section with Edit Mode */}
            <div>
                <h3 className="text-lg font-semibold mb-3">Schedule</h3>
                {isEditMode ? (
                    <div className="space-y-3">
                        {course.schedules.map((schedule, index) => (
                            <div key={index} className="flex items-center gap-2 bg-muted/30 p-2 rounded-md">
                                <Select className="flex-1" value={schedule.day} options={dayOptions} onChange={val => handleScheduleChange(index, 'day', val)} />
                                <Input
                                    type="time"
                                    className="flex-1"
                                    value={schedule.start_time?.slice(0, 5) || ''}
                                    onChange={e => handleScheduleChange(index, 'start_time', e.target.value)}
                                />
                                <Input
                                    type="time"
                                    className="flex-1"
                                    value={schedule.end_time?.slice(0, 5) || ''}
                                    onChange={e => handleScheduleChange(index, 'end_time', e.target.value)}
                                />
                                <Button variant="destructive" size="icon" className="h-9 w-9" onClick={() => removeSchedule(index)}><Icon name="Trash2" size={14} /></Button>
                            </div>
                        ))}
                        <Button variant="outline" size="sm" onClick={addSchedule} iconName="Plus">Add Schedule</Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {course.schedules.map(schedule => (
                            <div key={schedule.id} className="bg-muted/30 p-3 rounded-md text-sm">
                                <p className="font-semibold">{schedule.day}</p>
                                <p className="text-muted-foreground">{schedule.start_time.slice(0, 5)} - {schedule.end_time.slice(0, 5)}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GeneralInfoTab;