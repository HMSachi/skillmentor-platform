import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useAuth } from "@clerk/clerk-react";
import {
    FileText,
    Upload,
    Trash2,
    BookOpen,
    User,
    Save,
    ArrowLeft,
    Plus,
    Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MentorDetailPage() {
    const { id } = useParams();
    const { getToken } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [mentor, setMentor] = useState<any>(null);
    const [resources, setResources] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // File upload state
    const [uploadData, setUploadData] = useState({
        title: "",
        type: "RESOURCE",
        subjectId: ""
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        fetchMentorData();
    }, [id, getToken]);

    async function fetchMentorData() {
        try {
            const token = await getToken();
            const apiUrl = import.meta.env.VITE_API_URL;

            const [mentorRes, resRes] = await Promise.all([
                fetch(`${apiUrl}/admin/mentors/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
                fetch(`${apiUrl}/admin/mentors/${id}/resources`, { headers: { Authorization: `Bearer ${token}` } })
            ]);

            if (mentorRes.ok) setMentor(await mentorRes.json());
            if (resRes.ok) setResources(await resRes.json());
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const handleUpdateMentor = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const token = await getToken();
            const apiUrl = import.meta.env.VITE_API_URL;
            const res = await fetch(`${apiUrl}/admin/mentors/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(mentor),
            });
            if (res.ok) toast({ title: "Updated", description: "Mentor profile saved." });
        } catch (err) {
            toast({ title: "Error", variant: "destructive" });
        } finally {
            setSaving(false);
        }
    };

    const handleFileUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile) return;
        setSaving(true);
        try {
            const token = await getToken();
            const apiUrl = import.meta.env.VITE_API_URL;

            const formData = new FormData();
            formData.append("title", uploadData.title);
            formData.append("type", uploadData.type);
            formData.append("mentorId", id as string);
            if (uploadData.subjectId) formData.append("subjectId", uploadData.subjectId);
            formData.append("file", selectedFile);

            const res = await fetch(`${apiUrl}/admin/resources`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            if (res.ok) {
                toast({ title: "Uploaded", description: "Resource added successfully." });
                setUploadData({ title: "", type: "RESOURCE", subjectId: "" });
                setSelectedFile(null);
                fetchMentorData();
            }
        } catch (err) {
            toast({ title: "Upload Failed", variant: "destructive" });
        } finally {
            setSaving(false);
        }
    };

    const deleteResource = async (resId: number) => {
        if (!confirm("Delete this resource?")) return;
        try {
            const token = await getToken();
            const apiUrl = import.meta.env.VITE_API_URL;
            await fetch(`${apiUrl}/admin/resources/${resId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchMentorData();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="p-12 text-center">Loading Mentor Details...</div>;
    if (!mentor) return <div>Mentor not found</div>;

    return (
        <div className="space-y-6 max-w-6xl mx-auto pb-20">
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => navigate("/admin/mentors")} className="gap-2">
                    <ArrowLeft className="size-4" /> Back to List
                </Button>
                <div className="flex items-center gap-3">
                    <Link to={`/mentor/${mentor.id}`} target="_blank" className="text-sm text-slate-500 hover:underline">View Public Profile</Link>
                </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex items-start gap-8">
                <div className="size-24 rounded-2xl bg-blue-50 flex items-center justify-center overflow-hidden">
                    {mentor.profileImageUrl ? (
                        <img src={mentor.profileImageUrl} className="w-full h-full object-cover" />
                    ) : (
                        <User className="size-12 text-blue-200" />
                    )}
                </div>
                <div>
                    <h1 className="text-3xl font-black text-slate-900">{mentor.firstName} {mentor.lastName}</h1>
                    <p className="text-slate-500">{mentor.profession} at {mentor.company}</p>
                    <div className="flex gap-4 mt-4">
                        <div className="bg-slate-50 px-4 py-2 rounded-xl text-center">
                            <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">Enrollments</p>
                            <p className="font-bold">{mentor.totalEnrollments}</p>
                        </div>
                        <div className="bg-slate-50 px-4 py-2 rounded-xl text-center">
                            <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">Subjects</p>
                            <p className="font-bold">{mentor.subjects?.length || 0}</p>
                        </div>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="details" className="w-full">
                <TabsList className="bg-slate-100 p-1 rounded-2xl mb-8">
                    <TabsTrigger value="details" className="rounded-xl px-8 flex gap-2"><User className="size-4" /> Edit Profile</TabsTrigger>
                    <TabsTrigger value="resources" className="rounded-xl px-8 flex gap-2"><FileText className="size-4" /> Resources & Assignments</TabsTrigger>
                    <TabsTrigger value="subjects" className="rounded-xl px-8 flex gap-2"><BookOpen className="size-4" /> Managed Subjects</TabsTrigger>
                </TabsList>

                <TabsContent value="details">
                    <form onSubmit={handleUpdateMentor} className="bg-white rounded-3xl p-8 border border-slate-100 space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>First Name</Label>
                                <Input value={mentor.firstName} onChange={e => setMentor({ ...mentor, firstName: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Last Name</Label>
                                <Input value={mentor.lastName} onChange={e => setMentor({ ...mentor, lastName: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Profession</Label>
                                <Input value={mentor.profession} onChange={e => setMentor({ ...mentor, profession: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Company</Label>
                                <Input value={mentor.company} onChange={e => setMentor({ ...mentor, company: e.target.value })} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Bio</Label>
                            <Textarea value={mentor.bio} onChange={e => setMentor({ ...mentor, bio: e.target.value })} className="min-h-[150px]" />
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit" disabled={saving} className="rounded-2xl h-12 px-12">
                                {saving ? "Saving..." : <><Save className="size-4 mr-2" /> Save Changes</>}
                            </Button>
                        </div>
                    </form>
                </TabsContent>

                <TabsContent value="resources" className="space-y-8">
                    {/* Upload Form */}
                    <div className="bg-blue-50/50 rounded-3xl p-8 border border-blue-100 animate-in fade-in slide-in-from-top-4">
                        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Upload className="size-5 text-blue-500" /> Upload New Material
                        </h3>
                        <form onSubmit={handleFileUpload} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                            <div className="md:col-span-1 space-y-2">
                                <Label>Title</Label>
                                <Input value={uploadData.title} onChange={e => setUploadData({ ...uploadData, title: e.target.value })} placeholder="e.g. Week 1 Assignment" />
                            </div>
                            <div className="space-y-2">
                                <Label>Type</Label>
                                <select
                                    className="w-full h-10 px-3 rounded-md border text-sm"
                                    value={uploadData.type}
                                    onChange={e => setUploadData({ ...uploadData, type: e.target.value })}
                                >
                                    <option value="RESOURCE">Resource Material</option>
                                    <option value="ASSIGNMENT">Assignment</option>
                                    <option value="VIDEO">Video Link</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label>Link to Subject (Optional)</Label>
                                <select
                                    className="w-full h-10 px-3 rounded-md border text-sm"
                                    value={uploadData.subjectId}
                                    onChange={e => setUploadData({ ...uploadData, subjectId: e.target.value })}
                                >
                                    <option value="">All Subjects</option>
                                    {mentor.subjects?.map((s: any) => (
                                        <option key={s.id} value={s.id}>{s.subjectName}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-2">
                                <Input type="file" onChange={e => setSelectedFile(e.target.files?.[0] || null)} className="flex-1" />
                                <Button type="submit" disabled={saving || !selectedFile} className="aspect-square p-0">
                                    <Plus className="size-5" />
                                </Button>
                            </div>
                        </form>
                    </div>

                    {/* List of Resources */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {resources.map(res => (
                            <div key={res.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className={`size-12 rounded-xl flex items-center justify-center ${res.type === 'ASSIGNMENT' ? 'bg-orange-50 text-orange-500' : 'bg-blue-50 text-blue-500'}`}>
                                        <FileText className="size-6" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">{res.title}</p>
                                        <p className="text-xs text-slate-400 uppercase font-black tracking-widest">{res.type}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm" onClick={() => window.open(res.fileUrl, '_blank')}>
                                        <Download className="size-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => deleteResource(res.id)} className="text-red-400 hover:text-red-600">
                                        <Trash2 className="size-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                        {resources.length === 0 && <p className="col-span-2 text-center text-slate-400 py-12 bg-slate-50/50 rounded-2xl border border-dashed">No resources uploaded yet.</p>}
                    </div>
                </TabsContent>

                <TabsContent value="subjects">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {mentor.subjects?.map((s: any) => (
                            <div key={s.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative group overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
                                <h4 className="font-black text-slate-900 text-lg mb-2">{s.subjectName}</h4>
                                <p className="text-sm text-slate-500 line-clamp-2">{s.description}</p>
                                <Button variant="link" className="px-0 mt-4 text-primary font-bold">Manage Subject Resources</Button>
                            </div>
                        ))}
                        <Button variant="outline" className="h-full min-h-[160px] border-dashed rounded-3xl flex flex-col gap-2 text-slate-400 hover:text-primary hover:border-primary transition-all">
                            <Plus className="size-8" />
                            Add New Subject
                        </Button>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
