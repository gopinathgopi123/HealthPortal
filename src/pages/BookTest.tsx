import React, { useState } from 'react';
import ContactForm from "@/components/ContactForm";
import SlotSelection from "@/components/SlotSelection";
import ProgressBar from "@/components/ProgressBar";

interface Slot {
    slot_id: string;
    slot_time: string;
    is_available: boolean;
}

const BookTest: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);

    const handleSlotsAvailable = (slots: Slot[]) => {
        setAvailableSlots(slots);
        setCurrentStep(2);
    };

    const handleSlotSelected = (slotId: string) => {
        console.log("Selected slot:", slotId);
        // Move to next step (address/summary)
        setCurrentStep(3);
    };

    return (
        <div className="min-h-screen bg-[#020617] py-4">
            <div className="max-w-[1400px] mx-auto">
                <ProgressBar currentStep={currentStep} />

                {currentStep === 1 && (
                    <ContactForm onSlotsAvailable={handleSlotsAvailable} />
                )}

                {currentStep === 2 && (
                    <SlotSelection
                        slots={availableSlots}
                        onNext={handleSlotSelected}
                    />
                )}

                {currentStep === 3 && (
                    <div className="text-center text-white py-20">
                        <h2 className="text-2xl font-bold">Summary Page</h2>
                        <p className="text-text-grey mt-2">Coming soon...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookTest;