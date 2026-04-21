import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";

export default function SubjectManagement() {
  const { getToken } = useAuth();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [mentors, setMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [subjectName, setSubjectName] = useState("");
  const [description, setDescription] = useState("");
  const [mentorId, setMentorId] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchSubjects();
    fetchMentors();
  }, [getToken]);

  async function fetchSubjects() {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/subjects`);
      if (res.ok) setSubjects(await res.json());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchMentors() {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      // Get all mentors for dropdown
      const res = await fetch(`${apiUrl}/mentors?size=100`);
      if (res.ok) {
        const data = await res.json();
        setMentors(data.content);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function createSubject(e: React.FormEvent) {
    e.preventDefault();
    try {
      const token = await getToken();
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/subjects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ subjectName, description, mentorId: Number(mentorId) }),
      });
      if (res.ok) {
        setSubjectName("");
        setDescription("");
        setMentorId("");
        setShowForm(false);
        fetchSubjects();
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Subjects</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90"
        >
          {showForm ? "Close Form" : "+ Add Subject"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <form className="space-y-4" onSubmit={createSubject}>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Subject Name</label>
              <input required value={subjectName} onChange={e => setSubjectName(e.target.value)} className="w-full border border-slate-200 rounded px-3 py-2 outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea required value={description} onChange={e => setDescription(e.target.value)} className="w-full border border-slate-200 rounded px-3 py-2 outline-none focus:border-primary"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Assign to Mentor</label>
              <select required value={mentorId} onChange={e => setMentorId(e.target.value)} className="w-full border border-slate-200 rounded px-3 py-2 outline-none focus:border-primary">
                <option value="" disabled>Select a Mentor</option>
                {mentors.map(m => (
                  <option key={m.id} value={m.id}>{m.firstName} {m.lastName}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="bg-primary text-white font-medium px-4 py-2 rounded">Save Subject</button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 text-slate-600 uppercase">
            <tr>
              <th className="px-6 py-4 font-semibold">ID</th>
              <th className="px-6 py-4 font-semibold">Subject</th>
              <th className="px-6 py-4 font-semibold">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {subjects.map(sub => (
              <tr key={sub.id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4 font-medium">{sub.id}</td>
                <td className="px-6 py-4">{sub.subjectName}</td>
                <td className="px-6 py-4 truncate max-w-[200px]">{sub.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
