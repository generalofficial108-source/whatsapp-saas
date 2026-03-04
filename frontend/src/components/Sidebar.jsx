import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <div style={{ width: "220px", borderRight: "1px solid #ddd" }}>
      <NavLink to="/">Dashboard</NavLink>
      <br />
      <NavLink to="/conversations">Conversations</NavLink>
      <br />
      <NavLink to="/templates">Templates</NavLink>
      <br />
      <NavLink to="/broadcast">Broadcast</NavLink>
    </div>
  );
}

export default Sidebar;