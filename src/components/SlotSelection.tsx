import React, { useState, useMemo } from 'react';
import { Check } from 'lucide-react';
import { Vendor } from '@/api/vendors.api';

interface Slot {
    slot_id: string;
    slot_time: string;
    is_available?: boolean;
}

interface AvailabilityVendor {
    vendor_id: number;
    slots: Slot[];
}

interface AvailabilityData {
    vendors: AvailabilityVendor[];
}

interface SlotSelectionProps {
    availabilityData: AvailabilityData;
    vendors: Vendor[];
    selectedDate: string;
    isLoading?: boolean;
    onNext?: (selectedSlotId: string, vendorId: number) => void;
    onDateChange?: (date: string) => void;
}

const SlotSelection: React.FC<SlotSelectionProps> = ({
    availabilityData,
    vendors,
    selectedDate,
    isLoading = false,
    onNext,
    onDateChange
}) => {
    const [selectedSlot, setSelectedSlot] = useState<{ id: string; vendorId: number } | null>(null);

    const handleContinue = () => {
        if (selectedSlot && onNext) {
            onNext(selectedSlot.id, selectedSlot.vendorId);
        }
    };

    const getVendorName = (vendorId: number) => {
        return vendors.find(v => v.id === vendorId)?.name || 'Unknown Vendor';
    };

    const dates = useMemo(() => {
        const result = [];
        const start = new Date();
        for (let i = 0; i < 7; i++) {
            const date = new Date(start);
            date.setDate(start.getDate() + i);
            result.push({
                full: date.toISOString().split('T')[0],
                day: date.toLocaleDateString('en-US', { weekday: 'short' })[0],
                date: date.getDate(),
                month: date.toLocaleDateString('en-US', { month: 'short' })
            });
        }
        return result;
    }, []);

    const allSlots = useMemo(() => {
        return (availabilityData?.vendors || []).flatMap(v =>
            (v.slots || []).map(s => ({ ...s, vendor_id: v.vendor_id, vendor_name: getVendorName(v.vendor_id) }))
        ).filter(s => s.is_available !== false);
    }, [availabilityData, vendors]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-[1.1fr,1fr] gap-x-20 mt-1 items-start max-w-[1240px] mx-auto px-6 pb-20">
            {/* Left Column: Image (Tighter height on mobile) */}
            <div className="md:block mb-4 md:mb-0">
                <div className="w-full aspect-[2/1] md:aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-slate-800 shadow-2xl relative">
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
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Step 2 of 3</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black mb-1 text-slate-900 leading-tight">
                        Slot Schedule
                    </h2>
                    <p className="text-slate-500 text-[0.8rem]">
                        Choose your preferred appointment date and time slot
                    </p>
                </div>

                {/* Date Selector */}
                <div className="flex gap-2 overflow-x-auto pb-3 mb-4 no-scrollbar touch-pan-x">
                    {dates.map((d) => (
                        <button
                            key={d.full}
                            onClick={() => onDateChange?.(d.full)}
                            className={`flex flex-col items-center min-w-[50px] py-3 rounded-2xl transition-all duration-300 ${selectedDate === d.full
                                ? 'bg-primary-gradient text-white shadow-lg shadow-accent-teal/30 scale-105'
                                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                                }`}
                        >
                            <span className="text-[0.6rem] font-bold uppercase mb-1">{d.day}</span>
                            <span className="text-base font-black">{d.date}</span>
                            <span className="text-[0.55rem] font-bold uppercase mt-0.5">{d.month}</span>
                        </button>
                    ))}
                </div>

                {/* Slots Grid Area */}
                <div className="relative min-h-[200px]">
                    {isLoading && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-30 flex items-center justify-center rounded-2xl">
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-8 h-8 border-4 border-accent-teal/30 border-t-accent-teal rounded-full animate-spin" />
                                <span className="text-xs font-bold text-accent-teal uppercase tracking-widest text-center">Updating Slots...</span>
                            </div>
                        </div>
                    )}

                    <div className={`grid grid-cols-2 gap-x-3 gap-y-6 mb-8 mt-4 transition-opacity duration-300 ${isLoading ? 'opacity-30' : 'opacity-100'}`}>
                        {allSlots.length > 0 ? (
                            allSlots.map((slot) => (
                                <button
                                    key={`${slot.vendor_id}-${slot.slot_id}`}
                                    onClick={() => setSelectedSlot({ id: slot.slot_id, vendorId: slot.vendor_id })}
                                    className={`relative px-3 py-3 rounded-xl border-2 transition-all duration-300 text-left group ${selectedSlot?.id === slot.slot_id
                                        ? 'border-accent-teal bg-accent-teal/5 ring-1 ring-accent-teal'
                                        : 'border-slate-100 bg-white hover:border-accent-teal/30'
                                        }`}
                                >
                                    {/* Vendor Badge - Positioned on the border - more compact */}
                                    <div className="absolute -top-2.5 right-3 px-2 py-0.5 bg-accent-teal text-white text-[0.55rem] font-black rounded-md uppercase tracking-wider shadow-sm z-20 transition-transform duration-300 group-hover:scale-105">
                                        {slot.vendor_name}
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <p className={`text-[0.7rem] sm:text-[0.75rem] font-bold whitespace-nowrap ${selectedSlot?.id === slot.slot_id ? 'text-accent-teal' : 'text-slate-900'}`}>
                                            {slot.slot_time}
                                        </p>
                                        {selectedSlot?.id === slot.slot_id && (
                                            <div className="w-3.5 h-3.5 bg-accent-teal rounded-full flex items-center justify-center flex-shrink-0 ml-1">
                                                <Check size={8} className="text-white" />
                                            </div>
                                        )}
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-10 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No slots available</p>
                            </div>
                        )}
                    </div>

                    {/* Continue Button - Centered and non-fixed */}
                    <div className="flex justify-center">
                        <button
                            onClick={handleContinue}
                            disabled={!selectedSlot?.id || isLoading}
                            className="bg-primary-gradient hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-black text-sm w-[80%] shadow-lg shadow-accent-teal/10 transition-all duration-300 transform hover:-translate-y-1 active:scale-[0.98] uppercase tracking-widest mt-2"
                        >
                            Continue to Address
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SlotSelection;
