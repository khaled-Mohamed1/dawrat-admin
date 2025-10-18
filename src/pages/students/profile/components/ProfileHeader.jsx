import React from 'react';
import Icon from '../../../../components/AppIcon';

const ProfileHeader = ({ student }) => {
    const getStatusColor = (status) => {
        return status?.toLowerCase() === 'active' 
            ? 'bg-green-100 text-green-800 border-green-200'
            : 'bg-red-100 text-red-800 border-red-200';
    };

    return (
        <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                        {student?.avatar ? (
                            <img src={student.avatar} alt={student.fullName} className="w-16 h-16 rounded-full object-cover" />
                        ) : (
                            <Icon name="User" size={32} className="text-primary" />
                        )}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-foreground">{student?.fullName}</h2>
                        <p className="text-muted-foreground">Student ID: {student?.id}</p>
                        <div className="flex items-center gap-4 mt-2">
                             <span className="text-sm text-muted-foreground">
                                Registered: {student?.registrationDate ? new Date(student.registrationDate).toLocaleDateString() : 'N/A'}
                            </span>
                                <span className="text-sm text-muted-foreground">
                                    Last login: {student?.lastLogin ? new Date(student?.lastLogin).toLocaleDateString() : 'N/A'}
                                </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:ml-auto">
                    <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(student?.status)}`}>
                            {student?.status}
                        </span>
                        <div className="flex items-center gap-2 text-sm">
                            <Icon name="BookOpen" size={16} className="text-muted-foreground" />
                            <span className="text-foreground font-medium">{student?.num_enrollments || 0}</span>
                            <span className="text-muted-foreground">courses</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;