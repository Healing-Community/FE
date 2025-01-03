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

export const GetGroupDetailsByGroupIdSchema = z.object({
  groupId: z.string(),
  groupName: z.string(),
  description: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  createdByUserId: z.string(),
  avatarGroup: z.string(),
  isAutoApprove: z.boolean(),
  groupVisibility: z.number(),
  memberLimit: z.number(),
  currentMemberCount: z.number(),
});

export type GetGroupDetailsByGroupIdType = z.infer<
  typeof GetGroupDetailsByGroupIdSchema
>;

export const GetGroupDetailsByGroupIdRes = z.object({
  data: GetGroupDetailsByGroupIdSchema,
  message: z.string(),
});

export type GetGroupDetailsByGroupIdResType = z.infer<
  typeof GetGroupDetailsByGroupIdRes
>;

export const GetGroupMembersByGroupIdSchema = z.object({
  userId: z.string(),
  groupName: z.string(),
  groupAvatar: z.string(),
  roleInGroup: z.enum(["User", "Owner", "Moderator"]),
  joinedAt: z.string(),
});

export type GetGroupMembersByGroupIdType = z.infer<
  typeof GetGroupMembersByGroupIdSchema
>;

export const GetGroupMembersByGroupIdListRes = z.object({
  data: z.array(GetGroupMembersByGroupIdSchema),
  message: z.string(),
});

export type GetGroupMembersByGroupIdListResType = z.infer<
  typeof GetGroupMembersByGroupIdListRes
>;

export const GetRoleCountByGroupIdSchema = z.object({
  totalUsers: z.number(),
  totalOwnersAndModerators: z.number(),
  totalMembers: z.number(),
});

export type GetRoleCountByGroupIdType = z.infer<
  typeof GetRoleCountByGroupIdSchema
>;

export const GetRoleCountByGroupIdRes = z.object({
  data: GetRoleCountByGroupIdSchema,
  message: z.string(),
});

export type GetRoleCountByGroupIdResType = z.infer<
  typeof GetRoleCountByGroupIdRes
>;
