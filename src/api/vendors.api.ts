import { apiRequest } from "@/lib/queryClient";

export interface VendorConfig {
    partner_id: string;
    client_type: string;
    entity_type: string;
    user_agent: string;
}

export interface Vendor {
    id: number;
    name: string;
    code: string;
    api_base_url: string;
    api_key: string | null;
    api_username: string;
    api_password: string;
    config: VendorConfig;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export const fetchVendors = async (): Promise<Vendor[]> => {
    const res = await apiRequest("GET", "/vendors/");

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.detail || error.message || "Failed to fetch vendors");
    }

    return res.json();
};
