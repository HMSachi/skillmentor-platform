import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "@clerk/clerk-react";
import {
    PlayCircle,
    FileText,
    CheckCircle2,
    ChevronRight,
    Clock,
    BookOpen,
    MessageSquare,
    Lock,
    ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMyEnrollments } from "@/lib/api";
import type { Enrollment } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

export default function CourseDetailsPage() {
    const { sessionId } = useParams();
    const { getToken } = useAuth();
    const navigate = useNavigate();
    const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
    const [resources, setResources] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCourseData() {
            const token = await getToken();
            if (!token) return;
            try {
                const apiUrl = import.meta.env.VITE_API_URL;

                // 1. Fetch Enrollments
                const enrollments = await getMyEnrollments(token);
                const found = enrollments.find(e => e.id === Number(sessionId));
                if (!found) {
                    navigate("/dashboard");
                    return;
                }
                setEnrollment(found);

                // 2. Fetch Resources for this Subject
                const res = await fetch(`${apiUrl}/sessions/subject/${found.subjectId}/resources`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    setResources(await res.json());
                }

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchCourseData();
    }, [sessionId, getToken, navigate]);

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50">
            <div className="flex flex-col items-center gap-4">
                <div className="size-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-slate-500 font-medium animate-pulse">Loading Workspace...</p>
            </div>
        </div>
    );

    if (!enrollment) return null;

    return (
        <div className="bg-slate-50 min-h-screen pb-24">
            {/* Elegant Top Navigation */}
            <div className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
                <div className="container py-4 flex items-center justify-between">
                    <Button variant="ghost" onClick={() => navigate("/dashboard")} className="gap-2 group hover:bg-slate-100 rounded-xl transition-all">
                        <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-semibold text-slate-600">Back to Dashboard</span>
                    </Button>
                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex flex-col items-end">
                            <p className="text-xs text-slate-400 font-black uppercase tracking-widest leading-none mb-1">Current Track</p>
                            <p className="text-sm font-black text-slate-900">{enrollment.subjectName}</p>
                        </div>
                        <div className="h-10 w-px bg-slate-100 hidden md:block" />
                        <div className="flex items-center gap-3 bg-blue-50/50 px-4 py-2 rounded-2xl border border-blue-100/50">
                            <div className="relative size-10">
                                <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-blue-100" strokeWidth="3" />
                                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-blue-600" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - 33} strokeLinecap="round" />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-[10px] font-black text-blue-700">33%</span>
                                </div>
                            </div>
                            <span className="text-xs font-black text-blue-600 uppercase tracking-wider">On Track</span>
                        </div>
                    </div>
                </div>
            </div>

            <main className="container mt-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column: Course Detail & Content */}
                    <div className="lg:col-span-8 space-y-10">
                        {/* Course Hero Card */}
                        <div className="relative bg-slate-900 rounded-[40px] p-10 overflow-hidden shadow-2xl shadow-blue-900/20 group">
                            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-600/20 to-transparent pointer-events-none" />
                            <div className="absolute -bottom-24 -right-24 size-64 bg-blue-500/10 rounded-full blur-3xl" />

                            <div className="relative z-10">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black text-blue-300 uppercase tracking-[0.2em] mb-6 border border-white/5">
                                    <BookOpen className="size-3" /> Professional Certification
                                </div>
                                <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-[1.1] tracking-tight">
                                    {enrollment.subjectName}
                                </h1>
                                <p className="text-blue-100/70 text-lg leading-relaxed max-w-xl mb-8 font-medium">
                                    Master the core principles and advanced strategies of {enrollment.subjectName} with personalized guidance from your mentor.
                                    Access exclusive curricula and assignments designed for industry excellence.
                                </p>

                                <div className="flex flex-wrap gap-4 pt-6 border-t border-white/10">
                                    <div className="bg-white/5 rounded-2xl px-5 py-3 border border-white/5">
                                        <p className="text-[10px] text-blue-300 font-black uppercase tracking-widest mb-1">Duration</p>
                                        <p className="text-white font-bold">{enrollment.durationMinutes} Minutes</p>
                                    </div>
                                    <div className="bg-white/5 rounded-2xl px-5 py-3 border border-white/5">
                                        <p className="text-[10px] text-blue-300 font-black uppercase tracking-widest mb-1">Resources</p>
                                        <p className="text-white font-bold">{resources.length} Modules</p>
                                    </div>
                                    <div className="bg-white/5 rounded-2xl px-5 py-3 border border-white/5">
                                        <p className="text-[10px] text-blue-300 font-black uppercase tracking-widest mb-1">Support</p>
                                        <p className="text-white font-bold">Priority Access</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Resource Tabs */}
                        <div className="bg-white rounded-[40px] p-2 border border-slate-200 shadow-sm">
                            <Tabs defaultValue="assignments" className="w-full">
                                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                                    <TabsList className="bg-slate-50 p-1.5 rounded-2xl">
                                        <TabsTrigger value="overview" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold">Overview</TabsTrigger>
                                        <TabsTrigger value="assignments" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold">Assignments</TabsTrigger>
                                        <TabsTrigger value="resources" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold">Curriculum</TabsTrigger>
                                    </TabsList>
                                    <div className="hidden md:flex items-center gap-2 text-slate-400 px-4">
                                        <CheckCircle2 className="size-4" />
                                        <span className="text-xs font-bold uppercase tracking-widest">Auto-saved progress</span>
                                    </div>
                                </div>

                                <div className="p-8">
                                    <TabsContent value="overview" className="mt-0 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-4">
                                                <h3 className="text-xl font-black text-slate-900 tracking-tight">Course Description</h3>
                                                <p className="text-slate-600 leading-relaxed font-medium">
                                                    Welcome to the intensive training module for {enrollment.subjectName}. In this course,
                                                    you will work directly with {enrollment.mentorName} to master the core principles
                                                    and advanced strategies needed to excel in your field.
                                                </p>
                                            </div>
                                            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                                <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2">
                                                    <div className="size-6 bg-green-500 rounded-lg flex items-center justify-center">
                                                        <CheckCircle2 className="size-4 text-white" />
                                                    </div>
                                                    Skill Outcomes
                                                </h3>
                                                <ul className="space-y-3">
                                                    {[
                                                        "Industry standard workflows",
                                                        "Common pitfall analysis",
                                                        "Professional implementation",
                                                        "Real-world case studies"
                                                    ].map((item, i) => (
                                                        <li key={i} className="flex items-center gap-3 text-sm text-slate-600 font-semibold">
                                                            <div className="size-1.5 bg-slate-300 rounded-full" /> {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="assignments" className="mt-0 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="grid grid-cols-1 gap-4">
                                            {resources.filter(r => r.type === 'ASSIGNMENT').map((item, i) => (
                                                <div key={i} className="group p-8 rounded-[32px] border border-slate-100 bg-white hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5 transition-all flex flex-col md:flex-row items-center justify-between gap-6">
                                                    <div className="flex items-center gap-6 text-center md:text-left">
                                                        <div className="size-16 bg-orange-50 text-orange-500 rounded-[20px] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                                            <FileText className="size-8" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-xl font-black text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                                                            <p className="text-slate-500 font-medium">Download the brief and submit your solution via the portal.</p>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        onClick={() => window.open(item.fileUrl, '_blank')}
                                                        className="w-full md:w-auto h-14 px-10 rounded-2xl bg-slate-900 text-white font-black hover:bg-blue-600 transition-all shadow-lg"
                                                    >
                                                        Download Brief
                                                    </Button>
                                                </div>
                                            ))}
                                            {resources.filter(r => r.type === 'ASSIGNMENT').length === 0 && (
                                                <div className="text-center py-20 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200">
                                                    <div className="size-16 bg-white rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                                                        <FileText className="size-8 text-slate-200" />
                                                    </div>
                                                    <h3 className="text-lg font-black text-slate-900 mb-2">No Assignments Yet</h3>
                                                    <p className="text-slate-400 font-medium">Your mentor will post your first challenge very soon.</p>
                                                </div>
                                            )}
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="resources" className="mt-0 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {resources.filter(r => r.type === 'RESOURCE').map((item, i) => (
                                                <div key={i} className="p-6 rounded-3xl border border-slate-100 flex items-center justify-between group hover:bg-slate-50 hover:border-slate-300 transition-all">
                                                    <div className="flex items-center gap-4">
                                                        <div className="size-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                                                            <BookOpen className="size-6" />
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-slate-900 truncate max-w-[150px]">{item.title}</p>
                                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Supplemental</p>
                                                        </div>
                                                    </div>
                                                    <Button variant="ghost" size="sm" onClick={() => window.open(item.fileUrl, '_blank')} className="rounded-xl hover:bg-white hover:shadow-sm">
                                                        <ChevronRight className="size-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                            {resources.filter(r => r.type === 'RESOURCE').length === 0 && (
                                                <p className="col-span-2 text-center py-12 text-slate-400 font-medium">Coming soon: Curated learning materials.</p>
                                            )}
                                        </div>
                                    </TabsContent>
                                </div>
                            </Tabs>
                        </div>
                    </div>

                    {/* Right Column: Faculty & Actions */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Mentor Profile Card */}
                        <div className="bg-white rounded-[40px] p-8 border border-slate-200 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <User className="size-24 scale-150" />
                            </div>
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Expert Faculty</h3>
                            <div className="flex items-center gap-5 mb-8">
                                <div className="relative">
                                    <img
                                        src={enrollment.mentorProfileImageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200"}
                                        className="size-20 rounded-[28px] object-cover ring-4 ring-slate-50 group-hover:scale-105 transition-transform"
                                        alt={enrollment.mentorName}
                                    />
                                    <div className="absolute -bottom-1 -right-1 size-6 bg-green-500 border-4 border-white rounded-full" />
                                </div>
                                <div>
                                    <p className="font-black text-xl text-slate-900 mb-1">{enrollment.mentorName}</p>
                                    <p className="text-xs bg-slate-100 text-slate-500 px-3 py-1 rounded-full font-bold inline-block">Lead Mentor</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Button className="w-full rounded-[22px] h-14 bg-slate-900 text-white font-black hover:bg-blue-600 shadow-xl shadow-slate-900/10 transition-all gap-2">
                                    <MessageSquare className="size-5" /> Start Discussion
                                </Button>
                                <Button variant="ghost" className="w-full h-12 rounded-[20px] font-bold text-slate-500 hover:text-slate-900">
                                    View Faculty Profile
                                </Button>
                            </div>
                        </div>

                        {/* Upsell / Next Steps */}
                        <div className="bg-slate-900 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                                <Lock className="size-16" />
                            </div>
                            <div className="absolute -left-12 -bottom-12 size-32 bg-blue-500/10 rounded-full blur-3xl" />

                            <p className="text-blue-400 text-xs font-black uppercase tracking-[0.25em] mb-4">Exclusive Access</p>
                            <h3 className="text-2xl font-black mb-4 leading-tight">Live Group Mentorship</h3>
                            <p className="text-white/60 text-sm mb-10 font-medium leading-relaxed">
                                Join your cohort this Friday for an interactive case study deep-dive session.
                            </p>
                            <Button className="w-full bg-white text-slate-900 hover:bg-blue-50 rounded-2xl h-14 font-black transition-all shadow-xl">
                                Reserve Slot
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

const User = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
);
