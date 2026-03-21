import { useState } from "react";
import { Calendar } from "./ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { useNavigate } from "react-router";
import type { Mentor } from "@/types";

interface SchedulingModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentor: Mentor;
}

const TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
];

export function SchedulingModal({
  isOpen,
  onClose,
  mentor,
}: SchedulingModalProps) {
  const [date, setDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [selectedSubjectId, setSelectedSubjectId] = useState<number>(mentor.subjects?.[0]?.id || 0);
  const [duration, setDuration] = useState<number>(60);
  const navigate = useNavigate();
  const mentorName = `${mentor.firstName} ${mentor.lastName}`;

  const handleSchedule = () => {
    if (date && selectedTime && selectedSubjectId) {
      const sessionDateTime = new Date(date);
      const [hours, minutes] = selectedTime.split(":");
      sessionDateTime.setHours(
        Number.parseInt(hours),
        Number.parseInt(minutes),
      );

      const subject = mentor.subjects?.find(s => s.id === selectedSubjectId);
      const sessionId = `${mentor.id}-${Date.now()}`;
      const searchParams = new URLSearchParams({
        date: sessionDateTime.toISOString(),
        courseTitle: subject?.subjectName ?? "",
        mentorName: mentorName,
        mentorId: String(mentor.id),
        mentorImg: mentor.profileImageUrl ?? "",
        subjectId: String(selectedSubjectId),
        duration: String(duration),
      });
      navigate(`/payment/${sessionId}?${searchParams.toString()}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-center space-y-0">
          <DialogTitle>Schedule this session</DialogTitle>
          <DialogDescription className="sr-only">
            Pick a date and time for your mentoring session with {mentorName}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Choose a date</h4>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border mx-auto"
                disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
              />
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Choose a time</h4>
                <div className="grid grid-cols-2 gap-2">
                  {TIME_SLOTS.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      className="w-full"
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Duration</h4>
                <div className="flex gap-2">
                  {[30, 60, 90].map((mins) => (
                    <Button
                      key={mins}
                      variant={duration === mins ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => setDuration(mins)}
                    >
                      {mins}m
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {mentor.subjects && mentor.subjects.length > 1 && (
            <div>
              <h4 className="font-medium mb-2">Choose a subject</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {mentor.subjects.map((s) => (
                  <Button
                    key={s.id}
                    variant={selectedSubjectId === s.id ? "default" : "outline"}
                    className="w-full justify-start overflow-hidden text-ellipsis"
                    onClick={() => setSelectedSubjectId(s.id)}
                  >
                    {s.subjectName}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSchedule} disabled={!date || !selectedTime || !selectedSubjectId}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
