import postApiRequest from "@/apiRequests/post";
import {
  AddReactionBodyType,
  GetHomePageSchemaLazyLoadType,
  UpdatePersonalPostBodyType,
} from "@/schemaValidations/post.schema";
import { usePostStore } from "@/store/postStore";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useGetAllCategoryQuery = () => {
  return useQuery({
    queryKey: ["category-list"],
    queryFn: () => postApiRequest.getAllCategory(),
  });
};

export const useUploadAvatarCoverFromFileMutation = () => {
  return useMutation({
    mutationFn: postApiRequest.uploadAvatarCoverFromFile,
  });
};

export const useCreatePostMutation = () => {
  return useMutation({
    mutationFn: postApiRequest.createPost,
  });
};

export const useGetPostByPostIdQuery = ({
  postId,
  enabled,
}: {
  postId: string;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["post-by-post-id", postId],
    queryFn: () => postApiRequest.getPostByPostId(postId),
    enabled,
  });
};

export const useGetCommentsByPostIdQuery = (postId: string) => {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: () => postApiRequest.getCommentsByPostId(postId),
    enabled: !!postId,
  });
};

export const useCreateCommentMutation = () => {
  return useMutation({
    mutationFn: postApiRequest.createComment,
  });
};

export const useGetPostByUserIdQuery = (userId: string) => {
  return useQuery({
    queryKey: ["post-by-user-id", userId],
    queryFn: () => postApiRequest.getPostByUserId(userId),
  });
};

export const useDeletePostByPostIdMutation = (userId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postApiRequest.deletePostByPostId,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["post-by-user-id", userId],
      });
    },
  });
};

export const useGetQuickPostHomePageQuery = () => {
  return useQuery({
    queryKey: ["quick-post"],
    queryFn: () => postApiRequest.getQuickPostHomePage(),
  });
};

export const useAddUserReferenceMutation = () => {
  return useMutation({
    mutationFn: postApiRequest.addUserReference,
  });
};

export const useGetHomePageLazyLoadQuery = (pageSize: number) => {
  return useInfiniteQuery({
    queryKey: ["home-page-lazy-load"],
    queryFn: ({ pageParam = 1 }) =>
      postApiRequest.getHomePageLazyLoad(pageParam, pageSize),
    getNextPageParam: (lastPage, allPages) => {
      // Kiểm tra nếu còn dữ liệu thì trả về số trang tiếp theo
      const hasNextPage = lastPage.payload.data.length === pageSize;
      return hasNextPage ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1, // Giá trị khởi tạo của pageParam
  });
};

// export const useGetHomePageLazyLoadQuery = (
//   pageSize: number,
//   initialArticles?: GetHomePageSchemaLazyLoadType[]
// ) => {
//   return useInfiniteQuery({
//     queryKey: ["home-page-lazy-load"],
//     queryFn: ({ pageParam = 1 }) => {
//       return postApiRequest.getHomePageLazyLoad(pageParam, pageSize);
//     },
//     getNextPageParam: (lastPage, allPages) => {
//       const hasNextPage = lastPage.payload.data.length === pageSize;
//       return hasNextPage ? allPages.length + 1 : undefined;
//     },
//     initialData: initialArticles
//       ? {
//           pages: [
//             {
//               status: 200,
//               payload: {
//                 message: "Initial articles loaded",
//                 data: initialArticles.slice(0, pageSize),
//               },
//             },
//           ],
//           pageParams: [1],
//         }
//       : undefined,
//     initialPageParam: 1,
//   });
// };

export const useUpdatePersonalPostMutation = (userId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...body
    }: UpdatePersonalPostBodyType & { id: string }) =>
      postApiRequest.updatePersonalPost(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["post-by-user-id", userId],
        //exact: true => invalidate cache của 1 employee cụ thể
        exact: true,
      });
    },
  });
};

export const useDeleteCommentByCommnetIdMutation = (postId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postApiRequest.deleteCommentByCommentId,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", postId],
      });

      queryClient.invalidateQueries({
        queryKey: ["comment-count", postId],
      });
    },
  });
};

export const useGetReactionCountQuery = (postId: string) => {
  return useQuery({
    queryKey: ["reaction-count", postId],
    queryFn: () => postApiRequest.getReactionCount(postId),
  });
};

export const useAddReactionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: AddReactionBodyType) => postApiRequest.addReaction(body),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({
        queryKey: ["reaction-count", postId],
      });
    },
  });
};

export const useGetCommentCountQuery = (postId: string) => {
  return useQuery({
    queryKey: ["comment-count", postId],
    queryFn: () => postApiRequest.getCommentCount(postId),
  });
};

export const useGetUserReactionByPostIdQuery = (postId: string) => {
  return useQuery({
    queryKey: ["user-reaction-by-post-id", postId],
    queryFn: () => postApiRequest.getUserReactionByPostId(postId),
  });
};
