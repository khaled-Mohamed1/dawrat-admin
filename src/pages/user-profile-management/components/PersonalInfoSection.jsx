import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const PersonalInfoSection = ({ user, isEditing, onFieldChange }) => {
    const countries = [
        'UAE', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Bahrain', 'Oman',
        'Jordan', 'Lebanon', 'Egypt', 'Morocco', 'Tunisia', 'Algeria'
    ];

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex?.test(email);
    };

    const validatePhone = (phone) => {
        const phoneRegex = /^\+[1-9]\d{1,14}$/;
        return phoneRegex?.test(phone);
    };

    const getValidationIcon = (isValid, field) => {
        if (!user?.[field]) return null;
        return isValid ? (
            <Icon name="CheckCircle" size={16} className="text-green-600" />
        ) : (
            <Icon name="XCircle" size={16} className="text-red-600" />
        );
    };

    return (
        <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center space-x-2 mb-6">
                <Icon name="User" size={24} className="text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Personal Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                        First Name <span className="text-destructive">*</span>
                    </label>
                    {isEditing ? (
                        <Input
                            type="text"
                            value={user?.firstName || ''}
                            onChange={(e) => onFieldChange('firstName', e?.target?.value)}
                            placeholder="Enter first name"
                            required
                        />
                    ) : (
                        <p className="text-foreground py-2">{user?.firstName || '—'}</p>
                    )}
                </div>

                {/* Last Name */}
                <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                        Last Name <span className="text-destructive">*</span>
                    </label>
                    {isEditing ? (
                        <Input
                            type="text"
                            value={user?.lastName || ''}
                            onChange={(e) => onFieldChange('lastName', e?.target?.value)}
                            placeholder="Enter last name"
                            required
                        />
                    ) : (
                        <p className="text-foreground py-2">{user?.lastName || '—'}</p>
                    )}
                </div>

                {/* Full Name (Auto-generated or editable) */}
                <div className="md:col-span-2">
                    <label className="text-sm font-medium text-foreground mb-2 block">
                        Full Name <span className="text-destructive">*</span>
                    </label>
                    {isEditing ? (
                        <Input
                            type="text"
                            value={user?.fullName || ''}
                            onChange={(e) => onFieldChange('fullName', e?.target?.value)}
                            placeholder="Enter full name"
                            required
                        />
                    ) : (
                        <p className="text-foreground py-2">{user?.fullName || '—'}</p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                        Email Address <span className="text-destructive">*</span>
                    </label>
                    {isEditing ? (
                        <div className="relative">
                            <Input
                                type="email"
                                value={user?.email || ''}
                                onChange={(e) => onFieldChange('email', e?.target?.value)}
                                placeholder="Enter email address"
                                required
                                error={user?.email && !validateEmail(user?.email) ? 'Please enter a valid email address' : ''}
                            />
                            <div className="absolute right-3 top-3">
                                {getValidationIcon(validateEmail(user?.email || ''), 'email')}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-2 py-2">
                            <p className="text-foreground">{user?.email || '—'}</p>
                            {user?.emailVerified ? (
                                <Icon name="CheckCircle" size={16} className="text-green-600" title="Email verified" />
                            ) : (
                                <Icon name="AlertCircle" size={16} className="text-orange-600" title="Email not verified" />
                            )}
                        </div>
                    )}
                    {!isEditing && user?.emailVerified !== undefined && (
                        <p className="text-xs text-muted-foreground mt-1">
                            {user?.emailVerified ? '✓ Verified' : '⚠ Not verified'}
                        </p>
                    )}
                </div>

                {/* Phone Number */}
                <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                        Phone Number <span className="text-destructive">*</span>
                    </label>
                    {isEditing ? (
                        <div className="relative">
                            <Input
                                type="tel"
                                value={user?.phone || ''}
                                onChange={(e) => onFieldChange('phone', e?.target?.value)}
                                placeholder="+971501234567"
                                required
                                error={user?.phone && !validatePhone(user?.phone) ? 'Please enter a valid phone number in E.164 format' : ''}
                            />
                            <div className="absolute right-3 top-3">
                                {getValidationIcon(validatePhone(user?.phone || ''), 'phone')}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-2 py-2">
                            <p className="text-foreground">{user?.phone || '—'}</p>
                            {user?.phoneVerified ? (
                                <Icon name="CheckCircle" size={16} className="text-green-600" title="Phone verified" />
                            ) : (
                                <Icon name="AlertCircle" size={16} className="text-orange-600" title="Phone not verified" />
                            )}
                        </div>
                    )}
                    {!isEditing && user?.phoneVerified !== undefined && (
                        <p className="text-xs text-muted-foreground mt-1">
                            {user?.phoneVerified ? '✓ Verified' : '⚠ Not verified'}
                        </p>
                    )}
                </div>

                {/* Country */}
                <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                        Country <span className="text-destructive">*</span>
                    </label>
                    {isEditing ? (
                        <Select
                            value={user?.country || ''}
                            onValueChange={(value) => onFieldChange('country', value)}
                            required
                        >
                            <option value="">Select Country</option>
                            {countries?.map((country) => (
                                <option key={country} value={country}>
                                    {country}
                                </option>
                            ))}
                        </Select>
                    ) : (
                        <p className="text-foreground py-2">{user?.country || '—'}</p>
                    )}
                </div>

                {/* User Type */}
                <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                        User Type
                    </label>
                    {isEditing ? (
                        <Select
                            value={user?.userType || ''}
                            onValueChange={(value) => onFieldChange('userType', value)}
                            required
                        >
                            <option value="">Select User Type</option>
                            <option value="Student">Student</option>
                            <option value="Trainer">Trainer</option>
                            <option value="Center Admin">Center Admin</option>
                            <option value="Admin">Admin</option>
                        </Select>
                    ) : (
                        <p className="text-foreground py-2">{user?.userType || '—'}</p>
                    )}
                </div>
            </div>

            {/* Validation Notes */}
            {isEditing && (
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                    <h4 className="text-sm font-medium text-foreground mb-2">Validation Rules:</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• Email must be unique and in valid format</li>
                        <li>• Phone number must be in E.164 international format (e.g., +971501234567)</li>
                        <li>• Names should contain only letters and diacritics</li>
                        <li>• All required fields must be completed</li>
                    </ul>
                </div>
            )}

            {/* Change Notifications */}
            {!isEditing && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-2 text-blue-800">
                        <Icon name="Info" size={16} />
                        <p className="text-sm font-medium">Change Notifications</p>
                    </div>
                    <p className="text-xs text-blue-700 mt-1">
                        Users will receive email notifications when their personal information is updated by an administrator.
                    </p>
                </div>
            )}
        </div>
    );
};

export default PersonalInfoSection;