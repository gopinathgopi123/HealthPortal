import { useQuery } from "@tanstack/react-query";
import { fetchCustomers, Customer } from "@/api/users.api";

export const useCustomers = () => {
    return useQuery<Customer[]>({
        queryKey: ["users", "customers"],
        queryFn: fetchCustomers,
        staleTime: 1000 * 60 * 5,
    });
};
