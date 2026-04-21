import { useEffect } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";

export default function UserSyncTrigger() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    async function syncUser() {
      if (isLoaded && user) {
        try {
          const token = await getToken();
          const apiUrl = import.meta.env.VITE_API_URL;
          await fetch(`${apiUrl}/users/sync`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: user.fullName || user.firstName,
              email: user.primaryEmailAddress?.emailAddress,
            }),
          });
        } catch (error) {
          console.error("Failed to sync user data", error);
        }
      }
    }
    syncUser();
  }, [user, isLoaded, getToken]);

  return null;
}
