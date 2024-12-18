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

const GroupJoinedByUserIdSchema = z.object({
  groupId: z.string(),
  groupName: z.string(),
  groupAvatar: z.string().nullable(),
  joinedAt: z.string(),
  roleInGroup: z.enum(["User", "Admin", "Moderator"]),
});

export type GroupJoinedByUserIdType = z.infer<typeof GroupJoinedByUserIdSchema>;

const GetAllGroupsJoinedByUserIdResponseSchema = z.object({
  id: z.string(),
  statusCode: z.number(),
  message: z.string(),
  success: z.boolean(),
  data: z.array(GroupJoinedByUserIdSchema),
  errors: z.array(z.string()),
  timestamp: z.string(),
});

export type GetAllGroupsJoinedByUserIdResponseType = z.infer<
  typeof GetAllGroupsJoinedByUserIdResponseSchema
>;

const CreateGroupRequestSchema = z.object({
  groupName: z.string(),
  description: z.string(),
  avatarGroup: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  isAutoApprove: z.boolean(),
  groupVisibility: z.number(),
  memberLimit: z.number(),
});

export type CreateGroupRequestType = z.infer<typeof CreateGroupRequestSchema>;

const JoinGroupRequestSchema = z.object({
  groupId: z.string(),
});

export type JoinGroupRequestType = z.infer<typeof JoinGroupRequestSchema>;

const LeaveGroupRequestSchema = z.object({
  groupId: z.string(),
});

export type LeaveGroupRequestType = z.infer<typeof LeaveGroupRequestSchema>;




