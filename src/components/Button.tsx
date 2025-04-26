import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

export default function Button({ children, ...props }: ButtonProps) {
  return <button className="bg-transparent border border-blue-500 text-blue-500 px-4 py-[2px] rounded-md outline-none" {...props}>{children}</button>
}
