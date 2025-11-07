import { Outlet } from "react-router-dom";
import Navbar from "@/components/NavBar";
import { AppSidebar } from "@/components/SideBar";

export default function AuthLayout() {
  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <AppSidebar />

      {/* Main content area */}
      <div className="flex-1 overflow-x-auto flex flex-col">
        {/* Top Navbar */}
        <Navbar /> {/* SidebarTrigger is already inside Navbar */}
        {/* Page content */}
        <main className="flex-1 p-4 overflow-auto">
          <Outlet /> {/* Protected pages render here */}
        </main>
      </div>
    </div>
  );
}
