import { Fragment } from 'react'
import { twMerge } from 'tailwind-merge'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from '@headlessui/react'

interface ModalProps {
  children: React.ReactNode
  title: string
  isOpen: boolean
  onClose: () => void
  className?: string
}

export default function Modal({ children, title, isOpen, onClose, className }: ModalProps) {
  return (
    <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={onClose} __demoMode>
      <TransitionChild
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        {/* Backdrop with enhanced animation */}
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      </TransitionChild>
      
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel
              className={twMerge(
                "w-full max-w-md rounded-xl bg-white p-6 shadow-2xl backdrop-blur-2xl",
                "transform transition-all duration-300 ease-out",
                className
              )}
            >
              <DialogTitle as="h3" className="text-base/7 font-bold">
                {title}
              </DialogTitle>
              <div className="mt-4">
                {children}
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  )
}
