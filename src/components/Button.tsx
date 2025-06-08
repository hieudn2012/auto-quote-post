import { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonSize = 'small' | 'medium' | 'large'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  size?: ButtonSize
  icon?: string
}

export default function Button({ children, size = 'small', icon, ...props }: ButtonProps) {
  const sizeClasses = {
    small: 'text-xs px-2 py-1',
    medium: 'text-sm px-4 py-[6px]',
    large: 'text-base px-6 py-2'
  }

  return (
    <button
      className={`font-bold bg-transparent border-2 border-blue-500 text-blue-500 rounded-md outline-none hover:bg-blue-500 hover:text-white transition-colors duration-200 ${sizeClasses[size]}`}
      {...props}
    >
      {icon && <i className={`mr-2 ${icon}`}></i>}
      {children}
    </button>
  )
}
