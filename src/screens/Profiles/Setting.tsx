import Button from "@/components/Button";

export default function Setting({ onClick }: { onClick: () => void }) {
  return (
    <Button icon="fas fa-cog" onClick={(e) => {
      e.stopPropagation()
      onClick()
    }} />
  )
}