import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "../api/posts";

// The API always answers with id 101, so we hand out our own unique ids
let nextId = 101;

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values) => {
      const created = await createPost(values);
      return { ...created, id: nextId++ };
    },
    onSuccess: (newPost) => {
      // Show the new post at the top of page 1
      queryClient.setQueryData(["posts", 1], (old) => {
        if (!old) return old;
        return { ...old, posts: [newPost, ...old.posts] };
      });

      // Save it as its own detail page so /posts/<id> works
      queryClient.setQueryData(["post", String(newPost.id)], newPost);
    },
  });
}