import Button from "@/components/Button";
import { useState } from "react";

interface CollapseProps {
  title: string;
  children: React.ReactNode;
  icon: string;
}

export const Collapse = ({ title, children, icon }: CollapseProps) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="bg-white rounded-md border-2 border-gray-100 select-none shadow-md">
      <div className="flex items-center justify-between cursor-pointer p-4 hover:bg-gray-100" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center gap-2">
          <i className={`${icon} text-sm`}></i>
          <p className="text-sm font-bold">{title}</p>
        </div>
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
