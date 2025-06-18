import Modal from "@/components/Modal";

interface SettingModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SettingModal({ isOpen, onClose }: SettingModalProps) {
  return (
    <Modal title="Setting" isOpen={isOpen} onClose={onClose}>
      <div>Setting</div>
    </Modal>
  )
}