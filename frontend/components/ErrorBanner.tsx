"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  message: string;
  onRetry: () => void;
}

export function ErrorBanner({ message, onRetry }: Props) {
  return (
    <div className="w-full border border-destructive/50 bg-destructive/10 rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <AlertCircle className="h-4 w-4 text-destructive" />
        <span className="text-sm text-destructive">{message}</span>
      </div>
      <Button size="sm" variant="outline" onClick={onRetry}>
        <RefreshCw className="h-3 w-3 mr-2" />
        Retry
      </Button>
    </div>
  );
}
