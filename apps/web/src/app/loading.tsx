import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background/80 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center gap-4 text-primary">
        <Loader2 className="h-12 w-12 animate-spin" />
        <p className="text-sm font-medium animate-pulse">Loading SHIAS...</p>
      </div>
    </div>
  );
}
