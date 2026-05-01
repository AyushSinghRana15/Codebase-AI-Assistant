"use client";

import { AlertCircle, RefreshCw } from "lucide-react";

interface Props {
  message: string;
  onRetry: () => void;
}

export function ErrorBanner({ message, onRetry }: Props) {
  return (
    <div
      className="w-full rounded-xl p-5 flex items-center justify-between"
      style={{
        border: "1px solid rgba(239,68,68,0.2)",
        background: "rgba(239,68,68,0.05)",
      }}
    >
      <div className="flex items-center gap-3">
        <AlertCircle className="h-5 w-5 text-red-500" />
        <span className="text-sm text-red-500">{message}</span>
      </div>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-500 rounded-lg transition-colors hover:bg-red-500/10"
        style={{ border: "1px solid rgba(239,68,68,0.3)" }}
      >
        <RefreshCw className="h-3.5 w-3.5" />
        Retry
      </button>
    </div>
  );
}
