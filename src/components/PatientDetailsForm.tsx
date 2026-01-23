import React, { useState } from 'react';
import { User, Phone, MapPin } from 'lucide-react';
import { Vendor } from '@/api/vendors.api';
import { patientDetailsSchema } from '@/schemas/validation';
import { SearchableDropdown, Option } from '@/components/ui/searchable-dropdown';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box
} from '@mui/material';

export interface PatientFormData {
    patient_name: string;
    patient_age: number;
    patient_contact: string;
    patient_email: string;
    patient_height: number;
    patient_weight: number;
    height_unit: string;
    weight_unit: string;
    street: string;
    address_line1: string;
    address_line2: string;
    landmark: string;
    city: string;
    state: string;
    vendor_id: number;
}

interface PatientDetailsFormProps {
    vendors: Vendor[];
    initialData?: Partial<PatientFormData>;
    initialPincode?: string;
    initialEmail?: string;
    initialContactNumber?: string;
    onSubmit: (data: PatientFormData) => void;
    onBack?: () => void;
    isSubmitting?: boolean;
}

const InputField = ({
    label,
    field,
    type = 'text',
    placeholder,
    required = true,
    value,
    error,
    onChange
}: {
    label: string;
    field: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
    value: string | number;
    error?: string;
    onChange: (value: string | number) => void;
}) => (
    <div className="flex flex-col">
        <label className="text-sm font-medium text-slate-500 pl-1">
            {label} {required && <span className="text-red-400">*</span>}
        </label>
        <input
            type={type}
            placeholder={placeholder}
            className={`w-full bg-white border ${error ? 'border-red-400' : 'border-slate-800'} rounded-2xl text-black px-5 py-[0.4rem] text-[1rem] placeholder-slate-600 focus:border-accent-teal focus:bg-white transition-all duration-300 outline-none`}
            value={value}
            onChange={(e) => onChange(type === 'number' ? parseFloat(e.target.value) : e.target.value)}
        />
        {error && <span className="text-red-400 text-xs mt-1 pl-1">{error}</span>}
    </div>
);

