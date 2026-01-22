import { apiRequest } from "@/lib/queryClient";

export interface BookingPayload {
    vendor_id: number;
    test_id: string;
    slot_id: string;
    patient_name: string;
    patient_gender: "MALE" | "FEMALE" | "OTHER";
    patient_age: string;
    patient_contact: string;
    patient_email: string;
    patient_height: number;
    patient_weight: number;
    height_unit: string;
    weight_unit: string;
    street: string;
    address_line1: string;
    address_line2: string;
    landmark: string;
    city: string;
    state: string;
    pincode: string;
    contact_number: string;
    email: string;
    gender?: string;
    appointment_date: string;
    appointment_time: string;
    payment_type: "PREPAID" | "POSTPAID";
}

export interface BookingResponse {
    success: boolean;
    message: string;
    order_id?: string;
    data?: any;
}

export const bookLabTest = async (payload: BookingPayload): Promise<BookingResponse> => {
    // URL: {{base_url}}/labs/api/orders/book
    // The apiConfig will see '/orders/' and route to /labs/api/orders/book
    const res = await apiRequest("POST", "/orders/book", payload);

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.detail || error.message || "Failed to book lab test");
    }

    return res.json();
};
