import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPost } from "../api/posts";
import { useUpdatePost } from "../hooks/useUpdatePost";
import PostForm from "../components/postForm";

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const updateMutation = useUpdatePost();

  const { data: post, isLoading, isError, error } = useQuery({
    queryKey: ["post", id],
    queryFn: () => getPost(id),
  });

  function handleSubmit(values) {
    updateMutation.mutate(
      { id: Number(id), values },
      { onSuccess: () => navigate(`/posts/${id}`) }
    );
  }

  if (isLoading) return <p className="message">Loading post...</p>;
  if (isError) {
    return (
      <div>
        <Link to="/" className="back-link">← Back to posts</Link>
        <p className="message error">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <Link to={`/posts/${id}`} className="back-link">← Back to post</Link>
      <h1>Edit post</h1>
      <PostForm
        initialValues={{ title: post.title, body: post.body }}
        submitLabel="Save changes"
        loading={updateMutation.isPending}
        error={updateMutation.isError ? updateMutation.error.message : ""}
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/posts/${id}`)}
      />
    </div>
  );
}

export default EditPost;