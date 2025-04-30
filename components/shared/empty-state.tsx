"use client";

import type React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  className?: string;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({
  className,
  icon,
  title = "No data found",
  description = "There are no items to display at the moment.",
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center",
        className,
      )}
    >
      {icon && <div className="rounded-full bg-muted p-3">{icon}</div>}
      {!icon && (
        <div className="h-32 w-32 rounded-full bg-muted flex items-center justify-center">
          <img
            src="/simple-empty-box.png"
            alt="Empty state"
            className="h-20 w-20 opacity-70"
          />
        </div>
      )}
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-md">
        {description}
      </p>
      {actionLabel && actionHref && (
        <Button asChild className="mt-4">
          <a href={actionHref}>{actionLabel}</a>
        </Button>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-4">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
