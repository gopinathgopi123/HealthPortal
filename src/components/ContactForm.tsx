import { checkAvailability } from '@/api/availability.api';
import { useLocation, Link } from "wouter";
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { contactFormSchema } from '@/schemas/validation';
import FormInput from '@/components/ui/form-input';
import { apiRequest } from '@/lib/queryClient';
import { setAuthData } from '@/hooks/use-auth';
import PhoneInput from '@/components/ui/PhoneInput';

import { useAuth } from '@/hooks/use-auth';

interface Slot {
  slot_id: string;
  slot_time: string;
  is_available: boolean;
}

interface ContactFormData {
  customerId: string;
  username: string;
  contact_number: string;
  pincode: string;
  email: string;
  appointmentDate: string;
  gender: string;
  password: string;
  country_code: string;
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
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const searchParams = new URLSearchParams(window.location.search);
  const testId = searchParams.get('id');

  const { showToast } = useToast();

  const [formData, setFormData] = useState<ContactFormData>({
    customerId: '',
    username: ' ',
    contact_number: '',
    pincode: '',
    email: '',
    appointmentDate: '',
    gender: 'Male',
    password: '',
    country_code: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isChecking, setIsChecking] = useState(false);

  // Pre-fill form when user details are available
  React.useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        username: user.username || prev.username,
        email: user.email || prev.email,
        contact_number: user.phone_number || prev.contact_number,
      }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    console.log("ContactForm: formData before validation:", formData);
    const validationResult = contactFormSchema.safeParse(formData);

    if (!validationResult.success) {
      const newErrors: Record<string, string> = {};
      console.log("ContactForm: Validation failed:", validationResult.error.issues);
      validationResult.error.issues.forEach((issue) => {
        newErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(newErrors);
      return;
    }

    console.log("ContactForm: Validation success, checking registration skip...");

    // if (!testId) {
    //   setErrors({ api: "No test selected. Please return to home page." });
    //   return;
    // }

    setIsChecking(true);
    try {
      // 1. Initial Call to Register (skip if user is already logged in)
      if (!user) {
        const registerPayload = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          password2: formData.password,
          first_name: formData.username,
          last_name: "User",
          phone_number: `${formData.country_code}${formData.contact_number}`,
          gender: formData.gender.toLowerCase(),
          postal_code: formData.pincode
        };

        const regRes = await apiRequest("POST", "/public/register/", registerPayload);
        const regResult = await regRes.json();

        if (regResult.success) {
          showToast("Registration successful! Please login.", "success");
          setLocation('/login');
          return;
        } else {
          // Map API errors to form fields
          const apiErrors: Record<string, string> = {};
          if (regResult.errors) {
            Object.keys(regResult.errors).forEach((key) => {
              // Map API field names to form field names
              let formFieldName = key;
              if (key === 'phone_number') formFieldName = 'contact_number';
              if (key === 'password2') formFieldName = 'password';

              const errorValue = regResult.errors[key];
              apiErrors[formFieldName] = Array.isArray(errorValue) ? errorValue[0] : errorValue;
            });
          }
          setErrors(apiErrors);
          return;
        }
      }

      // 2. Availability Check
      console.log("ContactForm: Calling checkAvailability with:", {
        pincode: formData.pincode,
        test_id: testId,
        date: formData.appointmentDate,
        gender: formData.gender.toUpperCase(),
      });
      const availabilityData = await checkAvailability({
        pincode: formData.pincode,
        test_id: testId,
        date: formData.appointmentDate,
        gender: formData.gender.toUpperCase(),
      });

      console.log("Availability response:", availabilityData);

      if (availabilityData?.vendors && availabilityData.vendors.length > 0) {
        const vendor = availabilityData.vendors[0];
        if (!vendor.slots || vendor.slots.length === 0) {
          showToast("No slots available for the selected criteria.", "error");
          setErrors({ api: "No slots available" });
          return;
        }
        onSlotsAvailable?.(vendor.slots, formData, availabilityData);
      } else {
        showToast("No vendors available for this test in your area.", "error");
        setErrors({ api: "No vendors available" });
      }
    } catch (err: any) {
      // Try to parse error response if it's a JSON string
      let errorMessage = err.message || "Something went wrong. Please try again.";

      try {
        // Check if error message is a JSON string
        const parsedError = JSON.parse(errorMessage);
        if (parsedError.errors && typeof parsedError.errors === 'object') {
          // Map API errors to form fields
          const apiErrors: Record<string, string> = {};
          Object.keys(parsedError.errors).forEach((key) => {
            let formFieldName = key;
            if (key === 'phone_number') formFieldName = 'contact_number';
            if (key === 'password2') formFieldName = 'password';

            const errorValue = parsedError.errors[key];
            apiErrors[formFieldName] = Array.isArray(errorValue) ? errorValue[0] : errorValue;
          });
          setErrors(apiErrors);
          return;
        }
      } catch (parseError) {
        // If parsing fails, it's a regular error message
      }

      // For non-field-specific errors (like network errors)
      showToast(errorMessage, "error");
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
      <div className="md:block mb-4 md:mb-0">
        <div className="w-full aspect-[3/1] sm:aspect-[4/4]    rounded-[1.5rem] overflow-hidden bg-slate-800 shadow-2xl relative">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800"
            alt="User portrait"
            className="w-full h-full object-cover object-top grayscale-[0.2] brightness-90 hover:grayscale-0 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent pointer-events-none" />
        </div>
      </div>

      <div className="flex flex-col mt-1">
        <div>
          <h2 className="text-3xl font-bold mb-2 text-black">
            Contact Information
          </h2>
          <p className="text-gray-500 text-base mb-6">
            We'll use this to keep you informed about your test and results
          </p>
        </div>

        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>

          <FormInput
            variant="floating"
            label="Username"
            value={formData.username}
            error={errors.username}
            onChange={(e) => {
              setFormData({ ...formData, username: e.target.value });
              if (errors.username) setErrors(prev => ({ ...prev, username: '' }));
            }}
          />

          {!user && (
            <PhoneInput
              variant="floating"
              label="Phone Number"
              value={formData.contact_number}
              error={errors.contact_number}
              onChange={(fullNumber, countryCode) => {
                // Store the suffix only in contact_number if we use country_code prefix in payload
                // Or store the full number. Given the user's payload uses prefix, 
                // we should store just the digits in contact_number or handle it carefully.
                // My PhoneInput returns fullNumber = code + val.
                // Let's store countryCode and the suffix.
                const suffix = fullNumber.startsWith(countryCode) ? fullNumber.slice(countryCode.length) : fullNumber;
                setFormData({ ...formData, contact_number: suffix, country_code: countryCode });
                if (errors.contact_number) setErrors(prev => ({ ...prev, contact_number: '' }));
              }}
            />
          )}


          <FormInput
            variant="floating"
            type="email"
            label="Email"
            value={formData.email}
            error={errors.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
            }}
          />
          {!user && (
            <FormInput
              variant="floating"
              type="password"
              label="Password"
              value={formData.password}
              error={errors.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
              }}
            />
          )}

