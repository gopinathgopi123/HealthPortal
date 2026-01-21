import { z } from "zod";

export const LabTestSchema = z.object({
    id: z.number(),
    code: z.string(),
    name: z.string(),
    aliases: z.array(z.string()).optional(),
    type: z.string(),
    category: z.string().optional(),
    gender: z.string().optional(),
    description: z.string().optional(),
    is_active: z.boolean(),
    created_at: z.string(),
    updated_at: z.string(),
});

export const LabTestsResponseSchema = z.array(LabTestSchema);

export type LabTest = z.infer<typeof LabTestSchema>;
