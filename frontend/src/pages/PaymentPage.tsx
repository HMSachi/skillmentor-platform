import { useState } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/hooks/use-toast";
import { useAuth } from "@clerk/clerk-react";
import { enrollInSession, uploadPaymentProof } from "@/lib/api";

export default function PaymentPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { sessionId } = useParams();
  const { toast } = useToast();
  const { getToken } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const date = searchParams.get("date");
  const courseTitle = searchParams.get("courseTitle");
  const mentorId = searchParams.get("mentorId");
  const mentorName = searchParams.get("mentorName");
  const subjectId = searchParams.get("subjectId");
  const duration = searchParams.get("duration") || "60";
  const sessionDate = date ? new Date(date).toLocaleDateString() : null;
  const parsedSessionId = sessionId && /^\d+$/.test(sessionId) ? Number(sessionId) : null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);

    try {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");

      let currentSessionId = parsedSessionId;

      // If we have mentorId, it's a NEW enrollment request
      if (!currentSessionId && mentorId && subjectId && date) {
        const enrollment = await enrollInSession(token, {
          mentorId: Number(mentorId),
          subjectId: Number(subjectId),
          sessionAt: date,
          durationMinutes: Number(duration),
        });
        currentSessionId = enrollment.id;
      }

      if (!currentSessionId) {
        throw new Error("Missing session information. Please start the booking from a mentor profile page.");
      }

      // Upload the payment proof
      await uploadPaymentProof(token, currentSessionId, file);

      toast({
        title: "Payment Submitted",
        description:
          "Your payment proof has been uploaded. It is now pending administrator approval.",
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "There was a problem submitting your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container max-w-md py-10">
      <Card>
        <CardHeader>
          <CardTitle>Upload Bank Transfer Slip</CardTitle>
        </CardHeader>
        <form onSubmit={handleUpload}>
          <CardContent className="space-y-4">
            {mentorName && (
              <div className="text-sm font-medium">
                Session with: {mentorName}
              </div>
            )}
            {courseTitle && (
              <div className="text-sm text-muted-foreground">{courseTitle}</div>
            )}
            {sessionDate && (
              <div className="text-sm">
                <strong>Session Date:</strong> {sessionDate}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="slip">Bank Transfer Slip</Label>
              <Input
                id="slip"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
              />
            </div>
            <div className="text-sm text-muted-foreground">
              Please upload a clear image of your bank transfer slip to confirm
              your payment.
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={!file || isUploading}
            >
              {isUploading ? "Verifying..." : "Confirm Payment"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
