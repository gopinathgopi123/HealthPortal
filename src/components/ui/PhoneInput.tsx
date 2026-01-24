import React, { useState, useEffect } from 'react';
import { countryCodes, CountryCode } from '@/data/countryCodes';
import { ChevronDown } from 'lucide-react';

interface PhoneInputProps {
    value: string;
    onChange: (value: string, countryCode: string) => void;
    error?: string;
    label?: string;
    variant?: 'light' | 'dark' | 'floating' | 'medical';
    style?: any;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
    value,
    onChange,
    error,
    label,
    variant = 'floating',
    style
}) => {
    const [selectedCountry, setSelectedCountry] = useState<CountryCode>(
        countryCodes.find(c => c.code === '+91') || countryCodes[0]
    );
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [validationError, setValidationError] = useState('');

    // Parse initial value if provided
    useEffect(() => {
        if (value) {
            const country = countryCodes.find(c => value.startsWith(c.code));
            if (country) {
                setSelectedCountry(country);
                setPhoneNumber(value.substring(country.code.length));
            } else {
                setPhoneNumber(value);
            }
        }
    }, []);

    const validatePhoneNumber = (number: string, country: CountryCode) => {
        const digitCount = number.replace(/\D/g, '').length;
        if (digitCount > 0 && (digitCount < country.min || digitCount > country.max)) {
            return `Phone number must be  ${country.max} digits`;
        }
        return '';
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, '');
        setPhoneNumber(val);

        const fullNumber = selectedCountry.code + val;
        const error = validatePhoneNumber(val, selectedCountry);
        setValidationError(error);

        onChange(fullNumber, selectedCountry.code);
    };

    const handleCountryChange = (country: CountryCode) => {
        setSelectedCountry(country);
        setIsDropdownOpen(false);
        setSearchTerm('');

        const error = validatePhoneNumber(phoneNumber, country);
        setValidationError(error);

        const fullNumber = country.code + phoneNumber;
        onChange(fullNumber, country.code);
    };

    const filteredCountries = countryCodes.filter(country =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.code.includes(searchTerm)
    );

    const getVariantStyles = () => {
        switch (variant) {
            case 'floating':
                return {
                    input: `peer bg-white w-full border ${error || validationError ? 'border-red-400' : 'border-slate-800'} rounded-2xl text-black pl-24 pr-5 pt-6 pb-2 text-[1rem] outline-none transition-all duration-300`,
                    label: ` absolute left-24 top-4 text-slate-500 text-sm font-bold transition-all duration-300
                  peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-[1rem] peer-placeholder-shown:top-[0.8rem]
                  peer-focus:-translate-y-3 peer-focus:text-[0.8rem] peer-focus:top-4
                  peer-[:not(:placeholder-shown)]:-translate-y-3 peer-[:not(:placeholder-shown)]:text-[0.8rem] peer-[:not(:placeholder-shown)]:top-4 pointer-events-none`,
                    container: 'relative'
                };
            default:
                return {
                    input: `w-full bg-white border ${error || validationError ? 'border-red-400' : 'border-slate-800'} rounded-2xl text-black pl-24 pr-5 py-[0.4rem] text-[1rem] placeholder-slate-600 focus:border-accent-teal focus:bg-white transition-all duration-300 outline-none`,
                    label: `text-sm font-bold text-slate-500 pl-1 mb-1`,
                    container: 'flex flex-col'
                };
        }
    };

    const styles = getVariantStyles();

    return (
        <div className={styles.container}>
            {label && variant !== 'floating' && (
                <label className={styles.label}>{label}</label>
            )}

            <div className="relative">
                {/* Country Code Selector */}
                <div className="absolute left-0 top-0 bottom-0 flex items-center">
                    <button
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className={`flex items-center gap-1 px-3 h-full border-r ${error || validationError ? 'border-red-400' : 'border-slate-300'} hover:bg-slate-50 transition-colors rounded-l-2xl`}
                    >
                        <span className="text-lg">{selectedCountry.flag}</span>
                        <span className="text-sm font-medium text-slate-700">{selectedCountry.code}</span>
                        <ChevronDown size={14} className="text-slate-500" />
                    </button>

                    {/* Dropdown */}
                    {isDropdownOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setIsDropdownOpen(false)}
                            />
                            <div className="absolute left-0 top-full mt-1 w-80 bg-white border border-slate-300 rounded-xl shadow-lg z-20 max-h-80 overflow-hidden flex flex-col">
                                <div className="p-2 border-b border-slate-200">
                                    <input
                                        type="text"
                                        placeholder="Search country..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full bg-white  text-black px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-accent-teal"
                                    />
                                </div>
                                <div className="overflow-y-auto">
                                    {filteredCountries.map((country) => (
                                        <button
                                            key={country.code + country.name}
                                            type="button"
                                            onClick={() => handleCountryChange(country)}
                                            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-100 transition-colors text-left"
                                        >
                                            <span className="text-lg">{country.flag}</span>
                                            <span className="text-sm font-medium text-slate-700 flex-1">{country.name}</span>
                                            <span className="text-sm text-slate-500">{country.code}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Phone Number Input */}
                <input
                    type="tel"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    placeholder={variant === 'floating' ? ' ' : 'Enter phone number'}
                    className={styles.input}
                    style={style}
                />

                {label && variant === 'floating' && (
                    <label className={styles.label}>{label}</label>
                )}
            </div>

            {(error || validationError) && (
                <span className="text-red-400 text-xs mt-1 pl-1">
                    {error || validationError}
                </span>
            )}
        </div>
    );
};

export default PhoneInput;
