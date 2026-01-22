import { z } from 'zod';

export const phoneSchema = z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[0-9]{10,20}$/, "Phone number must be between 10 and 20 digits");


export const emailSchema = z.string()
    .min(1, "Email is required")
    .email("Invalid email address");

export const contactFormSchema = z.object({
    customerId: z.string().optional(),
    contact_number: phoneSchema,
    pincode: z.string().regex(/^[0-9]{6}$/, "Pincode must be exactly 6 digits"),
    email: emailSchema,
    appointmentDate: z.string().min(1, "Appointment date is required"),
    gender: z.string().optional(),
});

export type ContactFormSchema = z.infer<typeof contactFormSchema>;

export const patientDetailsSchema = z.object({
    patient_name: z.string().min(1, "Name is required"),
    patient_age: z.number().min(1, "Valid age is required"),
    patient_contact: phoneSchema,
    patient_email: emailSchema,
    patient_height: z.number().min(1, "Height is required"),
    patient_weight: z.number().min(1, "Weight is required"),
    height_unit: z.string(),
    weight_unit: z.string(),
    street: z.string().optional(),
    address_line1: z.string().optional(),
    address_line2: z.string().optional(),
    landmark: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    // Removed alternate contact_number and email as per user request
    vendor_id: z.number().min(1, "Vendor selection is required"),
});

export type PatientDetailsSchema = z.infer<typeof patientDetailsSchema>;

export const registerSchema = z.object({
    full_name: z.string().min(1, "Full name is required"),
    email: emailSchema,
    password: z.string().min(8, "Password must be at least 8 characters"),
    gender: z.enum(["Male", "Female", "Other"]),
    // Adding phone number as per user request for "phonenumber validation"
    phone_number: z.string().regex(/^[0-9+\-\s]+$/, "Invalid phone number format").min(10, "Phone number too short"),
});

export const loginSchema = z.object({
    identifier: z.string().min(1, "Email or username is required"),
    password: z.string().min(1, "Password is required"),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
