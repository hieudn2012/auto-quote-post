import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

export default function Button({ children, ...props }: ButtonProps) {
  return (
    <button
      className="bg-transparent border-2 border-blue-500 text-blue-500 px-4 py-[2px] rounded-md outline-none hover:bg-blue-500 hover:text-white transition-colors duration-200"
      {...props}
    >
      {children}
    </button>
  )
}
