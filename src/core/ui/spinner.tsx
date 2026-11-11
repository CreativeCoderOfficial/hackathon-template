import { Loader2 } from "lucide-react";
import { cn } from "./cn";

export function Spinner({ className }: { className?: string }) {
  return <Loader2 role="status" aria-label="Loading" className={cn("size-4 animate-spin", className)} />;
}
