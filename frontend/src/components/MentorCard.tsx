import { useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Calendar,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";
import type { Mentor } from "@/types";
import { SchedulingModal } from "@/components/SchedulingModel";
import { SignupDialog } from "@/components/SignUpDialog";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/clerk-react";

interface MentorCardProps {
  mentor: Mentor;
}

export function MentorCard({ mentor }: MentorCardProps) {
  const [isSchedulingModalOpen, setIsSchedulingModalOpen] = useState(false);
  const [isSignupDialogOpen, setIsSignupDialogOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { isSignedIn } = useAuth();

  const mentorName = `${mentor.firstName} ${mentor.lastName}`;
  const hasSubjects = mentor.subjects.length > 0;
  const courseTitle = mentor.subjects[0]?.subjectName ?? "General Mentorship";
  const bio = mentor.bio ?? "";
  const bioTooLong = bio.length > 120;

  const handleSchedule = () => {
    if (!isSignedIn) {
      setIsSignupDialogOpen(true);
      return;
    }
    setIsSchedulingModalOpen(true);
  };

  return (
    <>
      <div className="rounded-3xl p-8 relative overflow-hidden bg-white dark:bg-zinc-900 border border-border shadow-lg min-h-[360px] flex flex-col justify-between group transition-all hover:border-black dark:hover:border-white">

        {/* Status Pill matching the dashboard */}
        <div className="absolute top-6 right-6">
          <div className="bg-blue-100 text-blue-700 font-semibold px-4 py-1.5 rounded-full text-sm">
            ⭐ {mentor.positiveReviews}% Rating
          </div>
        </div>

        <div className="space-y-6">
          {/* Profile Image */}
          <div className="size-24 rounded-full ring-4 ring-black/5 dark:ring-white/10 overflow-hidden bg-muted">
            {mentor.profileImageUrl ? (
              <img
                src={mentor.profileImageUrl}
                alt={mentorName}
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl font-bold bg-muted text-muted-foreground">
                {mentor.firstName.charAt(0)}
              </div>
            )}
          </div>

          {/* Course Info */}
          <div className="space-y-3">
            <h2 className="text-2xl font-bold leading-tight">
              {courseTitle}
            </h2>
            <p className="text-muted-foreground text-lg">
              Mentor: {mentorName}
            </p>
          </div>

          <div className="text-muted-foreground text-sm flex gap-4 flex-wrap">
            <div className="flex items-center space-x-1">
              <Building2 className="size-4" />
              <span>{mentor.company}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="size-4" />
              <span>Tutor since {mentor.startYear}</span>
            </div>
          </div>

          {/* Highlights */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl flex flex-col gap-3">
            <div className="flex items-center space-x-3">
              <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium">{mentor.totalEnrollments} Enrollments</span>
            </div>
            {mentor.isCertified && (
              <div className="flex items-center space-x-3">
                <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium">Certified Teacher</span>
              </div>
            )}
          </div>

          <div>
            <p className={cn("text-sm text-foreground/80 transition-all", !isExpanded && bioTooLong ? "line-clamp-2" : "")}>
              {bio}
            </p>
            {bioTooLong && (
              <button onClick={() => setIsExpanded(!isExpanded)} className="text-blue-600 dark:text-blue-400 text-sm font-semibold mt-1 hover:underline">
                {isExpanded ? "See less" : "See more"}
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-3 text-md mt-6 pt-6 border-t border-border">
          <Button
            onClick={handleSchedule}
            className="flex-1 bg-blue-600 text-white hover:bg-blue-700 shadow-md"
            disabled={!hasSubjects}
            title={!hasSubjects ? "No courses available for this mentor yet" : undefined}
          >
            {hasSubjects ? "Schedule" : "Unavailable"}
          </Button>
          <Link to={`/mentor/${mentor.id}`} className="flex-1">
            <Button variant="outline" className="w-full bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700/50 shadow-xs">
              View Profile
            </Button>
          </Link>
        </div>
      </div>

      <SignupDialog
        isOpen={isSignupDialogOpen}
        onClose={() => setIsSignupDialogOpen(false)}
      />

      <SchedulingModal
        isOpen={isSchedulingModalOpen}
        onClose={() => setIsSchedulingModalOpen(false)}
        mentor={mentor}
      />
    </>
  );
}
