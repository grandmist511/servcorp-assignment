import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost } from "../api/posts";

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deletePost(id),
    onSuccess: (id) => {
      // Remove the post from every cached page of the list
      queryClient.setQueriesData({ queryKey: ["posts"] }, (old) => {
        if (!old) return old;
        return {
          ...old,
          posts: old.posts.filter((post) => post.id !== id),
          total: old.total - 1,
        };
      });

      // Remove the cached detail page for that post
      queryClient.removeQueries({ queryKey: ["post", String(id)] });
    },
  });
}