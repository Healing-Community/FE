import paymentApiRequest from "@/apiRequests/payment";
import {
  CreatePaymentRequestType,
  GetTotalRevenueForAdminRequestSchemaType,
  GetTotalRevenueForExpertRequestSchemaType,
} from "@/schemaValidations/payment.schema";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePaymentHistoryQuery = () => {
  return useQuery({
    queryKey: ["payment-history-list"],
    queryFn: paymentApiRequest.listPaymentHistory,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

export const useBookExpertScheduleMutation = () => {
  return useMutation({
    mutationFn: paymentApiRequest.bookExpertSchedule,
  });
};

export const useCreatePaymentMutation = () => {
  return useMutation({
    mutationFn: (payload: CreatePaymentRequestType) =>
      paymentApiRequest.createPayment(payload),
  });
};

export const usePaymentHistoryDetailsQuery = ({
  paymentId,
  enabled,
}: {
  paymentId: string;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["payment-history-details", paymentId],
    queryFn: () => paymentApiRequest.getPaymentHistoryDetails(paymentId),
    enabled,
  });
};

export const useGetFeeServiceQuery = () => {
  return useQuery({
    queryKey: ["fee-service"],
    queryFn: paymentApiRequest.getFeeService,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

export const useUpdateFeeServiceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: paymentApiRequest.updateFeeService,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fee-service"],
      });
    },
  });
};

export const usePaymentHistoryForModeratorQuery = () => {
  return useQuery({
    queryKey: ["payment-history-moderator"],
    queryFn: paymentApiRequest.getPaymentHistoryForModerator,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

export const usePaymentHistoryForUserQuery = ({
  enabled,
}: {
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["payment-history-user"],
    queryFn: paymentApiRequest.getPaymentHistoryForUser,
    enabled,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

export const usePaymentHistoryForExpertQuery = ({
  enabled,
}: {
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["payment-history-expert"],
    queryFn: paymentApiRequest.getPaymentHistoryForExpert,
    enabled,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

export const useGetTotalRevenueForExpert = () => {
  return useQuery({
    queryKey: ["totalRevenueForExpert"],
    queryFn: paymentApiRequest.getTotalRevenueForExpert,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

export const useGetRevenueDetailsForExpertQuery = (
  filterType: GetTotalRevenueForExpertRequestSchemaType
) => {
  return useQuery({
    queryKey: ["revenue-details-expert", filterType],
    queryFn: () => paymentApiRequest.getRevenueDetailsForExpert(filterType),
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

export const useGetTotalRevenueForAdmin = () => {
  return useQuery({
    queryKey: ["totalRevenueForAdmin"],
    queryFn: paymentApiRequest.getTotalRevenueForAdmin,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

export const useGetRevenueDetailsForAdminQuery = (
  filterType: GetTotalRevenueForAdminRequestSchemaType
) => {
  return useQuery({
    queryKey: ["revenue-details-admin", filterType],
    queryFn: () => paymentApiRequest.getRevenueDetailsForAdmin(filterType),
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};
