import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";

interface Session {
  id: number;
  subjectName: string;
  mentorName: string;
  studentEmail: string; // Wait, our DTO doesn't have studentEmail. Let's rely on standard display
  sessionAt: string;
  status: string;
  paymentStatus: string;
  paymentProofUrl?: string;
}

export default function SessionManagement() {
  const { getToken } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, [getToken]);

  async function fetchSessions() {
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) return;
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/admin/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSessions(data);
      }
    } catch (error) {
      console.error("error fetching sessions", error);
    } finally {
      setLoading(false);
    }
  }

  async function updatePaymentStatus(id: number, _status: string) {
    try {
      const token = await getToken();
      const apiUrl = import.meta.env.VITE_API_URL;
      await fetch(`${apiUrl}/admin/bookings/${id}/approve-payment`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        // for now just approving triggers the existing PAiD logic
      });
      fetchSessions();
    } catch (error) {
      console.error(error);
    }
  }

  async function updateSessionStatus(id: number, status: string) {
    try {
      const token = await getToken();
      const apiUrl = import.meta.env.VITE_API_URL;
      await fetch(`${apiUrl}/admin/bookings/${id}/status?status=${status}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSessions();
    } catch (error) {
      console.error(error);
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Sessions</h1>
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 text-slate-600 uppercase">
            <tr>
              <th className="px-6 py-4 font-semibold">Subject</th>
              <th className="px-6 py-4 font-semibold">Mentor</th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold">Payment Status</th>
              <th className="px-6 py-4 font-semibold">Session Status</th>
              <th className="px-6 py-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sessions.map((session) => (
              <tr key={session.id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4 font-medium text-slate-800">{session.subjectName}</td>
                <td className="px-6 py-4 text-slate-600">{session.mentorName}</td>
                <td className="px-6 py-4 text-slate-600">{new Date(session.sessionAt).toLocaleString()}</td>
                <td className="px-6 py-4 text-slate-600">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${session.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' :
                    session.paymentStatus === 'PENDING_APPROVAL' ? 'bg-amber-100 text-amber-700' :
                      session.paymentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-slate-100 text-slate-700'
                    }`}>
                    {session.paymentStatus}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${session.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' :
                    session.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                    {session.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      {session.paymentStatus !== "PAID" && (
                        <button onClick={() => updatePaymentStatus(session.id, "PAID")} className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600">Approve Payment</button>
                      )}
                      {session.status !== "COMPLETED" && session.status !== "CANCELLED" && (
                        <button onClick={() => updateSessionStatus(session.id, "COMPLETED")} className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">Mark Complete</button>
                      )}
                    </div>
                    {session.paymentProofUrl && (
                      <a
                        href={session.paymentProofUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-600 hover:underline font-medium"
                      >
                        View Payment Slip
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {sessions.length === 0 && (
              <tr><td colSpan={6} className="px-6 py-4 text-center">No sessions right now.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
