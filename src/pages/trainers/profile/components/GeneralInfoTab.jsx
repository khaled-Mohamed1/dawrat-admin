import React, { useState, useEffect, useMemo } from 'react';
import Input from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import Icon from '../../../../components/AppIcon';
import { getCountries } from '../../../../api/publicService';

const BooleanDisplay = ({ value, trueLabel, falseLabel }) => (
    <div className="flex items-center gap-2">
        {value === 1 ? (
            <>
                <Icon name="CheckCircle" size={16} className="text-green-600" />
                <span className="font-medium text-foreground">{trueLabel}</span>
            </>
        ) : (
            <>
                <Icon name="XCircle" size={16} className="text-red-600" />
                <span className="font-medium text-muted-foreground">{falseLabel}</span>
            </>
        )}
    </div>
);

const GeneralInfoTab = ({ trainer, setTrainer, isEditMode, setHasChanges }) => {

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
        setTrainer(prev => ({ ...prev, [field]: value }));
        setHasChanges(true);
    };

    const handlePhoneNumberChange = (value) => {
        setTrainer(prev => ({
            ...prev,
            phone: { ...prev.phone, phone_number: value }
        }));
        setHasChanges(true);
    };

    const handlePhoneCodeChange = (countryId) => {
        const selectedCountry = countries.find(c => c.id === parseInt(countryId));
        if (selectedCountry) {
            setTrainer(prev => ({
                ...prev,
                phone: { ...prev.phone, phone_code: selectedCountry.phone_code }
            }));
            setHasChanges(true);
        }
    };

    const handleCountryChange = (countryId) => {
        const selectedCountry = countries.find(c => c.id === parseInt(countryId));
        if (selectedCountry) {
            setTrainer(prev => ({
                ...prev,
                country: selectedCountry.name,
                country_id: selectedCountry.id,
            }));
            setHasChanges(true);
        }
    };


    const countryOptions = useMemo(() => countries.map(c => ({ label: c.name, value: c.id })), [countries]);
    const phoneCodeOptions = useMemo(() => countries.map(c => ({ label: `${c.phone_code}`, value: c.id })), [countries]);

    // **FIX 1**: Find the country ID that matches the trainer's current phone code.
    const selectedPhoneCountryId = useMemo(() => {
        if (!trainer?.phone?.phone_code || countries.length === 0) return undefined;
        // Find the first country in the list that matches the code
        const matchingCountry = countries.find(c => c.phone_code === trainer.phone.phone_code);
        return matchingCountry?.id;
    }, [trainer, countries]);

    return (
        <div className="space-y-8">
            {/* Personal Information */}
            <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* English Name (Editable) */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-muted-foreground">First Name (EN)</label>
                        {isEditMode ? (<Input value={trainer?.first_name_en || ''} onChange={e => handleInputChange('first_name_en', e.target.value)} />)
                            : (<div className="font-medium text-foreground">{trainer?.first_name_en}</div>)}
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-muted-foreground">Last Name (EN)</label>
                        {isEditMode ? (<Input value={trainer?.last_name_en || ''} onChange={e => handleInputChange('last_name_en', e.target.value)} />)
                            : (<div className="font-medium text-foreground">{trainer?.last_name_en}</div>)}
                    </div>

                    {/* Arabic Name (Editable) */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-muted-foreground">First Name (AR)</label>
                        {isEditMode ? (<Input value={trainer?.first_name_ar || ''} onChange={e => handleInputChange('first_name_ar', e.target.value)} />)
                            : (<div className="font-medium text-foreground">{trainer?.first_name_ar}</div>)}
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-muted-foreground">Last Name (AR)</label>
                        {isEditMode ? (<Input value={trainer?.last_name_ar || ''} onChange={e => handleInputChange('last_name_ar', e.target.value)} />)
                            : (<div className="font-medium text-foreground">{trainer?.last_name_ar}</div>)}
                    </div>

                    {/* Read-only fields */}
                    <div className="space-y-1"><label className="text-sm font-medium text-muted-foreground">Gender</label><div className="font-medium text-foreground capitalize">{trainer?.gender}</div></div>
                    <div className="space-y-1"><label className="text-sm font-medium text-muted-foreground">Nationality</label><div className="font-medium text-foreground">{trainer?.nationality}</div></div>
                </div>
            </div>

            {/* --- Contact Information --- */}
            <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Contact & Professional Info</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                        {isEditMode ? (<Input type="email" value={trainer?.email || ''} onChange={e => handleInputChange('email', e.target.value)} />)
                            : (<div className="font-medium text-foreground">{trainer?.email}</div>)}
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                        {isEditMode ? (
                            <div className="flex items-center gap-2">
                                <Select value={selectedPhoneCountryId} onChange={handlePhoneCodeChange} options={phoneCodeOptions} loading={isLoadingCountries} placeholder="Code" className="w-48" searchable />
                                <Input type="tel" value={trainer?.phone?.phone_number || ''} onChange={e => handlePhoneNumberChange(e.target.value)} className="flex-1" />
                            </div>
                        ) : (<div className="font-medium text-foreground h-10 flex items-center">{trainer?.phone ? `${trainer.phone.phone_code} ${trainer.phone.phone_number}` : 'N/A'}</div>)}
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-muted-foreground">Country</label>
                        {isEditMode ? (
                            <Select value={trainer?.country?.id} onChange={handleCountryChange} options={countryOptions} loading={isLoadingCountries} placeholder="Select country..." searchable />
                        ) : (<div className="font-medium text-foreground h-10 flex items-center">{trainer?.country?.name || 'N/A'}</div>)}
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-muted-foreground">Job Title</label>
                        <div className="font-medium text-foreground h-10 flex items-center">{trainer?.job_en || 'Not specified'}</div>
                    </div>
                </div>
            </div>

            {/* --- Qualifications --- */}
            <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Qualifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-muted-foreground">Qualifications (EN)</label>
                        {isEditMode ? (<textarea value={trainer?.qualifications_en || ''} onChange={e => handleInputChange('qualifications_en', e.target.value)} className="w-full h-24 p-2 border rounded-md bg-transparent" />)
                            : (<p className="text-foreground text-sm">{trainer?.qualifications_en || 'N/A'}</p>)}
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-muted-foreground">Qualifications (AR)</label>
                        {isEditMode ? (<textarea value={trainer?.qualifications_ar || ''} onChange={e => handleInputChange('qualifications_ar', e.target.value)} className="w-full h-24 p-2 border rounded-md bg-transparent" dir="rtl"/>)
                            : (<p className="text-foreground text-sm" dir="ltr">{trainer?.qualifications_ar || 'N/A'}</p>)}
                    </div>
                </div>
            </div>

            {/* --- Specialized Categories --- */}
            <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Specialized Categories</h3>
                <div className="flex flex-wrap gap-2">
                    {trainer?.categories?.length > 0 ? (
                        trainer.categories.map(category => (
                            <span key={category.id} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full border border-blue-200">
                                {category.name}
                            </span>
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground">No categories specified.</p>
                    )}
                </div>
            </div>

            {/* --- Social Media --- */}
            <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Social Media</h3>
                <div className="flex items-center gap-4">
                    {trainer?.social_media?.length > 0 ? (
                        trainer.social_media.map(social => (
                            <a key={social.platform} href={social.url} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                                <img src={social.icon} alt={social.platform} className="w-8 h-8" />
                            </a>
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground">No social media links provided.</p>
                    )}
                </div>
            </div>

            {/* --- Account & Legal Information --- */}
            <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Account & Legal</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <BooleanDisplay value={trainer?.is_completed} trueLabel="Profile Completed" falseLabel="Incomplete" />
                    <BooleanDisplay value={trainer?.is_accepted_term} trueLabel="Terms Agreed" falseLabel="Not Terms Agreed" />
                    <BooleanDisplay value={trainer?.is_accepted_policy} trueLabel="Policy Agreed" falseLabel="Not Policy Agreed" />
                    <BooleanDisplay value={trainer?.is_accepted_finance} trueLabel="Finance Agreed" falseLabel="Not Finance Agreed" />
                </div>
            </div>
        </div>
    );
};

export default GeneralInfoTab;