import { apiRequest } from "@/lib/queryClient";

export interface AvailabilityParams {
    pincode: string;
    test_id: string | number;
    date: string;
    gender: string;
}

export const checkAvailability = async (params: AvailabilityParams): Promise<any> => {
    // URL: {{base_url}}/api/availability/check
    // The apiConfig will see '/availability/' and route to /labs/api/availability/check
    const queryParams = new URLSearchParams({
        pincode: params.pincode,
        test_id: params.test_id.toString(),
        date: params.date,
        gender: params.gender,
    });

    const res = await apiRequest("GET", `/availability/check?${queryParams.toString()}`);
    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.detail || error.message || "Failed to check availability");
    }
    return res.json();
};
