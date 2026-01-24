import { z } from 'zod';




export const emailSchema = z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email address")
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please enter a valid email address");

export const contactFormSchema = z.object({
    customerId: z.string().optional(),
    username: z.string().min(1, "Username is required"),

    pincode: z.string().regex(/^[0-9]{6}$/, "Pincode must be exactly 6 digits"),
    email: emailSchema,
    appointmentDate: z.string().min(1, "Appointment date is required"),
    gender: z.string().optional(),
    password: z.string().optional().refine(val => !val || val.length >= 8, {
        message: "Password must be at least 8 characters"
    }),
});

export type ContactFormSchema = z.infer<typeof contactFormSchema>;

export const patientDetailsSchema = z.object({
    patient_name: z.string().min(1, "Name is required"),
    patient_age: z.number().min(1, "Valid age is required"),

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
    username: z.string().min(3, "Username must be at least 3 characters"),
    full_name: z.string().min(1, "Full name is required"),
    email: emailSchema,
    password: z.string().min(8, "Password must be at least 8 characters").optional(),
    gender: z.enum(["Male", "Female", "Other"]),
    phone_number: z.string().min(1, "Phone number is required").regex(/^[0-9+\-\s]+$/, "Invalid phone number format").min(10, "Phone number too short"),
});

export const loginSchema = z.object({
    identifier: z.string().min(1, "Email or username is required"),
    password: z.string().min(1, "Password is required"),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
