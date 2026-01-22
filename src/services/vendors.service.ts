import { useQuery } from "@tanstack/react-query";
import { fetchVendors } from "@/api/vendors.api";

export const VENDORS_QUERY_KEY = "vendors";

export const useVendors = () => {
    return useQuery({
        queryKey: [VENDORS_QUERY_KEY],
        queryFn: fetchVendors,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};
