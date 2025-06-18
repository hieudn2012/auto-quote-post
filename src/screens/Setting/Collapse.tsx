import Button from "@/components/Button";
import { useState } from "react";

export const Collapse = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(true)
  return (
    <div className="bg-white p-4 rounded-md border border-gray-100 select-none">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <p className="text-sm font-bold">{title}</p>
        <Button
          icon="fas fa-chevron-down"
          onClick={() => setIsOpen(!isOpen)}
          className={`transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-180' : ''}`}
        />
      </div>
      <div 
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-auto opacity-100 mt-4' : 'max-h-0 opacity-0'
        }`}
      >
        {children}
      </div>
    </div>
  )
}
