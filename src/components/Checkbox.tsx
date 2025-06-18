import { Checkbox as HeadlessCheckbox } from '@headlessui/react'
import { twMerge } from 'tailwind-merge'


export default function Checkbox({ checked, onChange }: { checked: boolean, onChange: (checked: boolean) => void }) {
  return (
    <HeadlessCheckbox
      checked={checked}
      onChange={onChange}
      className={twMerge("group block size-4 rounded border bg-white data-checked:bg-primary", checked && "bg-primary")}
    />
  )
}
