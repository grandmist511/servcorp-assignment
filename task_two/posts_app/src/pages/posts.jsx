import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { getPosts } from "../api/posts";
import { useDeletePost } from "../hooks/useDeletePost";
import Pagination from "../components/pagination";
import ConfirmDialog from "../components/confirmDialog";

const PAGE_SIZE = 10;

function Posts() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  const [postToDelete, setPostToDelete] = useState(null);
  const deleteMutation = useDeletePost();

  const { data, isLoading, isError, error, isFetching, isPlaceholderData } =
    useQuery({
      queryKey: ["posts", page],
      queryFn: () => getPosts(page, PAGE_SIZE),
      placeholderData: keepPreviousData,
    });

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 1;

  // Prefetch the next page in the background
  useEffect(() => {
    if (data && page < totalPages) {
      queryClient.prefetchQuery({
        queryKey: ["posts", page + 1],
        queryFn: () => getPosts(page + 1, PAGE_SIZE),
      });
    }
  }, [data, page, totalPages, queryClient]);

  function handlePageChange(newPage) {
    setSearchParams({ page: newPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleConfirmDelete() {
    deleteMutation.mutate(postToDelete.id, {
      onSuccess: () => setPostToDelete(null),
    });
  }

  function handleCancelDelete() {
    deleteMutation.reset();
    setPostToDelete(null);
  }

  if (isLoading) return <p className="message">Loading posts...</p>;
  if (isError) return <p className="message error">Error: {error.message}</p>;

  return (
    <div>
      <div className="page-header">
        <h1>Posts</h1>
        <Link to="/posts/new" className="btn btn-primary">
          + New post
        </Link>
      </div>

      <ul className={`post-list ${isPlaceholderData ? "dimmed" : ""}`}>
        {data.posts.map((post) => (
          <li key={post.id} className="post-card">
            <Link to={`/posts/${post.id}`} className="post-link">
              <h2>{post.title}</h2>
              <p>{post.body}</p>
            </Link>
            <div className="card-actions">
              <Link to={`/posts/${post.id}/edit`} className="btn btn-small">
                Edit
              </Link>
              <button
                className="btn btn-danger btn-small"
                onClick={() => setPostToDelete(post)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {isFetching && <p className="message small">Updating...</p>}

      <ConfirmDialog
        open={postToDelete !== null}
        title="Delete this post?"
        message="This action cannot be undone."
        loading={deleteMutation.isPending}
        error={deleteMutation.isError ? deleteMutation.error.message : ""}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}

export default Posts;
