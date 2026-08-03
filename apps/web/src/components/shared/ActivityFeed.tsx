import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

export interface ActivityFeedItem {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  icon?: React.ReactNode;
  statusNode?: React.ReactNode;
}

export interface ActivityFeedProps {
  title?: string;
  items: ActivityFeedItem[];
  emptyMessage?: string;
  className?: string;
}

export function ActivityFeed({ title = "Recent Activity", items, emptyMessage = "No recent activity.", className }: ActivityFeedProps) {
  return (
    <Card className={cn("flex flex-col h-full", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold tracking-tight">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-[300px] w-full">
          {items.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground border-t border-dashed">
              {emptyMessage}
            </div>
          ) : (
            <div className="flex flex-col">
              {items.map((item, i) => (
                <div 
                  key={item.id} 
                  className={cn(
                    "flex items-start gap-4 p-4 hover:bg-muted/50 transition-colors",
                    i !== 0 && "border-t"
                  )}
                >
                  {item.icon && (
                    <div className="mt-0.5 rounded-full bg-background border p-1.5 shadow-sm text-muted-foreground flex-shrink-0">
                      {item.icon}
                    </div>
                  )}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium leading-none">{item.title}</p>
                      {item.statusNode}
                    </div>
                    {item.description && (
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground">{item.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
