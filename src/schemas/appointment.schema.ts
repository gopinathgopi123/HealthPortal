import { z } from "zod";

export const AppointmentTypeSchema = z.object({
    id: z.union([z.string(), z.number()]),
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    status: z.union([z.string(), z.number(), z.null()]).optional(),
    is_active: z.boolean().optional(),
});

export const AppointmentTypesResponseSchema = z.object({
    data: z.array(AppointmentTypeSchema),
    totalRecords: z.number().optional(),
    totalPages: z.number().optional(),
    pagination: z.object({
        total: z.number(),
        page: z.number(),
        limit: z.number(),
        totalPages: z.number(),
    }).optional(),
});

export type AppointmentType = z.infer<typeof AppointmentTypeSchema>;
export type AppointmentTypesResponse = z.infer<typeof AppointmentTypesResponseSchema>;

export const ContactFormSchema = z.object({

    email: z.string().email("Invalid email address"),
    fullName: z.string().min(2, "Full name is required"),
    gender: z.enum(["Male", "Female", "Other"]),
});

export type ContactFormData = z.infer<typeof ContactFormSchema>;
