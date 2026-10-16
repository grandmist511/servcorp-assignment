const BASE_URL = "https://jsonplaceholder.typicode.com";

// Small helper: calls the API and throws an error if something goes wrong
async function request(path, options) {
  const response = await fetch(`${BASE_URL}${path}`, options);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response;
}

// READ: get one page of posts
export async function getPosts(page = 1, limit = 10) {
  const response = await request(`/posts?_page=${page}&_limit=${limit}`);
  const posts = await response.json();
  // JSONPlaceholder tells us the total number of posts in this header
  const total = Number(response.headers.get("x-total-count"));
  return { posts, total };
}

// READ: get a single post by its id
export async function getPost(id) {
  const response = await request(`/posts/${id}`);
  return response.json();
}

// DELETE: remove a post (the fake API pretends to succeed)
export async function deletePost(id) {
  await request(`/posts/${id}`, { method: "DELETE" });
  return id;
}

// CREATE: add a new post (the fake API pretends to save it)
export async function createPost(values) {
  const response = await request("/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=UTF-8" },
    body: JSON.stringify({ ...values, userId: 1 }),
  });
  return response.json();
}

// UPDATE: replace a post's title and body (the fake API pretends to save it)
export async function updatePost(id, values) {
  const response = await request(`/posts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json; charset=UTF-8" },
    body: JSON.stringify({ id, ...values, userId: 1 }),
  });
  return response.json();
}