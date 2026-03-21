import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Building2,
    Calendar,
    GraduationCap,
    ShieldCheck,
    ThumbsUp,
    ArrowLeft,
} from "lucide-react";
import { getMentorById, getMentorReviews } from "@/lib/api";
import type { Mentor } from "@/types";
import { SchedulingModal } from "@/components/SchedulingModel";
import { useAuth } from "@clerk/clerk-react";
import { SignupDialog } from "@/components/SignUpDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

export default function MentorProfilePage() {
    const { id } = useParams<{ id: string }>();
    const [mentor, setMentor] = useState<Mentor | null>(null);
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSchedulingModalOpen, setIsSchedulingModalOpen] = useState(false);
    const [isSignupDialogOpen, setIsSignupDialogOpen] = useState(false);
    const { isSignedIn } = useAuth();

    useEffect(() => {
        if (id) {
            Promise.all([
                getMentorById(Number(id)),
                getMentorReviews(Number(id))
            ])
                .then(([mentorData, reviewData]) => {
                    setMentor(mentorData);
                    setReviews(reviewData);
                })
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [id]);

    const handleSchedule = () => {
        if (!isSignedIn) {
            setIsSignupDialogOpen(true);
            return;
        }
        setIsSchedulingModalOpen(true);
    };

    if (loading) {
        return (
            <div className="container py-20 text-center">
                <div className="text-lg">Loading mentor profile...</div>
            </div>
        );
    }

    if (!mentor) {
        return (
            <div className="container py-20 text-center">
                <div className="text-lg text-destructive">Mentor not found.</div>
                <Link to="/" className="text-primary hover:underline mt-4 inline-block">
                    Back to Home
                </Link>
            </div>
        );
    }

    const mentorName = `${mentor.firstName} ${mentor.lastName}`;

    return (
        <div className="container py-10 max-w-5xl">
            <Link
                to="/"
                className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to search
            </Link>

            <div className="grid gap-8 md:grid-cols-[1fr_350px]">
                <div className="space-y-8">
                    <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                        <div className="size-32 rounded-full overflow-hidden bg-muted border-4 border-white shadow-xl">
                            {mentor.profileImageUrl ? (
                                <img
                                    src={mentor.profileImageUrl}
                                    alt={mentorName}
                                    className="w-full h-full object-cover object-top"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl font-bold bg-primary text-primary-foreground">
                                    {mentor.firstName.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-4xl font-bold tracking-tight">{mentorName}</h1>
                            <p className="text-xl text-muted-foreground font-medium">
                                {mentor.title} at {mentor.company}
                            </p>
                            <div className="flex flex-wrap gap-4 mt-4">
                                <div className="flex items-center gap-1 text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100">
                                    <ThumbsUp className="h-3.5 w-3.5" />
                                    {mentor.positiveReviews} Positive reviews
                                </div>
                                <div className="flex items-center gap-1 text-sm bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-100">
                                    <Calendar className="h-3.5 w-3.5" />
                                    {mentor.experienceYears} Years experience
                                </div>
                            </div>
                        </div>
                    </div>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">About Me</h2>
                        <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-wrap">
                            {mentor.bio}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">Subjects Taught</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {mentor.subjects.map((subject) => (
                                <Card key={subject.id} className="overflow-hidden p-0 border-none shadow-md hover:shadow-lg transition-shadow">
                                    <div className="aspect-video relative overflow-hidden bg-muted">
                                        {subject.courseImageUrl ? (
                                            <img
                                                src={subject.courseImageUrl}
                                                alt={subject.subjectName}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-lg font-bold">
                                                {subject.subjectName}
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4 bg-white">
                                        <h3 className="font-bold text-lg mb-1">{subject.subjectName}</h3>
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {subject.description}
                                        </p>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </section>
                    
                    <section className="pt-8 border-t">
                        <h2 className="text-2xl font-bold mb-6">Student Reviews</h2>
                        {reviews && reviews.length > 0 ? (
                            <div className="space-y-6">
                                {reviews.map((review, i) => (
                                    <div key={i} className="flex gap-4 p-5 rounded-2xl bg-muted/30 border border-muted-foreground/10 transition-colors hover:bg-muted/40">
                                        <Avatar className="size-12 ring-2 ring-white shadow-sm">
                                            <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                                                {review.studentId?.substring(0, 2).toUpperCase() || "ST"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="space-y-2 flex-1">
                                            <div className="flex items-center justify-between">
                                                <div className="flex gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`size-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/20"}`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-sm text-muted-foreground font-medium">
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-muted-foreground leading-relaxed italic">"{review.comment}"</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 rounded-2xl border border-dashed text-center space-y-2">
                                <p className="text-muted-foreground font-medium">No reviews yet.</p>
                                <p className="text-xs text-muted-foreground/60">Be the first to share your experience!</p>
                            </div>
                        )}
                    </section>
                </div>

                <div className="space-y-6">
                    <Card className="p-6 sticky top-24 shadow-xl border-t-4 border-t-primary">
                        <h3 className="text-xl font-bold mb-4">Book a Session</h3>
                        <div className="space-y-4 mb-6 text-sm">
                            <div className="flex items-center justify-between py-2 border-b">
                                <div className="flex items-center text-muted-foreground">
                                    <GraduationCap className="mr-2 h-4 w-4" />
                                    <span>Enrollments</span>
                                </div>
                                <span className="font-bold">{mentor.totalEnrollments}</span>
                            </div>
                            {mentor.isCertified && (
                                <div className="flex items-center justify-between py-2 border-b">
                                    <div className="flex items-center text-muted-foreground">
                                        <ShieldCheck className="mr-2 h-4 w-4" />
                                        <span>Identity verified</span>
                                    </div>
                                    <span className="text-green-600 font-medium">Yes</span>
                                </div>
                            )}
                            <div className="flex items-center justify-between py-2">
                                <div className="flex items-center text-muted-foreground">
                                    <Building2 className="mr-2 h-4 w-4" />
                                    <span>Current location</span>
                                </div>
                                <span className="font-medium">{mentor.company}</span>
                            </div>
                        </div>
                        <Button
                            onClick={handleSchedule}
                            className="w-full py-6 text-lg font-bold bg-black text-white hover:bg-black/90 shadow-lg transition-all active:scale-[0.98]"
                            disabled={mentor.subjects.length === 0}
                        >
                            Check Availability
                        </Button>
                        <p className="text-xs text-center text-muted-foreground mt-4 italic">
                            * Personalized training for your career goals.
                        </p>
                    </Card>
                </div>
            </div>

            <SchedulingModal
                isOpen={isSchedulingModalOpen}
                onClose={() => setIsSchedulingModalOpen(false)}
                mentor={mentor}
            />

            <SignupDialog
                isOpen={isSignupDialogOpen}
                onClose={() => setIsSignupDialogOpen(false)}
            />
        </div>
    );
}
