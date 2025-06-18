import Button from "@/components/Button";
import { useState } from "react";

export const Collapse = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="bg-white rounded-md border border-gray-100 select-none">
      <div className="flex items-center justify-between cursor-pointer p-4 hover:bg-gray-100" onClick={() => setIsOpen(!isOpen)}>
        <p className="text-sm font-bold">{title}</p>
        <Button
          icon={isOpen ? 'fas fa-chevron-up' : 'fas fa-chevron-down'}
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>
      {isOpen && (
        <div className="p-4">
          {children}
        </div>
      )}
    </div>
  )
}
