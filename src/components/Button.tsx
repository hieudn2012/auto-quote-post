import { ButtonHTMLAttributes, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

type ButtonSize = 'small' | 'medium' | 'large'
type ButtonColor = 'info' | 'success' | 'warning' | 'error'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode
  size?: ButtonSize
  icon?: string
  color?: ButtonColor
}

export default function Button({ children, size = 'small', icon, color = 'info', ...props }: ButtonProps) {
  const sizeClasses = {
    small: 'text-xs px-2 py-1',
    medium: 'text-sm px-4 py-[6px]',
    large: 'text-base px-6 py-2'
  }

  const colorClasses = {
    info: 'bg-blue-500 text-white',
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-white',
    error: 'bg-red-500 text-white'
  }
  return (
    <button
      className={twMerge(
        `flex items-center gap-2 font-bold bg-transparent border-2 rounded-md outline-none`,
        sizeClasses[size],
        colorClasses[color],
        'hover:opacity-80',
      )}
      {...props}
    >
      {icon && <i className={`${icon}`}></i>}
      {children}
    </button>
  )
}
