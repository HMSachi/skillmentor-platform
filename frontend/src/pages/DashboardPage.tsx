import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { CalendarDays } from "lucide-react";
import { StatusPill } from "@/components/StatusPill";
import { getMyEnrollments } from "@/lib/api";
import type { Enrollment } from "@/types";
import { useNavigate } from "react-router";

export default function DashboardPage() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
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

  if (!isLoaded) {
    return (
      <div className="container py-10">
        <div className="flex items-center justify-center">
          <div className="text-lg">Loading...</div>
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
      <div className="container py-10">
        <h1 className="text-3xl font-bold tracking-tight mb-6">My Courses</h1>
        <p className="text-muted-foreground">No courses enrolled yet.</p>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold tracking-tight mb-8">My Courses</h1>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {enrollments.map((enrollment) => (
          <div
            key={enrollment.id}
            className="rounded-3xl p-8 relative overflow-hidden bg-linear-to-br from-blue-500 to-blue-600 shadow-lg min-h-[360px] flex flex-col justify-between"
          >
            {/* Status Pill */}
            <div className="absolute top-6 right-6">
              <StatusPill status={enrollment.paymentStatus} />
            </div>

            <div className="space-y-6">
              {/* Profile Image */}
              <div className="size-24 rounded-full bg-white/10 ring-4 ring-white/10 overflow-hidden">
                {enrollment.mentorProfileImageUrl ? (
                  <img
                    src={enrollment.mentorProfileImageUrl}
                    alt={enrollment.mentorName}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold">
                    {enrollment.mentorName.charAt(0)}
                  </div>
                )}
              </div>

              {/* Course Info */}
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-white leading-tight">
                  {enrollment.subjectName}
                </h2>
                <p className="text-white/80 text-lg">
                  Mentor: {enrollment.mentorName}
                </p>
              </div>
            </div>

            <div className="flex items-center text-white/80 text-md mt-6 pt-6 border-t border-white/10">
              <CalendarDays className="mr-3 h-5 w-5" />
              Next Session: {new Date(enrollment.sessionAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
