"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const MESSAGES = [
  "Searching codebase...",
  "Retrieving relevant chunks...",
  "Reranking results...",
  "Generating answer...",
];

export function LoadingState() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm text-muted-foreground">
            {MESSAGES[messageIndex]}
          </span>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[90%]" />
          <Skeleton className="h-4 w-[95%]" />
          <Skeleton className="h-4 w-[70%]" />
        </div>
      </CardContent>
    </Card>
  );
}
