"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import { AskResponse } from "@/lib/types";
import { useState } from "react";

const CONFIDENCE_STYLE = {
  high: "bg-green-500/20 text-green-400 border-green-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  low: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  none: "bg-red-500/20 text-red-400 border-red-500/30",
};

interface Props {
  result: AskResponse;
}

export function ResultCard({ result }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result.answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        {(result.corrected_query || result.original_query) && (
          <div className="mb-3 text-xs text-muted-foreground bg-muted/50 rounded-md px-3 py-2">
            {result.original_query && result.corrected_query ? (
              <span>📝 Query corrected: <span className="line-through">{result.original_query}</span> → <span className="text-foreground">{result.corrected_query}</span></span>
            ) : result.corrected_query ? (
              <span>📝 Query corrected to: {result.corrected_query}</span>
            ) : null}
          </div>
        )}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Answer</span>
            <Badge
              variant="outline"
              className={CONFIDENCE_STYLE[result.confidence]}
            >
              confidence: {result.confidence} ●
            </Badge>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            className="h-8 px-2"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
        <Separator className="mb-4" />
        <div className="prose prose-invert prose-sm max-w-none">
          <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
            {result.answer}
          </ReactMarkdown>
        </div>
        <Separator className="my-4" />
        <div className="text-xs text-muted-foreground flex gap-4 flex-wrap">
          <span>Latency: {(result.latency_ms / 1000).toFixed(1)}s</span>
          <span>Retrieved: {result.retrieved_count} chunks</span>
          {result.rewritten_query && (
            <span>Rewritten: {result.rewritten_query}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
