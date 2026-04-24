import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/hooks/use-toast";
import { Loader2, Upload, User } from "lucide-react";

export default function AdminProfilePage() {
    const { getToken } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<any>(null);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        fetchProfile();
    }, [getToken]);

    async function fetchProfile() {
        try {
            const token = await getToken();
            if (!token) return;
            const apiUrl = import.meta.env.VITE_API_URL;
            const res = await fetch(`${apiUrl}/users/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setProfile(data);
                if (data.profileImageUrl) setPreview(data.profileImageUrl);
            }
        } catch (error) {
            console.error("Error fetching profile", error);
        } finally {
            setLoading(false);
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const token = await getToken();
            const apiUrl = import.meta.env.VITE_API_URL;

            const formData = new FormData();
            const target = e.target as any;
            formData.append("name", target.name.value);
            formData.append("phone", target.phone.value);
            formData.append("bio", target.bio.value);
            if (file) {
                formData.append("image", file);
            }

            const res = await fetch(`${apiUrl}/users/profile`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            if (res.ok) {
                toast({ title: "Success", description: "Profile updated successfully!" });
                fetchProfile();
            } else {
                throw new Error("Failed to update profile");
            }
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Failed to update profile", variant: "destructive" });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-slate-800">Admin Profile</h1>

            <form onSubmit={handleUpdateProfile} className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 space-y-8">
                {/* Avatar Section */}
                <div className="flex flex-col items-center gap-4">
                    <div className="relative group">
                        <div className="size-32 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
                            {preview ? (
                                <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <User className="size-16 text-slate-400" />
                            )}
                        </div>
                        <label htmlFor="avatar-upload" className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <Upload className="size-6" />
                        </label>
                        <input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </div>
                    <p className="text-sm text-slate-500">Tap to upload a new profile image</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" name="name" defaultValue={profile?.name} placeholder="Enter your full name" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" disabled defaultValue={profile?.email} className="bg-slate-50" />
                        <p className="text-xs text-slate-500">Email cannot be changed (Clerk managed)</p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" name="phone" defaultValue={profile?.phone} placeholder="+1 (555) 000-0000" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="clerkId">Clerk User ID</Label>
                        <Input id="clerkId" disabled defaultValue={profile?.clerkUserId} className="bg-slate-50 font-mono text-xs" />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="bio">Biography / Professional Info</Label>
                    <Textarea id="bio" name="bio" defaultValue={profile?.bio} placeholder="Write a short bio about yourself..." className="min-h-[120px]" />
                </div>

                <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={saving} className="px-8 rounded-xl h-12">
                        {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save Profile"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
