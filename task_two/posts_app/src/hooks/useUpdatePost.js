import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePost } from "../api/posts";

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, values }) => {
      // Posts we created ourselves (id 101+) don't exist on the fake server
      if (id > 100) return { id, ...values };

      const updated = await updatePost(id, values);
      return { ...updated, id };
    },
    onSuccess: (updated) => {
      // Update the detail page cache
      queryClient.setQueryData(["post", String(updated.id)], (old) => ({
        ...old,
        ...updated,
      }));

      // Update the post inside every cached page of the list
      queryClient.setQueriesData({ queryKey: ["posts"] }, (old) => {
        if (!old) return old;
        return {
          ...old,
          posts: old.posts.map((post) =>
            post.id === updated.id ? { ...post, ...updated } : post
          ),
        };
      });
    },
  });
}