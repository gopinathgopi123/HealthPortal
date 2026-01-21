import { apiRequest } from "@/lib/queryClient";
import { LabTestsResponseSchema } from "@/schemas/labs.schema";

export const fetchLabTests = async (): Promise<any> => {
    // The endpoint starts with /tests/ which apiConfig recognizes as a LABS endpoint
    const res = await apiRequest("GET", "/tests/");

    if (!res.ok) {
        throw new Error("Failed to fetch lab tests");
    }

    const data = await res.json();
    return LabTestsResponseSchema.parse(data);
};
