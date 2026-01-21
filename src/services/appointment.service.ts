// import {
//     useQuery,
//     useMutation,
//     useQueryClient,
// } from "@tanstack/react-query";
// import {
//     fetchAppointmentTypes,
//     fetchAppointmentTypeById,
//     createAppointmentType,
//     updateAppointmentType,
//     deleteAppointmentType,
// } from "@/api/appointment.api";
// import { appointmentKeys } from "@/queries/appointment.keys";
// import { AppointmentType, AppointmentTypesResponse } from "@/schemas/appointment.schema";

// interface UseAppointmentListOptions {
//     page: number;
//     pageSize: number;
//     search?: string;
//     enabled?: boolean;
// }

// interface UseAppointmentDetailOptions {
//     id: string | number;
//     enabled?: boolean;
// }

// export const useAppointment = () => {
//     const queryClient = useQueryClient();

//     // 🔹 Fetch appointment types list
//     const useAppointmentTypes = ({
//         page,
//         pageSize,
//         search = "",
//         enabled = true,
//     }: UseAppointmentListOptions) => {
//         return useQuery<AppointmentTypesResponse>({
//             queryKey: appointmentKeys.list(page, pageSize, search),
//             queryFn: () => fetchAppointmentTypes(page, pageSize, search),
//             staleTime: 1000 * 60 * 5,
//             enabled,
//         });
//     };

//     // 🔹 Fetch single appointment type
//     const useAppointmentTypeDetail = ({ id, enabled = true }: UseAppointmentDetailOptions) => {
//         return useQuery<AppointmentType>({
//             queryKey: appointmentKeys.detail(id),
//             queryFn: () => fetchAppointmentTypeById(id),
//             staleTime: 1000 * 60 * 5,
//             enabled: enabled && !!id,
//         });
//     };

//     // 🔹 Create mutation
//     const createMutation = useMutation({
//         mutationFn: createAppointmentType,
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
//         },
//     });

//     // 🔹 Update mutation
//     const updateMutation = useMutation({
//         mutationFn: ({ id, payload }: { id: string | number; payload: any }) =>
//             updateAppointmentType(id, payload),
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
//         },
//     });

//     // 🔹 Delete mutation
//     const deleteMutation = useMutation({
//         mutationFn: deleteAppointmentType,
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
//         },
//     });

//     return {
//         useAppointmentTypes,
//         useAppointmentTypeDetail,
//         createAppointmentType: createMutation.mutate,
//         updateAppointmentType: updateMutation.mutate,
//         deleteAppointmentType: deleteMutation.mutate,
//         isCreating: createMutation.isPending,
//         isUpdating: updateMutation.isPending,
//         isDeleting: deleteMutation.isPending,
//     };
// };
