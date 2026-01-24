import React, { forwardRef, useState } from 'react';
import { LucideIcon, Eye, EyeOff } from 'lucide-react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement> {
    label?: string;
    error?: string;
    icon?: LucideIcon;
    variant?: 'light' | 'dark' | 'floating' | 'medical';
    containerClassName?: string;
    labelClassName?: string;
    isSelect?: boolean;
    options?: { label: string; value: string | number }[];
}

const FormInput = forwardRef<HTMLInputElement | HTMLSelectElement, FormInputProps>(
    ({
        label,
        error,
        icon: Icon,
        variant = 'light',
        containerClassName = '',
        labelClassName = '',
        isSelect = false,
        options = [],
        required,
        id,
        className = '',
        placeholder,
        ...props
    }, ref) => {
        const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
        const [showPassword, setShowPassword] = useState(false);
        const isPasswordField = props.type === 'password';

        const getVariantStyles = () => {
            switch (variant) {
                case 'floating':
                    return {
                        input: `peer  bg-white w-full border ${error ? 'border-red-400' : 'border-slate-400'} rounded-1xl text-black px-5 pt-6 pb-2 text-[1rem] outline-none transition-all duration-300`,
                        label: `absolute left-6 top-4 text-slate-500 text-sm font-medium transition-all duration-300
                               peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-[1rem] peer-placeholder-shown:top-[0.8rem]
                               peer-focus:-translate-y-3 peer-focus:text-[0.8rem] peer-focus:top-4
                               peer-[:not(:placeholder-shown)]:-translate-y-3 peer-[:not(:placeholder-shown)]:text-[0.8rem] peer-[:not(:placeholder-shown)]:top-4 pointer-events-none`,
                        container: 'relative'
                    };
                case 'medical':
                    return {
                        input: `w-full bg-white border ${error ? 'border-red-400' : 'border-slate-200'} rounded-2xl text-[#0f1115] ${Icon ? 'pl-12' : 'px-5'} pr-4 py-4 text-base font-medium placeholder-slate-400 focus:ring-2 focus:ring-[#1D548B]/10 transition-all duration-300 outline-none`,
                        label: `text-[0.9rem] font-bold text-slate-700 mb-2 block ${labelClassName}`,
                        container: 'flex flex-col'
                    };
                case 'dark':
                    return {
                        input: `w-full bg-slate-950/50 text-white ${Icon ? 'pl-12' : 'px-5'} pr-4 py-3 border ${error ? 'border-red-500' : 'border-slate-800'} rounded-xl placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-teal/50 transition-all`,
                        label: `text-white mb-2 block font-medium ${labelClassName}`,
                        container: 'flex flex-col'
                    };
                case 'light':
                default:
                    return {
                        input: `w-full bg-white border ${error ? 'border-red-400' : 'border-slate-200'} rounded-2xl text-black px-5 py-[0.4rem] text-[1rem] placeholder-slate-600 focus:border-accent-teal focus:bg-white transition-all duration-300 outline-none`,
                        label: `text-sm font-medium text-slate-500 pl-1 mb-1 ${labelClassName}`,
                        container: 'flex flex-col'
                    };
            }
        };

        const styles = getVariantStyles();

        return (
            <div className={`${styles.container} ${containerClassName}`}>
                {label && variant !== 'floating' && (
                    <label htmlFor={inputId} className={styles.label}>
                        {label} {required && <span className="text-red-400">*</span>}
                    </label>
                )}

                <div className="relative">
                    {Icon && variant !== 'floating' && (
                        <Icon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    )}

                    {isSelect ? (
                        <select
                            id={inputId}
                            ref={ref as React.Ref<HTMLSelectElement>}
                            className={`${styles.input} ${className} ${isSelect && variant === 'dark' ? 'appearance-none' : ''}`}
                            {...props as any}
                        >
                            {placeholder && <option value="">{placeholder}</option>}
                            {options.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <>
                            <input
                                id={inputId}
                                ref={ref as React.Ref<HTMLInputElement>}
                                className={`${styles.input} ${className} ${isPasswordField ? 'pr-12' : ''}`}
                                placeholder={variant === 'floating' ? ' ' : placeholder}
                                required={required}
                                {...props as any}
                                type={isPasswordField && showPassword ? 'text' : props.type}
                            />
                            {isPasswordField && (
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            )}
                        </>
                    )}

                    {label && variant === 'floating' && (
                        <label htmlFor={inputId} className={styles.label}>
                            {label} {required && <span className="text-red-400">*</span>}
                        </label>
                    )}
                </div>

                {error && (
                    <span className="text-red-400 text-xs mt-1 pl-1">
                        {error}
                    </span>
                )}
            </div>
        );
    }
);

FormInput.displayName = 'FormInput';

export default FormInput;
