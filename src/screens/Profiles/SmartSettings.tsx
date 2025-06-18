import Button from "../../components/Button"

interface SmartSettingsProps {
  onClick: () => void
}

export const SmartSettings = ({ onClick }: SmartSettingsProps) => {
  return (
    <div>
      <Button icon="fas fa-cog" onClick={onClick}>
        Smart Settings
      </Button>
    </div>
  )
}