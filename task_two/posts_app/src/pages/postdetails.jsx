import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPost } from "../api/posts";
import { useDeletePost } from "../hooks/useDeletePost";
import ConfirmDialog from "../components/confirmDialog";

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const deleteMutation = useDeletePost();

  const {
    data: post,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["post", id],
    queryFn: () => getPost(id),
  });

  function handleConfirmDelete() {
    deleteMutation.mutate(Number(id), {
      onSuccess: () => navigate("/"),
    });
  }

  function handleCancelDelete() {
    deleteMutation.reset();
    setShowConfirm(false);
  }

  if (isLoading) return <p className="message">Loading post...</p>;
  if (isError) {
    return (
      <div>
        <Link to="/" className="back-link">
          ← Back to posts
        </Link>
        <p className="message error">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <article className="post-detail">
      <Link to="/" className="back-link">
        ← Back to posts
      </Link>
      <h1>{post.title}</h1>
      <p>{post.body}</p>

      <div className="card-actions">
        <Link to={`/posts/${id}/edit`} className="btn">
          Edit
        </Link>
        <button className="btn btn-danger" onClick={() => setShowConfirm(true)}>
          Delete
        </button>
      </div>

      <ConfirmDialog
        open={showConfirm}
        title="Delete this post?"
        message="This action cannot be undone."
        loading={deleteMutation.isPending}
        error={deleteMutation.isError ? deleteMutation.error.message : ""}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </article>
  );
}

export default PostDetail;
