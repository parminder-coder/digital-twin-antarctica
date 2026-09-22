import { Outlet } from "react-router";
import Sidebar from "../components/sidebar/Sidebar";
import "./dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main-content">
        <Outlet />
      </main>
    </div>
  );
}
