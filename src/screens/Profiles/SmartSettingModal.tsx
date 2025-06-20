import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { Select } from "@/components/Select";
import { windowInstance } from "@/types/window";
import { useFormik } from "formik";
import { map } from "lodash";
import { useSetting } from "@/services/setting.service";
interface SettingModalProps {
  isOpen: boolean
  onClose: () => void
  profile_ids: string[]
}

export default function SettingModal({ isOpen, onClose, profile_ids }: SettingModalProps) {
  const { values, setFieldValue, handleSubmit } = useFormik({
    initialValues: {
      group_id: "",
    },
    onSubmit: (values) => {
      handleSave(values)
      onClose()
    }
  })

  const { settings, setSettings } = useSetting()

  const handleSave = async (values: { group_id: string }) => {
    const settings = await windowInstance.api.getSettings()
    const newProfiles = profile_ids.map((id) => ({ id, group_id: values.group_id }))
    const oldProfiles = settings.profiles.filter((profile) => !profile_ids.includes(profile.id))

    const result = {
      ...settings,
      profiles: [...oldProfiles, ...newProfiles],
    }
    setSettings(result)
    windowInstance.api.saveSettings(result)
  }

  return (
    <Modal title="Smart Setting" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <Select
            options={map(settings.groups, (group) => ({
              label: group.name,
              value: group.id,
            }))}
            value={values.group_id}
            onChange={(value) => setFieldValue("group_id", value)}
          />
          <div>
            <Button icon="fa-solid fa-save" type="submit" size="medium">Save</Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}