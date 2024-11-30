import { z } from "zod";

const GroupSchema = z.object({
  groupId: z.string(),
  groupName: z.string(),
  description: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  createdByUserId: z.string(),
  avatarGroup: z.string().nullable(),
  isAutoApprove: z.boolean(),
  groupVisibility: z.number(),
  memberLimit: z.number(),
  currentMemberCount: z.number(),
});

export type GroupType = z.infer<typeof GroupSchema>;

const GetAllGroupsResponseSchema = z.object({
  id: z.string(),
  statusCode: z.number(),
  message: z.string(),
  success: z.boolean(),
  data: z.array(GroupSchema),
  errors: z.array(z.string()),
  timestamp: z.string(),
});

export type GetAllGroupsResponseType = z.infer<
  typeof GetAllGroupsResponseSchema
>;
