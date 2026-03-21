import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { CalendarDays, Clock, MessageSquare, Upload, Star } from "lucide-react";
import { StatusPill } from "@/components/StatusPill";
import { getMyEnrollments, leaveReview } from "@/lib/api";
import type { Enrollment } from "@/types";
import { useNavigate, Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/hooks/use-toast";

export default function DashboardPage() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const { toast } = useToast();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const router = useNavigate();

  useEffect(() => {
    async function fetchEnrollments() {
      if (!user) return;
      const token = await getToken();
      if (!token) return;
      try {
        console.log("Fetching enrollments with default token");
        const data = await getMyEnrollments(token);
        setEnrollments(data);
      } catch (err) {
        console.error("Failed to fetch enrollments", err);
      }
    }

    if (isLoaded && isSignedIn) {
      fetchEnrollments();
    }
  }, [isLoaded, isSignedIn, getToken, user]);

  const handleLeaveReview = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment);
    setIsReviewModalOpen(true);
  };

  const submitReview = async () => {
    if (!selectedEnrollment || !comment) return;
    const token = await getToken();
    if (!token) return;

    setSubmittingReview(true);
    try {
      // For this demo, we'll try to find mentor ID from enrollment if possible
      // In SessionResponseDTO we should have mentorId
      const mentorId = (selectedEnrollment as any).mentorId || 1; 

      await leaveReview(token, {
        mentorId: mentorId,
        rating,
        comment
      });
      setIsReviewModalOpen(false);
      setComment("");
      setRating(5);
      toast({ title: "Review Submitted", description: "Thank you for your feedback!" });
    } catch (err) {
      console.error("Failed to submit review", err);
      toast({ title: "Error", description: "Failed to submit review", variant: "destructive" });
    } finally {
      setSubmittingReview(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="container py-20">
        <div className="flex items-center justify-center">
          <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    router("/login");
    return null;
  }

  if (!enrollments.length) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-4">My Courses</h1>
        <p className="text-muted-foreground mb-8">No courses enrolled yet. Start learning today!</p>
        <Link to="/">
          <Button size="lg">Explore Mentors</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-10 max-w-7xl">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">My Courses</h1>
          <p className="text-muted-foreground mt-1">Manage your sessions and learning progress.</p>
        </div>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {enrollments.map((enrollment) => (
          <div
            key={enrollment.id}
            className="group rounded-[32px] p-8 relative overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-600 to-blue-700 shadow-2xl transition-all hover:-translate-y-1 hover:shadow-blue-500/20 flex flex-col justify-between min-h-[420px]"
          >
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            
            {/* Status Pill */}
            <div className="absolute top-6 right-6 z-10">
              <StatusPill status={enrollment.paymentStatus || enrollment.status} />
            </div>

            <div className="space-y-8 relative z-10">
              {/* Profile Image & Status Badge */}
              <div className="relative inline-block">
                <div className="size-24 rounded-3xl bg-white/10 p-1 backdrop-blur-md ring-1 ring-white/20 overflow-hidden shadow-inner">
                  {enrollment.mentorProfileImageUrl ? (
                    <img
                      src={enrollment.mentorProfileImageUrl}
                      alt={enrollment.mentorName}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-3xl font-black">
                      {enrollment.mentorName.charAt(0)}
                    </div>
                  )}
                </div>
                {enrollment.status === "COMPLETED" && (
                    <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-1.5 rounded-xl shadow-lg border-2 border-indigo-600">
                        <Star className="size-4 fill-white" />
                    </div>
                )}
              </div>

              {/* Course Info */}
              <div className="space-y-4">
                <h2 className="text-2xl font-black text-white leading-tight tracking-tight drop-shadow-sm">
                  {enrollment.subjectName}
                </h2>
                <div className="flex flex-col gap-2">
                    <p className="text-white/70 text-sm font-medium uppercase tracking-wider">
                      with {enrollment.mentorName}
                    </p>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center text-white/90 text-xs bg-white/10 px-2 py-1 rounded-lg">
                            <Clock className="mr-1.5 h-3.5 w-3.5" />
                            {enrollment.durationMinutes} min
                        </div>
                        <div className="flex items-center text-white/90 text-xs bg-white/10 px-2 py-1 rounded-lg font-mono">
                            {enrollment.status}
                        </div>
                    </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 relative z-10 mt-10">
              <div className="flex items-center text-white/90 font-medium py-3 border-t border-white/10">
                <CalendarDays className="mr-3 h-5 w-5 text-blue-300" />
                <span>{new Date(enrollment.sessionAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {enrollment.status === "COMPLETED" ? (
                  <Button 
                    variant="secondary" 
                    className="w-full rounded-2xl h-12 bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-sm transition-all shadow-lg"
                    onClick={() => handleLeaveReview(enrollment)}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Share Feedback
                  </Button>
                ) : (enrollment.paymentStatus === "PENDING" || enrollment.paymentStatus === "pending") ? (
                  <Link to={`/payment/${enrollment.id}`} className="w-full">
                    <Button 
                      variant="secondary" 
                      className="w-full rounded-2xl h-12 bg-amber-400 hover:bg-amber-300 text-amber-950 border-none font-bold transition-all shadow-lg hover:shadow-amber-400/20"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Submit Bank Slip
                    </Button>
                  </Link>
                ) : (
                  <Button 
                    disabled 
                    variant="secondary" 
                    className="w-full rounded-2xl h-12 bg-white/5 text-white/40 border border-white/5 cursor-not-allowed"
                  >
                    {(enrollment.status === "PENDING" || enrollment.status === "pending") ? "Awaiting Confirmation" : enrollment.status}
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-[32px] p-8 border-none shadow-2xl">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-black text-center">How was your session?</DialogTitle>
          </DialogHeader>
          <div className="space-y-8">
            <div className="flex justify-center gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="transition-all hover:scale-110 active:scale-90"
                >
                  <Star
                    className={`size-10 ${star <= rating ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]" : "text-muted-foreground/20"}`}
                  />
                </button>
              ))}
            </div>
            <Textarea
              placeholder="Tell us what you liked (or what could be better)..."
              value={comment}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
              className="min-h-[140px] rounded-2xl border-muted/50 focus:ring-primary focus:border-primary resize-none p-4"
            />
          </div>
          <DialogFooter className="mt-8 gap-3 sm:gap-0">
            <Button 
                variant="ghost" 
                onClick={() => setIsReviewModalOpen(false)}
                className="rounded-xl h-12 font-bold"
            >
                Later
            </Button>
            <Button 
                onClick={submitReview} 
                disabled={submittingReview || !comment}
                className="rounded-xl h-12 px-8 font-black bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all flex-1 sm:flex-none"
            >
              {submittingReview ? "Saving..." : "Post Review"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
