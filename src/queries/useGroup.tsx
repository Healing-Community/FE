import groupApiRequest from "@/apiRequests/group";
import {
  ApproveOrRejectRequestGroupResType,
  AssignRoleRequestType,
  CreateGroupRequestType,
  CrequestGroupRequestType,
  JoinGroupRequestType,
  LeaveGroupRequestType,
} from "@/schemaValidations/group.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetAllGroupsQuery = () => {
  return useQuery({
    queryKey: ["get-all-groups"],
    queryFn: groupApiRequest.getAllGroups,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

export const useGetGroupsByUserIdQuery = (userId: string) => {
  return useQuery({
    queryKey: ["get-groups-by-user-id", userId],
    queryFn: () => groupApiRequest.getGroupsJoinedByUserId(userId),
    enabled: !!userId,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
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

export const useJoinGroupMutation = ({
  userId,
  groupId,
}: {
  userId?: string;
  groupId?: string;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: JoinGroupRequestType) =>
      groupApiRequest.joinGroup(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-all-groups"] });
      queryClient.invalidateQueries({ queryKey: ["get-groups-by-user-id"] });
      queryClient.invalidateQueries({ queryKey: ["get-group-info", userId] });
      queryClient.invalidateQueries({
        queryKey: ["get-group-details-by-group-id", groupId],
      });
    },
    onError: (error) => {
      console.error("Lỗi khi tham gia nhóm:", error);
    },
  });
};

export const useLeaveGroupByGroupIdMutation = ({
  userId,
  groupId,
}: {
  userId?: string;
  groupId?: string;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: LeaveGroupRequestType) =>
      groupApiRequest.leaveGroupByGroupId(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-all-groups"] });
      queryClient.invalidateQueries({ queryKey: ["get-groups-by-user-id"] });
      queryClient.invalidateQueries({ queryKey: ["get-group-info", userId] });
      queryClient.invalidateQueries({
        queryKey: ["get-group-details-by-group-id", groupId],
      });
    },
    onError: (error) => {
      console.error("Lỗi khi rời nhóm:", error);
    },
  });
};

export const useUpdateGroupMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupId,
      payload,
    }: {
      groupId: string;
      payload: CreateGroupRequestType;
    }) => groupApiRequest.updateGroup(groupId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-all-groups"] });
      queryClient.invalidateQueries({ queryKey: ["get-groups-by-user-id"] });
    },
  });
};

export const useGetGroupDetailsByGroupIdQuery = ({
  groupId,
  enabled,
}: {
  groupId: string;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: ["get-group-details-by-group-id", groupId],
    queryFn: () => groupApiRequest.getGroupDetailsByGroupId(groupId),
    enabled: enabled,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

export const useGetGroupMembersByGroupIdQuery = (groupId: string) => {
  return useQuery({
    queryKey: ["get-group-members-by-group-id", groupId],
    queryFn: () => groupApiRequest.getGroupMemberByGroupId(groupId),
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

export const useGetRoleCountByGroupIdQuery = (groupId: string) => {
  return useQuery({
    queryKey: ["get-role-count-by-group-id", groupId],
    queryFn: () => groupApiRequest.getRoleCountByGroupId(groupId),
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

export const useGetListRequestGroupQuery = () => {
  return useQuery({
    queryKey: ["get-list-request-group"],
    queryFn: groupApiRequest.getApprovalRequestsCreateGroup,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

export const useGetListRequestedGroupByUserIdQuery = (userId: string) => {
  return useQuery({
    queryKey: ["get-list-request-group-by-user-id", userId],
    queryFn: () => groupApiRequest.getRequestsCreateGroupByUserId(userId),
    enabled: !!userId,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

export const useCrequestGroupMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CrequestGroupRequestType) =>
      groupApiRequest.crequestGroup(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-list-request-group"] });
      queryClient.invalidateQueries({
        queryKey: ["get-list-request-group-by-user-id"],
      });
    },
  });
};

export const useApproveOrRejectRequestGroupMutation = (groupId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ApproveOrRejectRequestGroupResType) =>
      groupApiRequest.approveOrRejectRequestGroup(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-list-request-group"] });
      queryClient.invalidateQueries({ queryKey: ["get-all-groups"] });
      queryClient.invalidateQueries({
        queryKey: ["get-list-request-group-by-user-id"],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-group-details-by-group-id", groupId],
      });
    },
  });
};

export const useGetRequestJoinGroupQuery = (groupId: string) => {
  return useQuery({
    queryKey: ["get-request-join-group", groupId],
    queryFn: () => groupApiRequest.getRequestJoinGroup(groupId),
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

export const useApproveOrRejectRequestJoinGroupMutation = (groupId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: groupApiRequest.approveOrRejectRequestJoinGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-request-join-group", groupId],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-all-groups", groupId],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-group-details-by-group-id", groupId],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-group-members-by-group-id", groupId],
      });
    },
  });
};

export const useCheckRoleInGroupQuery = (userId: string, groupId: string) => {
  return useQuery({
    queryKey: ["check-role-in-group", userId, groupId],
    queryFn: () => groupApiRequest.checkRoleInGroup(userId, groupId),
  });
};

export const useGetGroupInfoQuery = ({
  userId,
  enabled,
}: {
  userId: string;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: ["get-group-info", userId],
    queryFn: () => groupApiRequest.getGroupInfo(userId),
    enabled: enabled,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

export const useGetRecommendGroupQuery = () => {
  return useQuery({
    queryKey: ["get-recommend-group"],
    queryFn: groupApiRequest.getRecommendGroup,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

export const useAssignRoleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AssignRoleRequestType) =>
      groupApiRequest.assignRole(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-group-members-by-group-id"],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-role-count-by-group-id"],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-groups-by-user-id"],
      });
    },
  });
};

export const useRemoveMemberMutation = (groupId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: groupApiRequest.removeMemberQuery,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-group-details-by-group-id", groupId],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-role-count-by-group-id", groupId],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-all-groups"],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-group-members-by-group-id"],
      });
    },
  });
};
