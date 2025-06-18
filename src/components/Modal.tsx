import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'

interface ModalProps {
  children: React.ReactNode
  title: string
  isOpen: boolean
  onClose: () => void
}

export default function Modal({ children, title, isOpen, onClose }: ModalProps) {
  return (
    <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={onClose} __demoMode>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300" />
      
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="w-full max-w-md rounded-xl bg-white p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
          >
            <DialogTitle as="h3" className="text-base/7 font-bold">
              {title}
            </DialogTitle>
            <div className="mt-4">
              {children}
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}
