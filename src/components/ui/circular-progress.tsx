
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const circularProgressVariants = cva(
  "radial-progress",
  {
    variants: {
      variant: {
        default: "",
        primary: "text-primary",
        secondary: "text-secondary",
        accent: "text-accent",
        success: "text-success",
        warning: "text-warning",
        info: "text-info",
        error: "text-error",
      },
      size: {
        default: "w-24 h-24",
        xs: "w-6 h-6",
        sm: "w-12 h-12",
        lg: "w-36 h-36",
        xl: "w-48 h-48",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface CircularProgressProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof circularProgressVariants> {
  value: number;
}

const CircularProgress = React.forwardRef<
  HTMLDivElement,
  CircularProgressProps
>(({ className, variant, size, value, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        circularProgressVariants({ variant, size, className }),
        "relative"
      )}
      {...props}
    >
      <div
        className="absolute top-0 left-0 w-full h-full rounded-full bg-gray-200"
      ></div>
      <div
        className="absolute top-0 left-0 w-full h-full rounded-full border-transparent border-t-current -rotate-90 origin-center"
        style={{ transform: `rotate(${(value / 100) * 360 - 90}deg)` }}
      ></div>
      <div
        className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-sm font-medium"
      >
        {value}%
      </div>
    </div>
  );
});
CircularProgress.displayName = "CircularProgress";

export { CircularProgress };

