// Modified to match with backend SubjectResponseDTO
export interface Subject {
  id: number;
  subjectName: string;
  description: string;
  courseImageUrl: string;
}

// Modified to match with backend MentorResponseDTO (from GET /api/v1/mentors)
export interface Mentor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  title: string;
  company: string;
  experienceYears: number;
  bio: string;
  profileImageUrl: string;
  positiveReviews: number;
  totalEnrollments: number;
  isCertified: boolean;
  subjects: Subject[];
}

// Modified to match with SessionResponseDTO (from GET /api/v1/sessions/my-sessions)
export interface Enrollment {
  id: number;
  subjectId: number;
  subjectName: string;
  mentorName: string;
  mentorProfileImageUrl: string;
  sessionAt: string;
  durationMinutes: number;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "accepted" | "pending" | "completed" | "cancelled";
  paymentStatus: string;
  meetingLink: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
}
