import Modal from "@/components/Modal";

interface PreviewProps {
  isOpen: boolean
  onClose: () => void
  src: string
}

export default function Preview({ isOpen, onClose, src }: PreviewProps) {
  return (
    <Modal
      title={`Preview`}
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-xl"
    >
      <div>
        <img src={src} alt="Preview" />
      </div>
    </Modal>
  )
}