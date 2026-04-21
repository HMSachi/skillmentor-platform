import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Users, BookOpen, Calendar, ShieldCheck } from "lucide-react";

interface Analytics {
  totalBookings: number;
  completedSessions: number;
  pendingPayments: number;
  subjectEnrollments: Record<string, number>;
}

export default function AdminDashboardPage() {
  const { getToken } = useAuth();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const token = await getToken();
        if (!token) return;
        const apiUrl = import.meta.env.VITE_API_URL;
        const res = await fetch(`${apiUrl}/admin/analytics`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setAnalytics(data);
        }
      } catch (error) {
        console.error("Failed to fetch analytics", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, [getToken]);

  if (loading) {
    return <div className="text-slate-500">Loading analytics...</div>;
  }

  const stats = [
    { name: "Total Bookings", value: analytics?.totalBookings || 0, icon: Calendar },
    { name: "Completed Sessions", value: analytics?.completedSessions || 0, icon: ShieldCheck },
    { name: "Pending Payments", value: analytics?.pendingPayments || 0, icon: Users },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="p-4 bg-primary/10 rounded-lg text-primary">
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.name}</p>
                <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Subject Enrollments</h2>
        <div className="space-y-4">
          {Object.entries(analytics?.subjectEnrollments || {}).map(([subject, count]) => (
            <div key={subject} className="flex justify-between items-center border-b border-slate-50 pb-2">
              <span className="text-slate-600">{subject}</span>
              <span className="font-semibold text-slate-800">{count}</span>
            </div>
          ))}
          {Object.keys(analytics?.subjectEnrollments || {}).length === 0 && (
             <p className="text-slate-500 text-sm">No enrollments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
