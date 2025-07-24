import * as React from "react"
import { cn } from "@/app/lib/utils"

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue"> {
  value?: string | number | readonly string[]
  defaultValue?: string | number | readonly string[]
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, value, defaultValue, ...props }, ref) => {
    // Handle NaN values for number inputs
    const sanitizedValue = type === 'number' && typeof value === 'number' && isNaN(value) 
      ? '' 
      : value

    const inputProps = {
      ...(sanitizedValue !== undefined ? { value: sanitizedValue } : { defaultValue }),
      type,
      className: cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      ),
      ref,
      ...props,
    }

    return <input {...inputProps} />
  }
)

Input.displayName = "Input"

export { Input }