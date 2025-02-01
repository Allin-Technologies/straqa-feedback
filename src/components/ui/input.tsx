import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utilities/ui'

const inputVariants = cva(
  'flex transition ease-linear duration-200 focus-visible:outline-none file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-transparent border border-input shadow-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-border ring-offset-2 ring-offset-background placeholder:text-sm placeholder:leading-none',
        underline:
          'bg-transparent border-b border-[hsla(0,_0%,_88%,_1)] focus:border-[hsla(257,_59%,_78%,_1)] placeholder:text-secondary-forground',
      },
      size: {
        default: 'h-12 w-full px-3 py-1 rounded-md',
        underline: 'pb-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

export { Input, inputVariants }
