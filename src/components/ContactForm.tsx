import { useCustomers } from '@/services/users.service';
import { checkAvailability } from '@/api/availability.api';
import { useLocation } from "wouter";
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { contactFormSchema } from '@/schemas/validation';

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

interface ContactFormProps {
  onSlotsAvailable?: (
    slots: Slot[],
    formData: ContactFormData,
    availabilityResponse: AvailabilityResponse
  ) => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ onSlotsAvailable }) => {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const testId = searchParams.get('id');

  const { data: customers, isLoading: isCustomersLoading } = useCustomers();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    customerId: '',
    contact_number: '',
    pincode: '',
    email: '',
    appointmentDate: '',
    gender: 'Male',
  });

  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);



    const validationResult = contactFormSchema.safeParse(formData);

    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0];
      setError(firstError.message);
      return;
    }

    if (!testId) {
      setError("No test selected. Please return to home page.");
      return;
    }

    setIsChecking(true);
    try {
      // {{base_url}}/api/availability/check?pincode={{pincode}}&test_id={{test_id}}&date={{appointment_date}}&gender=MALE

      const availabilityData = await checkAvailability({
        pincode: formData.pincode,
        test_id: testId,
        date: formData.appointmentDate,
        gender: formData.gender.toUpperCase(),
      });

      console.log("Availability response:", availabilityData);

      // Check if slots are available in vendors[0].slots
      if (availabilityData?.vendors && availabilityData.vendors.length > 0) {
        const vendor = availabilityData.vendors[0];
        if (!vendor.slots || vendor.slots.length === 0) {
          showToast("No slots available for the selected criteria. Please try different date or pincode.", "error");
          setError("No slots available");
          return;
        }
        // Slots are available, pass them to parent
        if (onSlotsAvailable) {
          onSlotsAvailable(vendor.slots, formData, availabilityData);
        }
      } else {
        showToast("No vendors available for this test in your area.", "error");
        setError("No vendors available");
      }
    } catch (err: any) {
      setError(err.message || "Availability check failed. Please try again.");
      showToast(err.message || "Availability check failed. Please try again.", "error");
    } finally {
      setIsChecking(false);
    }
  };

  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setFormData({ ...formData, pincode: val });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1.1fr,1fr] gap-x-20 mt-1 items-start max-w-[1240px] mx-auto px-6 pb-20">
      {/* Left Column: Image (Tighter height on mobile) */}
      <div className="md:block mb-4 md:mb-0">
        <div className="w-full aspect-[2/1] md:aspect-[5/5] rounded-[2.5rem] overflow-hidden bg-slate-800 shadow-2xl relative">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800"
            alt="User portrait"
            className="w-full h-full object-cover grayscale-[0.2] brightness-90 hover:grayscale-0 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Right Column: Form */}
      <div className="flex flex-col mt-5  ">

        {/* Title and Subtitle */}
        <div >
          <h2 className="text-3xl font-bold mb-2 text-black">
            Contact Information
          </h2>
          <p className="text-gray-500 text-base mb-6">
            We'll use this to keep you informed about your test and results
          </p>
        </div>

        {/* Global Error Message */}
        {error && (
          <div className="mb-4 bg-red-400/10 border border-red-400/20 text-red-400 px-4 py-3 rounded-xl text-sm font-bold">
            {error}
          </div>
        )}

        {/* Form */}
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>

          {/* Phone Number */}
          <div className="relative">
            <input
              type="tel"
              id="phone"
              placeholder=" "
              className="peer bg-white w-full border border-slate-800 rounded-2xl text-black px-5 pt-6 pb-2 text-[1rem] outline-none"
              value={formData.contact_number}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 20);
                setFormData({ ...formData, contact_number: val });
              }}
              maxLength={20}
            />
            <label
              htmlFor="phone"
              className="absolute left-5 top-4 text-slate-500 text-sm font-medium transition-all duration-300
              peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-[1rem] peer-placeholder-shown:top-[0.8rem]
              peer-focus:-translate-y-3 peer-focus:text-[0.8rem] peer-focus:top-4
              peer-[:not(:placeholder-shown)]:-translate-y-3 peer-[:not(:placeholder-shown)]:text-[0.8rem] peer-[:not(:placeholder-shown)]:top-4 pointer-events-none"
            >
              Phone Number
            </label>

          </div>

          {/* Customer Dropdown */}
          {/* <div className="flex flex-col  ">
            <label className="text-[0.7rem] font-bold text-slate-500 uppercase tracking-widest pl-1">
              Customer List
            </label>
            <div className="relative group">
              <select
                value={formData.customerId}
                onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                disabled={isCustomersLoading}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl text-white px-5 py-[0.4rem] text-[1rem] appearance-none focus:border-blue-500/50 focus:bg-slate-900 transition-all duration-300 outline-none cursor-pointer disabled:opacity-50"
              >
                <option value="">Select Customer</option>
                {Array.isArray(customers) && customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.first_name} {customer.last_name} ({customer.username})
                  </option>
                ))}
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div> */}

          {/* Pincode */}
          <div className="relative">
            <input
              type="text"
              id="pincode"
              placeholder=" "
              className="peer bg-white w-full border border-slate-800 rounded-2xl text-black px-5 pt-6 pb-2 text-[1rem]     outline-none"
              value={formData.pincode}
              onChange={handlePincodeChange}
              maxLength={6}
            />
            <label
              htmlFor="pincode"
              className="absolute left-5 top-4 text-slate-500 text-sm font-medium transition-all duration-300
              peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-[1rem] peer-placeholder-shown:top-[0.8rem]
              peer-focus:-translate-y-3 peer-focus:text-[0.8rem] peer-focus:top-4
              peer-[:not(:placeholder-shown)]:-translate-y-3 peer-[:not(:placeholder-shown)]:text-[0.8rem] peer-[:not(:placeholder-shown)]:top-4 pointer-events-none"
            >
              Pincode
            </label>
          </div>

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              id="email"
              placeholder=" "
              className="peer bg-white w-full border border-slate-800 rounded-2xl text-black px-5 pt-6 pb-2 text-[1rem]     outline-none" value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <label
              htmlFor="email"
              className="absolute left-5 top-4 text-slate-500 text-sm font-medium transition-all duration-300
              peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-[1rem] peer-placeholder-shown:top-[0.8rem]
              peer-focus:-translate-y-3 peer-focus:text-[0.8rem] peer-focus:top-4
              peer-[:not(:placeholder-shown)]:-translate-y-3 peer-[:not(:placeholder-shown)]:text-[0.8rem] peer-[:not(:placeholder-shown)]:top-4 pointer-events-none"
            >
              Email
            </label>
          </div>

          {/* Appointment Date */}
          <div className="relative">
            <input
              type="date"
              id="date"
              className="peer bg-white w-full border border-slate-800 rounded-2xl text-black px-5 pt-6 pb-2 text-[1rem]     outline-none"
              value={formData.appointmentDate}
              onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
            />
            <label
              htmlFor="date"
              className="absolute left-5 top-4 text-slate-500 text-sm font-medium transition-all duration-300 -translate-y-3 top-4 pointer-events-none"
            >
              Appointment Date
            </label>
          </div>

          {/* Gender */}
          <div className="relative group">
            <select
              id="gender"
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="peer bg-white w-full border border-slate-800 rounded-2xl text-black px-5 pt-6 pb-2 text-[1rem]     outline-none"            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <label
              htmlFor="gender"
              className="absolute left-5 top-4 text-slate-500 text-sm font-medium transition-all duration-300 -translate-y-3 top-4 pointer-events-none"
            >
              Gender
            </label>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex flex-col  ">
            <button
              type="submit"
              disabled={isChecking}
              className="bg-primary-gradient hover:opacity-90 disabled:opacity-50 text-white py-3 rounded-xl font-black text-sm w-[80%] mx-auto shadow-lg shadow-accent-teal/10 transition-all duration-300 transform hover:-translate-y-1 active:scale-[0.98] flex justify-center items-center gap-2 uppercase tracking-widest"
            >
              {isChecking ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Checking Availability...
                </>
              ) : (
                "Continue to address"
              )}
            </button>
            <p className="text-center text-[0.85rem] text-slate-500 font-bold">
              Registered with AIWO?{' '}
              <a href="#" className="text-accent-teal hover:text-accent-blue transition-all ml-1 underline underline-offset-4 decoration-accent-teal/30">
                Sign in
              </a>
            </p>
          </div>
        </form>
      </div >
    </div >
  );
};

export default ContactForm;
