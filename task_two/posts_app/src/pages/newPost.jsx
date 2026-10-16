import { Link, useNavigate } from "react-router-dom";
import { useCreatePost } from "../hooks/useCreatePost";
import PostForm from "../components/postForm";

function NewPost() {
  const navigate = useNavigate();
  const createMutation = useCreatePost();

  function handleSubmit(values) {
    createMutation.mutate(values, {
      onSuccess: (newPost) => navigate(`/posts/${newPost.id}`),
    });
  }

  return (
    <div>
      <Link to="/" className="back-link">← Back to posts</Link>
      <h1>New post</h1>
      <PostForm
        submitLabel="Create post"
        loading={createMutation.isPending}
        error={createMutation.isError ? createMutation.error.message : ""}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/")}
      />
    </div>
  );
}

export default NewPost;