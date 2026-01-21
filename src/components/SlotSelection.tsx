import React, { useState } from 'react';
import { Check } from 'lucide-react';

interface Slot {
    slot_id: string;
    slot_time: string;
    is_available: boolean;
}

interface SlotSelectionProps {
    slots: Slot[];
    onNext?: (selectedSlotId: string) => void;
}

const SlotSelection: React.FC<SlotSelectionProps> = ({ slots, onNext }) => {
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

    const handleContinue = () => {
        if (selectedSlot && onNext) {
            onNext(selectedSlot);
        }
    };

    const availableSlots = slots.filter(slot => slot.is_available);

    return (
        <div className="grid grid-cols-1 md:grid-cols-[1.1fr,1fr] gap-x-20 mt-3 items-start max-w-[1240px] mx-auto px-6 pb-10">
            {/* Left Column: Image */}
            <div className="hidden md:block sticky top-20">
                <div className="w-full aspect-[5/5] rounded-[2.5rem] overflow-hidden bg-slate-800 shadow-2xl relative">
                    <img
                        src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800"
                        alt="Medical appointment"
                        className="w-full h-full object-cover grayscale-[0.2] brightness-90 hover:grayscale-0 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent pointer-events-none" />
                </div>
            </div>

            {/* Right Column: Slot Selection */}
            <div className="flex flex-col">
                <div>
                    <h2 className="text-2xl md:text-[2.25rem] font-extrabold leading-[1.1] mb-3 text-white tracking-tight">
                        Select Time Slot
                    </h2>
                    <p className="text-text-grey text-sm mb-6">
                        Choose your preferred appointment time from the available slots below
                    </p>
                </div>

                {/* Slots Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                    {availableSlots.map((slot) => (
                        <button
                            key={slot.slot_id}
                            onClick={() => setSelectedSlot(slot.slot_id)}
                            className={`relative px-4 py-4 rounded-xl border-2 transition-all duration-300 text-left ${selectedSlot === slot.slot_id
                                    ? 'border-accent-teal bg-accent-teal/10 shadow-lg shadow-accent-teal/20'
                                    : 'border-slate-800 bg-slate-950/50 hover:border-accent-teal/50 hover:bg-slate-900'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-white font-bold text-base">
                                        {slot.slot_time}
                                    </p>
                                    <p className="text-text-grey text-xs mt-1">
                                        Available
                                    </p>
                                </div>
                                {selectedSlot === slot.slot_id && (
                                    <div className="flex-shrink-0 w-6 h-6 bg-accent-teal rounded-full flex items-center justify-center">
                                        <Check size={16} className="text-slate-950" />
                                    </div>
                                )}
                            </div>
                        </button>
                    ))}
                </div>

                {/* No slots message */}
                {availableSlots.length === 0 && (
                    <div className="text-center py-10 bg-red-400/10 rounded-xl border border-red-400/20">
                        <p className="text-red-400 font-bold">No available slots found</p>
                        <p className="text-text-grey text-sm mt-2">Please try a different date or pincode</p>
                    </div>
                )}

                {/* Continue Button */}
                {availableSlots.length > 0 && (
                    <div className="mt-6">
                        <button
                            onClick={handleContinue}
                            disabled={!selectedSlot}
                            className="bg-primary-gradient hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white py-[1.15rem] rounded-2xl font-extrabold text-[1.1rem] w-full shadow-lg shadow-accent-teal/20 transition-all duration-300 transform hover:-translate-y-1 active:scale-[0.98]"
                        >
                            Continue to Summary
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SlotSelection;
