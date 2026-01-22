import React from 'react';
import { Edit2, User, Mail, Phone, MapPin, Calendar, Clock, Building2 } from 'lucide-react';
import { BookingPayload } from '@/api/orders.api';
import { Vendor } from '@/api/vendors.api';

interface BookingSummaryProps {
    bookingData: Partial<BookingPayload>;
    vendorInfo?: Vendor;
    testName?: string;
    onEdit?: (section: 'contact' | 'details' | 'slot') => void;
    onConfirm?: () => void;
    isSubmitting?: boolean;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
    bookingData,
    vendorInfo,
    testName,
    onEdit,
    onConfirm,
    isSubmitting = false,
}) => {
    const InfoSection = ({
        title,
        icon: Icon,
        section,
        children
    }: {
        title: string;
        icon: any;
        section: 'contact' | 'details' | 'slot';
        children: React.ReactNode
    }) => (
        <div className="bg-slate-950/30 border border-slate-800 rounded-2xl p-6 relative">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent-teal/10 rounded-xl flex items-center justify-center">
                        <Icon className="text-accent-teal" size={20} />
                    </div>
                    <h3 className="text-white font-bold text-lg">{title}</h3>
                </div>
                {onEdit && (
                    <button
                        onClick={() => onEdit(section)}
                        className="text-accent-teal hover:text-accent-blue transition-colors flex items-center gap-1 text-sm font-semibold"
                    >
                        <Edit2 size={16} />
                        Edit
                    </button>
                )}
            </div>
            <div className="space-y-3">
                {children}
            </div>
        </div>
    );

    const InfoItem = ({ label, value }: { label: string; value?: string | number }) => (
        <div className="flex justify-between items-start">
            <span className="text-slate-500 text-sm font-medium">{label}</span>
            <span className="text-white text-sm font-semibold text-right max-w-[60%]">
                {value || 'N/A'}
            </span>
        </div>
    );

    return (
        <div className="max-w-[1240px] mx-auto px-6 pb-10">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl md:text-[2.25rem] font-extrabold leading-[1.1] mb-2 text-white tracking-tight">
                    Review & Confirm
                </h2>
                <p className="text-text-grey text-sm">
                    Please review your booking details before confirming
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Patient Information */}
                <InfoSection title="Patient Information" icon={User} section="details">
                    <InfoItem label="Name" value={bookingData.patient_name} />
                    <InfoItem label="Gender" value={bookingData.patient_gender} />
                    <InfoItem label="Age" value={bookingData.patient_age} />
                    <InfoItem
                        label="Height"
                        value={bookingData.patient_height ? `${bookingData.patient_height} ${bookingData.height_unit}` : undefined}
                    />
                    <InfoItem
                        label="Weight"
                        value={bookingData.patient_weight ? `${bookingData.patient_weight} ${bookingData.weight_unit}` : undefined}
                    />
                </InfoSection>

                {/* Contact Details */}
                <InfoSection title="Contact Details" icon={Phone} section="contact">
                    <InfoItem label="Patient Email" value={bookingData.patient_email} />
                    <InfoItem label="Patient Contact" value={bookingData.patient_contact} />
                    <InfoItem label="Alternate Email" value={bookingData.email} />
                    <InfoItem label="Alternate Contact" value={bookingData.contact_number} />
                </InfoSection>

                {/* Address Information */}
                <InfoSection title="Address Information" icon={MapPin} section="contact">
                    <InfoItem label="Street" value={bookingData.street} />
                    <InfoItem label="Address Line 1" value={bookingData.address_line1} />
                    <InfoItem label="Address Line 2" value={bookingData.address_line2} />
                    <InfoItem label="Landmark" value={bookingData.landmark} />
                    <InfoItem label="City" value={bookingData.city} />
                    <InfoItem label="State" value={bookingData.state} />
                    <InfoItem label="Pincode" value={bookingData.pincode} />
                </InfoSection>

                {/* Appointment Details */}
                <InfoSection title="Appointment Details" icon={Calendar} section="slot">
                    <InfoItem label="Test" value={testName} />
                    <InfoItem label="Date" value={bookingData.appointment_date} />
                    <InfoItem label="Time" value={bookingData.appointment_time} />
                    <InfoItem label="Payment Type" value={bookingData.payment_type} />
                </InfoSection>

                {/* Vendor Information */}
                {vendorInfo && (
                    <div className="lg:col-span-2">
                        <InfoSection title="Testing Center" icon={Building2} section="contact">
                            <InfoItem label="Vendor Name" value={vendorInfo.name} />
                            <InfoItem label="Vendor Code" value={vendorInfo.code} />
                            <InfoItem label="Status" value={vendorInfo.is_active ? 'Active' : 'Inactive'} />
                        </InfoSection>
                    </div>
                )}
            </div>

            {/* Confirm Button */}
            <div className="mt-8 flex gap-4">
                <button
                    onClick={() => onEdit?.('slot')}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-[1.15rem] rounded-2xl font-extrabold text-[1.1rem] transition-all duration-300"
                >
                    Go Back
                </button>
                <button
                    onClick={onConfirm}
                    disabled={isSubmitting}
                    className="flex-1 bg-primary-gradient hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white py-[1.15rem] rounded-2xl font-extrabold text-[1.1rem] shadow-lg shadow-accent-teal/20 transition-all duration-300 transform hover:-translate-y-1 active:scale-[0.98] flex justify-center items-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Booking...
                        </>
                    ) : (
                        'Confirm Booking'
                    )}
                </button>
            </div>
        </div>
    );
};

export default BookingSummary;
