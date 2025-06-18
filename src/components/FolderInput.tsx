import { InputHTMLAttributes, useState } from "react";
import Button from "./Button";
import { windowInstance } from "@/types/window";

interface FolderInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  onChange: (value: string) => void;
}

export const FolderInput = ({ label, onChange, ...props }: FolderInputProps) => {
  const [path, setPath] = useState(props.value)

  const handleClick = async () => {
    windowInstance.api.openSelectFolder().then((result) => {
      if (!result.canceled && result.filePaths.length > 0) {
        const resultPath = result.filePaths[0]
        setPath(resultPath)
        onChange(resultPath)
      }
    })
  }

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <div className="flex items-center gap-2">
        <input
          {...props}
          readOnly
          value={path}
          className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
        <Button
          type="button"
          size="small"
          icon="fas fa-folder"
          onClick={handleClick}
        />
      </div>
    </div>
  )
}