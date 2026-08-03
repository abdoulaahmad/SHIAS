"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background px-4">
      <div className="flex flex-col items-center max-w-md text-center space-y-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="h-10 w-10" />
        </div>
        
        <PageHeader 
          title="Something went wrong"
          description="An unexpected error has occurred while loading this page. We've logged the issue and are looking into it."
          className="text-center"
        />

        <div className="flex gap-4 mt-6">
          <Button onClick={() => reset()} variant="default">
            Try Again
          </Button>
          <Button onClick={() => window.location.href = "/"} variant="outline">
            Go to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