const Section = ({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) => (
    <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-accent-teal/10 rounded-lg flex items-center justify-center">
                <Icon className="text-accent-teal" size={18} />
            </div>
            <h3 className="text-white font-bold text-lg">{title}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {children}
        </div>
    </div>
);

const PatientDetailsForm: React.FC<PatientDetailsFormProps> = ({
    vendors,
    initialData,
    initialPincode,
    initialEmail,
    initialContactNumber,
    onSubmit,
    onBack,
    isSubmitting = false
}) => {
    const [formData, setFormData] = useState<PatientFormData>({
        patient_name: '',
        patient_age: 0,
        patient_contact: '',
        patient_email: '',
        patient_height: 0,
        patient_weight: 0,
        height_unit: 'cm',
        weight_unit: 'kg',
        street: '',
        address_line1: '',
        address_line2: '',
        landmark: '',
        city: '',
        state: '',
        vendor_id: initialData?.vendor_id || 0,
    });

    const [showConfirmModal, setShowConfirmModal] = useState(false);

    // Auto-select first vendor when data loads
    // React.useEffect(() => {
    //     if (vendors.length > 0 && formData.vendor_id === 0) {
    //         const firstVendor = vendors[0];
    //         setFormData(prev => ({
    //             ...prev,
    //             vendor_id: firstVendor.id,
    //             patient_name: prev.patient_name || firstVendor.name
    //         }));
    //     }
    // }, [vendors, formData.vendor_id]);

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (field: keyof PatientFormData, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = (): boolean => {
        const validationResult = patientDetailsSchema.safeParse(formData);

        if (!validationResult.success) {
            const newErrors: Record<string, string> = {};
            validationResult.error.issues.forEach((issue) => {
                newErrors[issue.path[0] as string] = issue.message;
            });
            setErrors(newErrors);
            return false;
        }

        setErrors({});
        return true;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            setShowConfirmModal(true);
        }
    };

    const handleConfirmSubmit = () => {
        setShowConfirmModal(false);
        onSubmit(formData);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-[1.1fr,1fr] gap-x-20 mt-1 items-start max-w-[1240px] mx-auto px-6 pb-20">
            {/* Left Column: Image (Tighter height on mobile) */}
            <div className="md:block mb-4 md:mb-0">
                <div className="w-full aspect-[2/1] md:aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-slate-800 shadow-2xl relative">
                    <img
                        src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800"
                        alt="Medical form"
                        className="w-full h-full object-cover grayscale-[0.2] brightness-90 hover:grayscale-0 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent pointer-events-none" />
                </div>
            </div >

            {/* Right Column: Form */}
            < div className="flex flex-col" >
                <div className="mb-6">
                    <h2 className="text-3xl font-bold mb-2 text-black">
                        Patient Details
                    </h2>
                    <p className="text-text-grey text-sm">
                        Please provide patient information and address details
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Patient Information */}
                    <Section title="Patient Information" icon={User}>
                        <InputField
                            label="Full Name"
                            field="patient_name"
                            placeholder="John Doe"
                            value={formData.patient_name}
                            error={errors.patient_name}
                            onChange={(val) => handleChange('patient_name', val)}
                        />
                        <InputField
                            label="Age"
                            field="patient_age"
                            type="number"
                            placeholder="25"
                            value={formData.patient_age}
                            error={errors.patient_age}
                            onChange={(val) => handleChange('patient_age', val)}
                        />
                        <InputField
                            label="Contact Number"
                            field="patient_contact"
                            placeholder="Enter the Contact"
                            value={formData.patient_contact}
                            error={errors.patient_contact}
                            onChange={(val) => handleChange('patient_contact', val)}
                        />
                        <InputField
                            label="Email"
                            field="patient_email"
                            type="email"
                            placeholder="Enter the email"
                            value={formData.patient_email}
                            error={errors.patient_email}
                            onChange={(val) => handleChange('patient_email', val)}
                        />
                        <InputField
                            label="Height (cm)"
                            field="patient_height"
                            type="number"
                            placeholder="170"
                            value={formData.patient_height}
                            error={errors.patient_height}
                            onChange={(val) => handleChange('patient_height', val)}
                        />
                        <InputField
                            label="Weight (kg)"
                            field="patient_weight"
                            type="number"
                            placeholder="70"
                            value={formData.patient_weight}
                            error={errors.patient_weight}
                            onChange={(val) => handleChange('patient_weight', val)}
                        />
                    </Section>

                    {/* Address Information */}
                    <Section title="Address Information" icon={MapPin}>
                        <InputField
                            label="Street"
                            field="street"
                            placeholder="Main Street"
                            required={false}
                            value={formData.street}
                            error={errors.street}
                            onChange={(val) => handleChange('street', val)}
                        />
                        <InputField
                            label="Address Line 1"
                            field="address_line1"
                            placeholder="Near City Center"
                            required={false}
                            value={formData.address_line1}
                            error={errors.address_line1}
                            onChange={(val) => handleChange('address_line1', val)}
                        />
                        <InputField
                            label="Address Line 2"
                            field="address_line2"
                            placeholder="Opposite Park"
                            required={false}
                            value={formData.address_line2}
                            error={errors.address_line2}
                            onChange={(val) => handleChange('address_line2', val)}
                        />
                        <InputField
                            label="Landmark"
                            field="landmark"
                            placeholder="City Mall"
                            required={false}
                            value={formData.landmark}
                            error={errors.landmark}
                            onChange={(val) => handleChange('landmark', val)}
                        />
                        <InputField
                            label="City"
                            field="city"
                            placeholder="Chennai"
                            value={formData.city}
                            error={errors.city}
                            onChange={(val) => handleChange('city', val)}
                        />
                        <InputField
                            label="State"
                            field="state"
                            placeholder="Tamil Nadu"
                            value={formData.state}
                            error={errors.state}
                            onChange={(val) => handleChange('state', val)}
                        />
                    </Section>

                    {/* Contact Details Removed as per user request (duplicates) */}
                    {/* <Section title="Contact Details" icon={Phone}>
                        <InputField label="Alternate Contact" field="contact_number" placeholder="9876543210" required={false} />
                        <InputField label="Alternate Email" field="email" type="email" placeholder="alternate@example.com" required={false} />
                    </Section> */}



                    {/* Buttons */}
                    <div className="flex flex-col gap-3 mt-8 items-center">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-[80%] bg-primary-gradient hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-black text-sm shadow-lg shadow-accent-teal/10 transition-all duration-300 transform hover:-translate-y-1 active:scale-[0.98] flex justify-center items-center gap-2 uppercase tracking-widest"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Confirming...
                                </>
                            ) : (
                                'Confirm Booking'
                            )}
                        </button>
                        {onBack && (
                            <button
                                type="button"
                                onClick={onBack}
                                className="text-slate-500 font-bold text-xs uppercase tracking-widest hover:text-accent-teal transition-colors"
                            >
                                Back to slots
                            </button>
                        )}
                    </div>
                </form>
            </div >

            {/* Confirmation Modal */}
            <Dialog
                open={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                PaperProps={{
                    style: {
                        borderRadius: '20px',
                        padding: '8px',
                        backgroundColor: '#ffffff',
                    },
                }}
            >
                <DialogTitle>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f1115' }}>
                        Confirm Booking
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Typography sx={{ color: '#64748b' }}>
                        Are you sure you want to proceed with this booking?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ padding: '16px 24px' }}>
                    <Button
                        onClick={() => setShowConfirmModal(false)}
                        sx={{
                            color: '#94a3b8',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            '&:hover': {
                                backgroundColor: 'transparent',
                                color: '#07A27D',
                            }
                        }}
                    >
                        No
                    </Button>
                    <Button
                        onClick={handleConfirmSubmit}
                        variant="contained"
                        sx={{
                            background: 'linear-gradient(90deg, #07A27D 0%, #1D548B 100%)',
                            borderRadius: '12px',
                            padding: '8px 24px',
                            fontWeight: 900,
                            boxShadow: '0 4px 12px rgba(7, 162, 125, 0.2)',
                            '&:hover': {
                                background: 'linear-gradient(90deg, #07A27D 0%, #1D548B 100%)',
                                opacity: 0.9,
                            }
                        }}
                    >
                        Yes, Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </div >
    );
};

export default PatientDetailsForm;
