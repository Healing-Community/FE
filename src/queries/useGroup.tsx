import groupApiRequest from "@/apiRequests/group";
import {
  CreateGroupRequestType,
  JoinGroupRequestType,
  LeaveGroupRequestType,
} from "@/schemaValidations/group.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetAllGroupsQuery = () => {
  return useQuery({
    queryKey: ["get-all-groups"],
    queryFn: groupApiRequest.getAllGroups,
  });
};

export const useGetGroupsByUserIdQuery = (userId: string) => {
  return useQuery({
    queryKey: ["get-groups-by-user-id", userId],
    queryFn: () => groupApiRequest.getGroupsJoinedByUserId(userId),
    enabled: !!userId,
  });
};

export const useCreateGroupMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateGroupRequestType) =>
      groupApiRequest.createGroup(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-all-groups"] });
    },
    onError: (error) => {
      console.error("Failed to create group:", error);
    },
  });
};

export const useDeleteGroupByGroupIdMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: groupApiRequest.deleteGroupByGroupId,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-all-groups"],
      });
    },
  });
};

export const useJoinGroupMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: JoinGroupRequestType) =>
      groupApiRequest.joinGroup(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-all-groups"] });
      queryClient.invalidateQueries({ queryKey: ["get-groups-by-user-id"] });
    },
    onError: (error) => {
      console.error("Lỗi khi tham gia nhóm:", error);
    },
  });
};

export const useLeaveGroupByGroupIdMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: LeaveGroupRequestType) =>
      groupApiRequest.leaveGroupByGroupId(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-all-groups"] });
      queryClient.invalidateQueries({ queryKey: ["get-groups-by-user-id"] });
    },
    onError: (error) => {
      console.error("Lỗi khi rời nhóm:", error);
    },
  });
};
