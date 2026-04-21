import { Outlet } from "react-router";
import AdminSidebar from "./AdminSidebar";
import AdminRoute from "./AdminRoute";

export default function AdminLayout() {
  return (
    <AdminRoute>
      <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-slate-50">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </AdminRoute>
  );
}
