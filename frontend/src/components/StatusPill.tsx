import { cn } from "@/lib/utils";

interface StatusPillProps {
  status: string;
}

export function StatusPill({ status }: StatusPillProps) {
  const s = status?.toLowerCase() || "pending";
  
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        (s === "pending" || s === "pending_approval") && "bg-amber-100 text-amber-800",
        (s === "confirmed" || s === "accepted" || s === "paid") && "bg-emerald-100 text-emerald-800",
        s === "completed" && "bg-sky-100 text-sky-800",
        (s === "cancelled" || s === "rejected") && "bg-rose-100 text-rose-800"
      )}
    >
      {s.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
    </span>
  );
}
