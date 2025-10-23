import React from 'react';

const InfoItem = ({ label, value, children, className = '' }) => (
    <div className={className}>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className="font-semibold text-foreground mt-1">{children || value || 'N/A'}</div>
    </div>
);

const GeneralInfoTab = ({ request }) => {
    return (
        <div className="p-6 space-y-8">
            {/* --- Main Details --- */}
            <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Demand Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <InfoItem label="Topic" value={request.course_topic} />
                    <InfoItem label="Category" value={request.categories} />
                    <InfoItem label="Level" value={request.course_level} />
                    <InfoItem label="Type" value={request.course_type} />
                    <InfoItem label="Location" value={request.course_location} />
                    <InfoItem label="Language" value={request.course_language === 'en' ? 'English' : 'Arabic'} />
                    <InfoItem label="Status" value={request.status} />
                    <InfoItem label="Interested Users" value={request.interested_users_count} />
                </div>
                <InfoItem label="Student's Message" className="mt-4">
                    <p className="text-sm font-normal text-muted-foreground italic border-l-2 pl-3">"{request.details}"</p>
                </InfoItem>
            </div>

            {/* --- Schedule Details --- */}
            <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Schedule Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <InfoItem label="Requested Start Date" value={new Date(request.start_date).toLocaleDateString()} />
                    <InfoItem label="Requested End Date" value={new Date(request.end_date).toLocaleDateString()} />
                    <InfoItem label="Calculated Duration" value={`${request.duration} Days`} />
                    <InfoItem label="Preferred Time" value={request.preferred_time} />
                    <InfoItem label="Days Per Week" value={request.days_per_week} />
                    <InfoItem label="Schedule Type" value={request.schedule_type} />
                </div>
            </div>

            {/* --- Submitted By --- */}
            <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Submitted By</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <InfoItem label="Name" value={request.user.name} />
                    <InfoItem label="Email" value={request.user.email} />
                    <InfoItem label="Phone" value={`${request.user.phone.phone_code} ${request.user.phone.phone_number}`} />
                    <InfoItem label="Country" value={request.user.country_id.name} />
                </div>
            </div>
        </div>
    );
};

export default GeneralInfoTab;