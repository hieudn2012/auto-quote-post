import { ButtonHTMLAttributes, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

type ButtonSize = 'small' | 'medium' | 'large'
type ButtonColor = 'primary' | 'info' | 'success' | 'warning' | 'error'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode
  size?: ButtonSize
  icon?: string
  color?: ButtonColor
  loading?: boolean
}

export default function Button({ children, size = 'small', icon, color = 'primary', loading = false, ...props }: ButtonProps) {
  const sizeClasses = {
    small: 'text-xs px-4 py-2',
    medium: 'text-sm px-4 py-[6px]',
    large: 'text-base px-6 py-2'
  }

  const colorClasses = {
    primary: 'border-2 border-blue-500 text-blue-600 hover:bg-blue-50',
    info: 'border-2 border-blue-400 text-blue-500 hover:bg-blue-50',
    success: 'border-2 border-green-400 text-green-600 hover:bg-green-50',
    warning: 'border-2 border-yellow-400 text-yellow-600 hover:bg-yellow-50',
    error: 'border-2 border-red-400 text-red-600 hover:bg-red-50'
  }
  return (
    <button
      className={twMerge(
        `flex items-center gap-2 font-bold bg-transparent rounded-md outline-none`,
        sizeClasses[size],
        colorClasses[color],
        'transition-all duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'shadow-md'
      )}
      {...props}
      disabled={loading || props.disabled}
    >
      {loading && <i className="fa-solid fa-spinner fa-spin"></i>}
      {icon && <i className={`${icon}`}></i>}
      {children}
    </button>
  )
}
