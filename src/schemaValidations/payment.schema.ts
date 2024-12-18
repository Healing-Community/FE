import { z } from "zod";

export const PaymentHistorySchema = z.object({
  paymentId: z.string(),
  userId: z.string(),
  appointmentId: z.string(), //id cuộc hẹn
  orderCode: z.number(),
  amount: z.number(),
  status: z.number(),
  paymentDate: z.string(),
  updatedAt: z.string(),
});

export type PaymentHistoryType = z.infer<typeof PaymentHistorySchema>;

export const PaymentHistoryListRes = z.object({
  data: z.array(PaymentHistorySchema),
  message: z.string(),
});

export type PaymentHistoryListResType = z.infer<typeof PaymentHistoryListRes>;

export const CreatePaymentRequestSchema = z.object({
  appointmentId: z.string(),
  amount: z.number().min(1),
  description: z.string().nonempty(),
  returnUrl: z.string().url(),
  cancelUrl: z.string().url(),
});

export type CreatePaymentRequestType = z.infer<
  typeof CreatePaymentRequestSchema
>;

export const CreatePaymentResponseSchema = z.object({
  id: z.string(),
  statusCode: z.number(),
  message: z.string(),
  success: z.boolean(),
  data: z.string().url(),
  errors: z.array(z.string()).optional(),
  timestamp: z.string(),
});

export type CreatePaymentResponseType = z.infer<
  typeof CreatePaymentResponseSchema
>;

export const BookExpertScheduleReq = z.object({
  expertAvailabilityId: z.string(),
});

export type BookExpertScheduleReqType = z.infer<typeof BookExpertScheduleReq>;

export const BookExpertScheduleRes = z.object({
  id: z.string(),
  statusCode: z.number(),
  message: z.string(),
  success: z.boolean(),
  data: z.string(),
  errors: z.array(z.string()),
  timestamp: z.string(),
});

export type BookExpertScheduleResType = z.infer<typeof BookExpertScheduleRes>;
