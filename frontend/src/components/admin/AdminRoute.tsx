import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router";

interface AdminRouteProps {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userEmail = user.primaryEmailAddress?.emailAddress;
  const adminEmails = import.meta.env.VITE_ADMIN_EMAILS?.split(",") || [];

  const isAdmin = userEmail && adminEmails.includes(userEmail);

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
