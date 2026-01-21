import { apiRequest } from "@/lib/queryClient";

export interface Customer {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
}

export const fetchCustomers = async (): Promise<Customer[]> => {
    try {
        const res = await apiRequest("GET", "/users/?group=customer");

        if (!res.ok) {
            throw new Error("Failed to fetch customers");
        }

        const data = await res.json();
        console.log("Raw customers response:", data);

        // Handle various response structures
        let customers: Customer[] = [];

        // Check for {success: true, data: {users: [...]}} structure (actual API format)
        if (data?.success && data?.data?.users && Array.isArray(data.data.users)) {
            customers = data.data.users;
        }
        // Check for {data: {users: [...]}} structure
        else if (data?.data?.users && Array.isArray(data.data.users)) {
            customers = data.data.users;
        }
        // Check for direct array
        else if (Array.isArray(data)) {
            customers = data;
        }
        // Check for {results: [...]} structure (pagination)
        else if (data?.results && Array.isArray(data.results)) {
            customers = data.results;
        }
        // Check for {data: [...]} structure
        else if (data?.data && Array.isArray(data.data)) {
            customers = data.data;
        }
        else {
            console.warn("Unexpected customers API response format:", data);
            customers = [];
        }

        console.log("Parsed customers:", customers);
        return customers;
    } catch (error) {
        console.error("Error fetching customers:", error);
        return [];
    }
};
