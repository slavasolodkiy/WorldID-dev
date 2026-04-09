import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <FileX className="w-12 h-12 text-muted-foreground mb-6" />
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <h2 className="text-xl font-semibold mb-2">Page not found</h2>
      <p className="text-muted-foreground mb-8 max-w-sm">
        The page you are looking for does not exist or may have moved.
      </p>
      <div className="flex gap-3">
        <Button asChild variant="outline" className="gap-2">
          <Link href="/">
            <ArrowLeft className="w-4 h-4" /> Go home
          </Link>
        </Button>
        <Button asChild className="gap-2">
          <Link href="/docs">Browse docs</Link>
        </Button>
      </div>
    </div>
  );
}
