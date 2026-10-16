import { Routes, Route } from "react-router-dom";
import Posts from "./pages/posts";
import PostDetail from "./pages/postdetails";
import NewPost from "./pages/newPost";
import EditPost from "./pages/editPost";

function App() {
  return (
    <main className="container">
      <Routes>
        <Route path="/" element={<Posts />} />
        <Route path="/posts/new" element={<NewPost />} />
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route path="/posts/:id/edit" element={<EditPost />} />
      </Routes>
    </main>
  );
}

export default App;