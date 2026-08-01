import * as React from "react"
import { cn } from "@/lib/utils"

export interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Timeline({ className, ...props }: TimelineProps) {
  return (
    <div
      className={cn("flex flex-col space-y-4", className)}
      {...props}
    />
  )
}

export interface TimelineItemProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  time?: string;
  description?: string;
  isActive?: boolean;
}

export function TimelineItem({
  className,
  icon,
  title,
  time,
  description,
  isActive = false,
  ...props
}: TimelineItemProps) {
  return (
    <div
      className={cn("relative pl-8 pb-4 last:pb-0", className)}
      {...props}
    >
      <div className={cn(
        "absolute left-0 top-1.5 h-full w-px bg-border",
        "last:hidden" // Need to handle last child carefully in parent
      )} />
      <div className={cn(
        "absolute left-[-4px] top-1.5 h-2.5 w-2.5 rounded-full border-2",
        isActive ? "border-primary bg-primary" : "border-muted-foreground bg-background"
      )} />
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          {icon}
          <p className={cn("text-sm font-medium leading-none", isActive && "text-primary")}>
            {title}
          </p>
          {time && <span className="text-xs text-muted-foreground ml-auto">{time}</span>}
        </div>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}