          <FormInput
            variant="floating"
            isSelect
            label="Gender"
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            options={[
              { label: 'Male', value: 'Male' },
              { label: 'Female', value: 'Female' },
              { label: 'Other', value: 'Other' }
            ]}
          />

          <FormInput
            variant="floating"
            label="Pincode"
            value={formData.pincode}
            error={errors.pincode}
            onChange={(e) => {
              handlePincodeChange(e as React.ChangeEvent<HTMLInputElement>);
              if (errors.pincode) setErrors(prev => ({ ...prev, pincode: '' }));
            }}
            maxLength={6}
          />

          <FormInput
            variant="floating"
            type="date"
            label="Appointment Date"
            value={formData.appointmentDate}
            error={errors.appointmentDate}
            onChange={(e) => {
              setFormData({ ...formData, appointmentDate: e.target.value });
              if (errors.appointmentDate) setErrors(prev => ({ ...prev, appointmentDate: '' }));
            }}
            min={new Date().toISOString().split('T')[0]}
          />




          <div className="mt-8 flex flex-col">
            <button
              type="submit"
              disabled={isChecking}
              className="bg-primary-gradient hover:opacity-90 disabled:opacity-50 text-white py-3 rounded-xl font-black text-sm w-[80%] mx-auto shadow-lg shadow-accent-teal/10 transition-all duration-300 transform hover:-translate-y-1 active:scale-[0.98] flex justify-center items-center gap-2 uppercase tracking-widest"
            >
              {isChecking ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                "Continue to address"
              )}
            </button>
            <p className="text-center text-[0.85rem] text-slate-500 font-bold mt-4">
              Registered with AIWO?{' '}
              <Link href="/login" className="text-accent-teal hover:text-accent-blue transition-all ml-1 underline underline-offset-4 decoration-accent-teal/30">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
