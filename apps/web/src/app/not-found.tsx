import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";

export default function NotFound() {
  return (
    <div className="flex h-[calc(100vh-100px)] w-full flex-col items-center justify-center bg-background px-4">
      <div className="flex flex-col items-center max-w-md text-center space-y-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <FileQuestion className="h-10 w-10" />
        </div>
        
        <PageHeader 
          title="Page Not Found"
          description="The page you are looking for doesn't exist or has been moved."
          className="text-center"
        />

        <div className="mt-6">
          <Button asChild variant="default">
            <Link href="/">Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
