import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement> & { onValueChange?: (value: string) => void }>(
  ({ className, onValueChange, children, value, defaultValue, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          value={value}
          defaultValue={defaultValue}
          onChange={(e) => onValueChange?.(e.target.value)}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none",
            className
          )}
          aria-label={props["aria-label"] || "Select option"}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="absolute right-3 top-3 h-4 w-4 opacity-50 pointer-events-none" aria-hidden="true" />
      </div>
    )
  }
)
Select.displayName = "Select"

const SelectContent = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

const SelectItem = React.forwardRef<HTMLOptionElement, React.OptionHTMLAttributes<HTMLOptionElement>>(
  ({ className, ...props }, ref) => (
    <option ref={ref} className={className} {...props} />
  )
)
SelectItem.displayName = "SelectItem"

const SelectTrigger = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

const SelectValue = ({ placeholder }: { placeholder?: string }) => {
  return <option value="" disabled hidden>{placeholder}</option>
}

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue }
