import { useQuery } from "@tanstack/react-query";
import { fetchLabTests } from "@/api/labs.api";
import { labsKeys } from "@/queries/labs.keys";
import { LabTest } from "@/schemas/labs.schema";

export const useLabTests = () => {
    return useQuery<LabTest[]>({
        queryKey: labsKeys.tests(),
        queryFn: fetchLabTests,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};
