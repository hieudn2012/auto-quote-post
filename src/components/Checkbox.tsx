import { Checkbox as HeadlessCheckbox } from '@headlessui/react'
import { twMerge } from 'tailwind-merge'

interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  className?: string
  label?: string
}

export default function Checkbox({ checked, onChange, className, label }: CheckboxProps) {
  return (
    <div className="flex items-center gap-2 cursor-pointer select-none hover:text-primary" onClick={() => onChange(!checked)}>
      <HeadlessCheckbox
        checked={checked}
        onChange={onChange}
        className={twMerge("group block size-4 rounded border bg-white data-checked:bg-primary", checked && "bg-primary", className)}
      />
      {label && <label className="cursor-pointer">{label}</label>}
    </div>
  )
}
