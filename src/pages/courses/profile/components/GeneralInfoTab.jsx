import React from 'react';
import Icon from '../../../../components/AppIcon';

const InfoItem = ({ label, value }) => (
    <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="font-semibold text-foreground">{value || 'N/A'}</p>
    </div>
);

const GeneralInfoTab = ({ course }) => {
    return (
        <div className="p-6 space-y-8">
            {/* Description */}
            <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Course Description</h3>
                <p className="text-muted-foreground text-sm">{course.description}</p>
            </div>

            {/* What You'll Learn */}
            <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">What You'll Learn</h3>
                <ul className="space-y-2">
                    {course.details.map((detail, index) => (
                        <li key={index} className="flex items-start gap-3">
                            <Icon name="CheckCircle" size={16} className="text-green-500 mt-1 flex-shrink-0" />
                            <span className="text-muted-foreground text-sm">{detail}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Schedule */}
            <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Course Schedule</h3>

                {/* Overall Duration */}
                <div className="grid grid-cols-2 gap-6 bg-muted/30 p-4 rounded-lg mb-4">
                    <InfoItem label="Start Date" value={new Date(course.start_date).toLocaleDateString()} />
                    <InfoItem label="End Date" value={new Date(course.end_date).toLocaleDateString()} />
                </div>

                {/* Weekly Timetable */}
                <h4 className="text-md font-semibold text-foreground mt-6 mb-3">Weekly Timetable</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {course.schedules.map(schedule => (
                        <div key={schedule.id} className="bg-muted/50 p-3 rounded-md text-sm border">
                            <p className="font-semibold">{schedule.day}</p>
                            <p className="text-muted-foreground">{schedule.start_time.slice(0, 5)} - {schedule.end_time.slice(0, 5)}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Additional Details */}
            <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Additional Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <InfoItem label="Level" value={course.level} />
                    <InfoItem label="Language" value={course.language} />
                    <InfoItem label="Capacity" value={`${course.capacity} Students`} />
                    <InfoItem label="Session Mode" value={course.session_mode} />
                </div>
            </div>
        </div>
    );
};

export default GeneralInfoTab;