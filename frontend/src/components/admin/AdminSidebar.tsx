import { NavLink } from "react-router";
import { LayoutDashboard, Users, BookOpen, Calendar, ShieldCheck } from "lucide-react";

export default function AdminSidebar() {
  const links = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Mentors", href: "/admin/mentors", icon: ShieldCheck },
    { name: "Subjects", href: "/admin/subjects", icon: BookOpen },
    { name: "Sessions", href: "/admin/sessions", icon: Calendar },
    { name: "Students", href: "/admin/students", icon: Users },
  ];

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-primary" />
          Admin Panel
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.name}
              to={link.href}
              end={link.href === "/admin"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {link.name}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
