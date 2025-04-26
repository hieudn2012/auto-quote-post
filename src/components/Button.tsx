import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

export default function Button({ children, ...props }: ButtonProps) {
  return <button className="bg-blue-500 text-white px-4 py-1 rounded-md outline-none" {...props}>{children}</button>
}
