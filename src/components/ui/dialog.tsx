// @@filename: src/components/ui/dialog.tsx
   import React from 'react'
   import * as DialogPrimitive from '@radix-ui/react-dialog'
   import { cn } from '@/lib/utils'

   export const Dialog = DialogPrimitive.Root

   export const DialogContent = React.forwardRef<
     React.ElementRef<typeof DialogPrimitive.Content>,
     React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
   >(({ className, children, ...props }, ref) => (
     <DialogPrimitive.Content
       ref={ref}
       className={cn(
         'fixed z-50 grid w-full gap-4 rounded-b-lg border bg-background p-6 shadow-lg animate-in data-[state=open]:fade-in-90 data-[state=open]:slide-in-from-bottom-10 sm:max-w-lg sm:rounded-lg sm:zoom-in-90 data-[state=open]:sm:slide-in-from-bottom-0',
         className
       )}
       {...props}
     >
       {children}
     </DialogPrimitive.Content>
   ))
   DialogContent.displayName = DialogPrimitive.Content.displayName