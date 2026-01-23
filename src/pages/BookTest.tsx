import React, { useState } from 'react';
import ContactForm from "@/components/ContactForm";
import SlotSelection from "@/components/SlotSelection";
import PatientDetailsForm, { PatientFormData } from "@/components/PatientDetailsForm";
import ProgressBar from "@/components/ProgressBar";
import { BookingPayload, bookLabTest } from "@/api/orders.api";
import { useVendors } from "@/services/vendors.service";
import { useLabTests } from "@/services/labs.service";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { checkAvailability } from "@/api/availability.api";

interface Slot {
    slot_id: string;
    slot_time: string;
    is_available: boolean;
}

interface ContactFormData {
    customerId: string;
    contact_number: string;
    pincode: string;
    email: string;
    appointmentDate: string;
    gender: string;
}

interface AvailabilityResponse {
    vendors: Array<{
        vendor_id: number;
        slots: Slot[];
    }>;
}

const BookTest: React.FC = () => {
    const [, navigate] = useLocation();
    const searchParams = new URLSearchParams(window.location.search);
    const testId = searchParams.get('id');

    const { data: vendors } = useVendors();
    const { data: tests } = useLabTests();
    const { showToast } = useToast();

    const [currentStep, setCurrentStep] = useState(1);
    const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
    const [availabilityData, setAvailabilityData] = useState<AvailabilityResponse | null>(null);
    const [contactFormData, setContactFormData] = useState<ContactFormData | null>(null);
    const [selectedSlotId, setSelectedSlotId] = useState<string>('');
    const [selectedSlotTime, setSelectedSlotTime] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isRefreshingSlots, setIsRefreshingSlots] = useState(false);

    // State for all booking data
    const [bookingData, setBookingData] = useState<Partial<BookingPayload>>({
        test_id: testId || '',
        payment_type: 'PREPAID',
        height_unit: 'cm',
        weight_unit: 'kg',
    });

    const handleSlotsAvailable = (
        slots: Slot[],
        formData: ContactFormData,
        availResponse: AvailabilityResponse
    ) => {
        setAvailableSlots(slots);
        setContactFormData(formData);
        setAvailabilityData(availResponse);

        // Update booking data with contact form info
        setBookingData(prev => ({
            ...prev,
            pincode: formData.pincode,
            patient_gender: formData.gender.toUpperCase() as "MALE" | "FEMALE" | "OTHER",
            appointment_date: formData.appointmentDate,
            contact_number: formData.contact_number, // Store Step 1 contact
            email: formData.email, // Store Step 1 email
        }));

        setCurrentStep(2);
    };

    const handleSlotSelected = (slotId: string, vendorId: number) => {
        const selectedSlot = availableSlots.find(slot => slot.slot_id === slotId);

        setSelectedSlotId(slotId);
        setSelectedSlotTime(selectedSlot?.slot_time || '');

        setBookingData(prev => ({
            ...prev,
            slot_id: slotId,
            vendor_id: vendorId,
            appointment_time: selectedSlot?.slot_time || '',
        }));

        setCurrentStep(3);
    };

    const formatTimeTo24H = (timeString: string) => {
        if (!timeString) return '';
        // Input example: "07:30 AM - 08:00 AM" or "07:30 AM"
        const startTime = timeString.split('-')[0].trim(); // Get "07:30 AM"
        const [time, modifier] = startTime.split(' ');
        let [hours, minutes] = time.split(':');

        if (hours === '12') {
            hours = '00';
        }

        if (modifier === 'PM') {
            hours = String(parseInt(hours, 10) + 12);
        }

        return `${hours.padStart(2, '0')}:${minutes}`;
    };

    const handlePatientDetailsSubmit = async (formData: PatientFormData) => {
        // Build complete payload and submit booking
        const completeBookingData: BookingPayload = {
            vendor_id: formData.vendor_id,
            test_id: bookingData.test_id || '',
            slot_id: selectedSlotId,
            patient_name: formData.patient_name,
            patient_gender: bookingData.patient_gender || 'MALE',
            patient_age: String(formData.patient_age),
            patient_contact: formData.patient_contact,
            patient_email: formData.patient_email,
            patient_height: formData.patient_height,
            patient_weight: formData.patient_weight,
            height_unit: formData.height_unit,
            weight_unit: formData.weight_unit,
            street: formData.street,
            address_line1: formData.address_line1,
            address_line2: formData.address_line2,
            landmark: formData.landmark,
            city: formData.city,
            state: formData.state,
            pincode: contactFormData?.pincode || bookingData.pincode || '',
            contact_number: contactFormData?.contact_number || '', // From Step 1 directly
            email: contactFormData?.email || '', // From Step 1 directly
            gender: bookingData.patient_gender || 'MALE',
            appointment_date: bookingData.appointment_date || '',
            appointment_time: formatTimeTo24H(selectedSlotTime), // Formatted to HH:mm
            payment_type: 'PREPAID',
        };

        setIsSubmitting(true);
        try {
            const response = await bookLabTest(completeBookingData);
            showToast(response.message || "Booking confirmed successfully!", "success");

            // Navigate to success page or dashboard
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (error: any) {
            showToast(error.message || "Failed to confirm booking", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen  py-4">
            <div className="max-w-[1600px] mx-auto">
                <ProgressBar currentStep={currentStep} />

                {currentStep === 1 && (
                    <ContactForm
                        onSlotsAvailable={handleSlotsAvailable}
                    />
                )}

                {currentStep === 2 && (
                    <SlotSelection
                        availabilityData={availabilityData!}
                        vendors={vendors || []}
                        isLoading={isRefreshingSlots}
                        onNext={handleSlotSelected}
                        onBackToContact={() => setCurrentStep(1)}
                        selectedDate={bookingData.appointment_date || ''}
                        onDateChange={async (date: string) => {
                            if (!contactFormData || !testId) return;

                            setBookingData(prev => ({ ...prev, appointment_date: date }));
                            setIsRefreshingSlots(true);

                            try {
                                const newAvailability = await checkAvailability({
                                    pincode: contactFormData.pincode,
                                    test_id: testId,
                                    date: date,
                                    gender: contactFormData.gender.toUpperCase(),
                                });

                                setAvailabilityData(newAvailability);
                                if (newAvailability.vendors && newAvailability.vendors.length > 0) {
                                    setAvailableSlots(newAvailability.vendors[0].slots);
                                } else {
                                    setAvailableSlots([]);
                                }
                            } catch (error) {
                                showToast("Failed to refresh slots for selected date", "error");
                            } finally {
                                setIsRefreshingSlots(false);
                            }
                        }}
                    />
                )}

                {currentStep === 3 && (
                    <PatientDetailsForm
                        vendors={vendors || []}
                        initialData={bookingData as any}
                        initialPincode={contactFormData?.pincode}
                        initialEmail={contactFormData?.email}
                        initialContactNumber={contactFormData?.contact_number}
                        onSubmit={handlePatientDetailsSubmit}
                        onBack={() => setCurrentStep(2)}
                        isSubmitting={isSubmitting}
                    />
                )}
            </div>
        </div>
    );
};

export default BookTest;