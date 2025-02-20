import http from "@/lib/http";
import {
  BookExpertScheduleReqType,
  BookExpertScheduleResType,
  CreatePaymentRequestType,
  CreatePaymentResponseType,
  GetFeeServiceResType,
  GetManagerPaymentForModeratorResType,
  GetManagerPaymentForUserAndExpertListResType,
  GetRevenueStatisticsForAdminResponseType,
  GetRevenueStatisticsResponseType,
  GetTotalRevenueForAdminRequestSchemaType,
  GetTotalRevenueForAdminResType,
  GetTotalRevenueForExpertRequestSchemaType,
  GetTotalRevenueForExpertResType,
  PaymentHistoryDetailsResType,
  PaymentHistoryListResType,
  UpdateFeeServiceType,
} from "@/schemaValidations/payment.schema";

const paymentApiRequest = {
  listPaymentHistory: () =>
    http.get<PaymentHistoryListResType>("payment/api/payment/history"),

  bookExpertSchedule: (requestBody: BookExpertScheduleReqType) =>
    http.post<BookExpertScheduleResType>(
      "expert/api/appointment/book",
      requestBody
    ),

  createPayment: (payload: CreatePaymentRequestType) =>
    http.post<CreatePaymentResponseType>("payment/api/payment/create", payload),
  getPaymentHistoryDetails: (paymentId: string) =>
    http.get<PaymentHistoryDetailsResType>(
      `payment/api/payment/details/${paymentId}`
    ),
  getFeeService: () =>
    http.get<GetFeeServiceResType>("payment/api/platformfee/get-fees"),
  updateFeeService: (body: UpdateFeeServiceType) =>
    http.put<{ message: string }>("payment/api/platformfee/update-fee", body),
  getPaymentHistoryForModerator: () =>
    http.get<GetManagerPaymentForModeratorResType>(
      "payment/api/payment/manager-payment-moderator"
    ),
  getPaymentHistoryForUser: () =>
    http.get<GetManagerPaymentForUserAndExpertListResType>(
      "payment/api/payment/get-payments-manager-user"
    ),
  getPaymentHistoryForExpert: () =>
    http.get<GetManagerPaymentForUserAndExpertListResType>(
      "payment/api/payment/get-payments-manager-expert"
    ),
  getTotalRevenueForExpert: () =>
    http.get<GetTotalRevenueForExpertResType>(
      "payment/api/payment/total-revenue-expert"
    ),

  getRevenueDetailsForExpert: (
    filterType: GetTotalRevenueForExpertRequestSchemaType
  ) =>
    http.get<GetRevenueStatisticsResponseType>(
      `payment/api/payment/revenue-details-experts?filterType=${filterType.filterType}`
    ),

  getTotalRevenueForAdmin: () =>
    http.get<GetTotalRevenueForAdminResType>(
      "payment/api/payment/total-revenue-admin"
    ),

  getRevenueDetailsForAdmin: (
    filterType: GetTotalRevenueForAdminRequestSchemaType
  ) =>
    http.get<GetRevenueStatisticsForAdminResponseType>(
      `payment/api/payment/revenue-statistics-admin?filterType=${filterType.filterType}`
    ),
};
export default paymentApiRequest;
