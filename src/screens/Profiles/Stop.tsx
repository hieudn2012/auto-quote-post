import Button from "@/components/Button"

interface StopProps {
  onClick: () => void
}

export default function Stop({ onClick }: StopProps) {

  const handleClick = async () => {
    onClick()
  }

  return (
    <Button
      color="error"
      icon="fa-solid fa-stop"
      onClick={handleClick}
    />
  )
}