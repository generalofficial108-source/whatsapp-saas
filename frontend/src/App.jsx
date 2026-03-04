import { Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import Dashboard from "./pages/Dashboard";
import Conversations from "./pages/Conversations";
import Templates from "./pages/Templates";
import Broadcast from "./pages/Broadcast";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="conversations" element={<Conversations />} />
        <Route path="templates" element={<Templates />} />
        <Route path="broadcast" element={<Broadcast />} />
      </Route>
    </Routes>
  );
}

export default App;