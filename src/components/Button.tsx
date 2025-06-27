import { ButtonHTMLAttributes, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

type ButtonSize = 'small' | 'medium' | 'large'
type ButtonColor = 'primary' | 'info' | 'success' | 'warning' | 'error'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode
  size?: ButtonSize
  icon?: string
  color?: ButtonColor
}

export default function Button({ children, size = 'small', icon, color = 'primary', ...props }: ButtonProps) {
  const sizeClasses = {
    small: 'text-xs px-4 py-2',
    medium: 'text-sm px-4 py-[6px]',
    large: 'text-base px-6 py-2'
  }

  const colorClasses = {
    primary: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white',
    info: 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white',
    success: 'bg-gradient-to-r from-green-400 to-emerald-500 text-white',
    warning: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white',
    error: 'bg-gradient-to-r from-red-400 to-pink-500 text-white'
  }
  return (
    <button
      className={twMerge(
        `flex items-center gap-2 font-bold bg-transparent rounded-md outline-none`,
        sizeClasses[size],
        colorClasses[color],
        'hover:opacity-80 transition-opacity duration-200',
      )}
      {...props}
    >
      {icon && <i className={`${icon}`}></i>}
      {children}
    </button>
  )
}
