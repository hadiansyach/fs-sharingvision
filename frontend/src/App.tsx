import { Routes, Route, Navigate } from "react-router-dom";
import AllPostsPage from "./pages/AllPostsPage";
import AddArticlePage from "./pages/AddArticlePage";
import PreviewPage from "./pages/PreviewPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/posts" replace />} />
      <Route path="/posts" element={<AllPostsPage />} />
      <Route path="/posts/new" element={<AddArticlePage />} />
      <Route path="/posts/:id/edit" element={<AddArticlePage />} />
      <Route path="/preview" element={<PreviewPage />} />
    </Routes>
  );
}

export default App;
