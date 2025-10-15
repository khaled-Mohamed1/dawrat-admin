import React from 'react';
import Icon from '../../../../components/AppIcon';
import { cn } from '../../../../utils/cn';
import StatusBadge from "./StatusBadge.jsx";

const CourseProfileHeader = ({ course }) => {
    const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);

    return (
        <div className="bg-card rounded-lg border p-6 flex gap-6">
            <img src={course.main_image} alt={course.title} className="w-48 h-48 object-cover rounded-lg hidden md:block" />
            <div className="flex-1">
                <span className="text-sm font-semibold bg-primary/10 text-primary px-2 py-1 rounded-full">{course.category}</span>
                <h2 className="text-2xl font-bold text-foreground mt-2">{course.title}</h2>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                    {course.trainer && <span className="flex items-center gap-1.5"><Icon name="User" size={14} />{course.trainer.name}</span>}
                    {course.center && <span className="flex items-center gap-1.5"><Icon name="Building" size={14} />{course.center.name}</span>}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-6 pt-6 border-t">
                    <div>
                        <p className="text-sm text-muted-foreground">Course Status</p>
                        <StatusBadge status={course.status} />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Progress Status</p>
                        <StatusBadge status={course.timing_status} />
                    </div>
                    <div><p className="text-sm text-muted-foreground">Price</p>
                        <p className="font-bold text-lg text-foreground">{formatCurrency(course.final_price)}</p>
                        {course.discount > 0 && <p className="text-muted-foreground line-through">{formatCurrency(course.price)}</p>}</div>
                    <div><p className="text-sm text-muted-foreground">Rating</p><p className="font-semibold">{course.average_rating.toFixed(1)} ★</p></div>
                    <div><p className="text-sm text-muted-foreground">Duration</p><p className="font-semibold">{course.total_hours} Hours</p></div>
                </div>
            </div>
        </div>
    );
};

export default CourseProfileHeader;