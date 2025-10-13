import React, { useState, useEffect, useMemo } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';
import { getCountries } from '../../../api/publicService';

const GeneralInfoTab = ({ student, setStudent, isEditMode, setHasChanges }) => {
    
    const [countries, setCountries] = useState([]);
    const [isLoadingCountries, setIsLoadingCountries] = useState(true);

    useEffect(() => {
        const fetchCountries = async () => {
            setIsLoadingCountries(true);
            const countryData = await getCountries();
            setCountries(countryData);
            setIsLoadingCountries(false);
        };
        fetchCountries();
    }, []);

const handleInputChange = (field, value) => {
        setStudent(prev => ({ ...prev, [field]: value }));
        setHasChanges(true);
    };

    const handlePhoneNumberChange = (value) => {
        setStudent(prev => ({
            ...prev,
            phone: { ...prev.phone, phone_number: value }
        }));
        setHasChanges(true);
    };
    
    const handlePhoneCodeChange = (countryId) => {
        const selectedCountry = countries.find(c => c.id === parseInt(countryId));
        if (selectedCountry) {
            setStudent(prev => ({
                ...prev,
                phone: { ...prev.phone, phone_code: selectedCountry.phone_code }
            }));
            setHasChanges(true);
        }
    };
    
    const handleCountryChange = (countryId) => {
        const selectedCountry = countries.find(c => c.id === parseInt(countryId));
        if (selectedCountry) {
            setStudent(prev => ({
                ...prev,
                country: selectedCountry.name,
                country_id: selectedCountry.id,
            }));
            setHasChanges(true);
        }
    };

    
    const countryOptions = useMemo(() => countries.map(c => ({ label: c.name, value: c.id })), [countries]);
    const phoneCodeOptions = useMemo(() => countries.map(c => ({ label: `${c.phone_code}`, value: c.id })), [countries]);

    // **FIX 1**: Find the country ID that matches the student's current phone code.
    const selectedPhoneCountryId = useMemo(() => {
        if (!student?.phone?.phone_code || countries.length === 0) return undefined;
        // Find the first country in the list that matches the code
        const matchingCountry = countries.find(c => c.phone_code === student.phone.phone_code);
        return matchingCountry?.id;
    }, [student, countries]);

        return (
            <div className="space-y-8">
                {/* Personal Information */}
                <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                        {isEditMode ? (
                            <Input
                                type="text"
                                value={student?.name || ''}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                            />
                        ) : (
                            <div className="text-foreground font-medium">{student?.name}</div>
                        )}
                    </div>

                    <div className="space-y-1">
                            <label className="block text-sm font-medium text-muted-foreground mb-1">
                                Gender
                            </label>
                            <div className="text-foreground font-medium">{student?.gender || 'Not specified'}</div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                            <div className="text-foreground font-medium">
                                {student?.date_of_birth ? new Date(student.date_of_birth).toLocaleDateString() : 'Not specified'}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">
                                Nationality
                            </label>
                            <div className="text-foreground font-medium">{student?.nationality || 'Not specified'}</div>
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-1">
                        <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                        {isEditMode ? (
                            <Input
                                type="email"
                                value={student?.email || ''}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                            />
                        ) : (
                            <div className="text-foreground font-medium">{student?.email}</div>
                        )}
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                        {isEditMode ? (
                            <div className="flex items-center gap-2">
                                <Select
                                    // **FIX 1 (continued)**: Use the found ID as the value
                                    value={selectedPhoneCountryId}
                                    onChange={handlePhoneCodeChange}
                                    options={phoneCodeOptions}
                                    loading={isLoadingCountries}
                                    placeholder="Code"
                                    className="w-20"
                                    searchable={true} // Good for long lists
                                />
                                <Input
                                    type="tel"
                                    value={student?.phone?.phone_number || ''}
                                    onChange={(e) => handlePhoneNumberChange(e.target.value)}
                                    className="flex-1"
                                />
                            </div>
                        ) : (
                            <div className="text-foreground font-medium">
                                {student?.phone ? `${student.phone.phone_code} ${student.phone.phone_number}` : 'N/A'}
                            </div>
                        )}
                    </div>
                
                    {/* Country (Editable) */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-muted-foreground">Country</label>
                        {isEditMode ? (
                            <Select
                                // It correctly uses the ID for the value
                                value={student?.country_id} 
                                onChange={handleCountryChange}
                                options={countryOptions}
                                loading={isLoadingCountries}
                                placeholder="Select country..."
                                searchable={true}
                            />
                        ) : (
                            // It correctly uses the name for display
                            <div className="text-foreground font-medium h-10 flex items-center">
                                {student?.country || 'N/A'}
                            </div>
                        )}
                    </div>
                    </div>
                </div>

                {/* Account Information */}
                <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">Account Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">
                                Account Status
                            </label>
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${
                                    student?.status === 'Active' ? 'bg-green-500' : 'bg-red-500'
                                }`}></div>
                                <span className="text-foreground font-medium">{student?.status}</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">
                                Registration Date
                            </label>
                            <div className="text-foreground font-medium">
                                {new Date(student?.registrationDate)?.toLocaleDateString()}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">
                                Has Trainer Account
                            </label>
                            <div className="flex items-center gap-2">
                                {student?.hasTrainerAccount ? (
                                    <>
                                        <Icon name="Check" size={16} className="text-green-600" />
                                        <span className="text-green-600 font-medium">Yes</span>
                                    </>
                                ) : (
                                    <>
                                        <Icon name="X" size={16} className="text-gray-400" />
                                        <span className="text-muted-foreground font-medium">No</span>
                                    </>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">
                                Terms & Conditions
                            </label>
                            <div className="flex items-center gap-2">
                                {student?.is_accepted_term ? (
                                    <>
                                        <Icon name="Check" size={16} className="text-green-600" />
                                        <span className="text-green-600 font-medium">Agreed</span>
                                    </>
                                ) : (
                                    <>
                                        <Icon name="X" size={16} className="text-red-600" />
                                        <span className="text-red-600 font-medium">Not Agreed</span>
                                    </>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">
                                Policy & Conditions
                            </label>
                            <div className="flex items-center gap-2">
                                {student?.is_accepted_policy ? (
                                    <>
                                        <Icon name="Check" size={16} className="text-green-600" />
                                        <span className="text-green-600 font-medium">Agreed</span>
                                    </>
                                ) : (
                                    <>
                                        <Icon name="X" size={16} className="text-red-600" />
                                        <span className="text-red-600 font-medium">Not Agreed</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
};

export default GeneralInfoTab;