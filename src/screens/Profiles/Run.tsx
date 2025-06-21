import Button from "@/components/Button"

interface RunProps {
  onClick: () => void
  id: string
}

export default function Run({ onClick }: RunProps) {
  return (
    <Button
      color="success"
      icon="fa-solid fa-play"
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
    />
  )
}