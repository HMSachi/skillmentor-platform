import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "@clerk/clerk-react";
import { ExternalLink, Trash2 } from "lucide-react";

export default function MentorManagement() {
  const { getToken } = useAuth();
  const [mentors, setMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mentorId: "",
    email: "",
    profession: "",
    company: "",
    bio: "",
    isCertified: false,
  });

  useEffect(() => {
    fetchMentors();
  }, [getToken]);

  async function fetchMentors() {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/mentors?size=50`);
      if (res.ok) {
        const data = await res.json();
        setMentors(data.content);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function createMentor(e: React.FormEvent) {
    e.preventDefault();
    try {
      const token = await getToken();
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/mentors`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowForm(false);
        fetchMentors();
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteMentor(id: number) {
    if (!confirm("Are you sure you want to delete this mentor?")) return;
    try {
      const token = await getToken();
      const apiUrl = import.meta.env.VITE_API_URL;
      await fetch(`${apiUrl}/mentors/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMentors();
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Mentors</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90"
        >
          {showForm ? "Close Form" : "+ Add Mentor"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <form className="grid grid-cols-2 gap-4" onSubmit={createMentor}>
            <div><label className="block mb-1 text-sm">First Name</label><input required value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} className="w-full border px-3 py-2 rounded" /></div>
            <div><label className="block mb-1 text-sm">Last Name</label><input required value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} className="w-full border px-3 py-2 rounded" /></div>
            <div><label className="block mb-1 text-sm">Mentor ID (Alias)</label><input required value={formData.mentorId} onChange={e => setFormData({ ...formData, mentorId: e.target.value })} className="w-full border px-3 py-2 rounded" /></div>
            <div><label className="block mb-1 text-sm">Email</label><input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full border px-3 py-2 rounded" /></div>
            <div><label className="block mb-1 text-sm">Profession</label><input required value={formData.profession} onChange={e => setFormData({ ...formData, profession: e.target.value })} className="w-full border px-3 py-2 rounded" /></div>
            <div><label className="block mb-1 text-sm">Company</label><input required value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} className="w-full border px-3 py-2 rounded" /></div>
            <div className="col-span-2"><label className="block mb-1 text-sm">Bio</label><textarea required value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} className="w-full border px-3 py-2 rounded"></textarea></div>
            <div className="col-span-2"><label className="flex items-center gap-2"><input type="checkbox" checked={formData.isCertified} onChange={e => setFormData({ ...formData, isCertified: e.target.checked })} /> Certified Mentor</label></div>
            <div className="col-span-2"><button type="submit" className="bg-primary text-white font-medium px-6 py-2 rounded">Save Mentor</button></div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 text-slate-600 uppercase">
            <tr>
              <th className="px-6 py-4 font-semibold">Name</th>
              <th className="px-6 py-4 font-semibold">Profession</th>
              <th className="px-6 py-4 font-semibold">Company</th>
              <th className="px-6 py-4 font-semibold">Verified</th>
              <th className="px-6 py-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mentors.map(m => (
              <tr key={m.id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4 font-bold text-slate-900">
                  <Link to={`/admin/mentors/${m.id}`} className="hover:text-primary transition-colors flex items-center gap-2">
                    {m.firstName} {m.lastName}
                    <ExternalLink className="size-3 text-slate-300" />
                  </Link>
                </td>
                <td className="px-6 py-4">{m.profession}</td>
                <td className="px-6 py-4">{m.company}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${m.isCertified ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                    {m.isCertified ? "Yes" : "No"}
                  </span>
                </td>
                <td className="px-6 py-4 flex items-center gap-4">
                  <Link to={`/admin/mentors/${m.id}`} className="text-primary hover:underline font-bold">Manage</Link>
                  <button onClick={() => deleteMentor(m.id)} className="text-red-400 hover:text-red-600">
                    <Trash2 className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
