import * as React from "react";
import { Toaster as SonnerToaster, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof SonnerToaster>;

/**
 * Toaster wraps Sonner with AlphaAI defaults.
 *
 * Picks up the active theme by reading the `.dark` class on the document root
 * (driven by `next-themes`), so toasts are styled correctly in both modes
 * without consumers needing to wire theme detection themselves.
 */
const Toaster = ({ className, ...props }: ToasterProps) => {
  return (
    <SonnerToaster
      className={className}
      theme="system"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
