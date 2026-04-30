"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  disabled: boolean;
}

export function QueryInput({ value, onChange, onSubmit, disabled }: Props) {
  const [isComposing, setIsComposing] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault();
      if (value.trim()) onSubmit();
    }
  };

  return (
    <div className="relative w-full">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        placeholder="Ask anything about your codebase..."
        disabled={disabled}
        className="min-h-[60px] pr-12 resize-none"
        rows={2}
        maxLength={1000}
      />
      <Button
        size="icon"
        onClick={onSubmit}
        disabled={disabled || !value.trim()}
        className="absolute right-2 bottom-2 h-8 w-8"
      >
        <ArrowUp className="h-4 w-4" />
      </Button>
      {value.length > 800 && (
        <span className="absolute right-14 bottom-2 text-xs text-muted-foreground">
          {value.length}/1000
        </span>
      )}
    </div>
  );
}
