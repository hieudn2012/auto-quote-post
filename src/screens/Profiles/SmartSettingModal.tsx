import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { Select } from "@/components/Select";
import { useGetSettings } from "@/services/setting.service";
import { windowInstance } from "@/types/window";
import { useFormik } from "formik";
import { map } from "lodash";

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

  const { groups } = useGetSettings()

  const handleSave = async (values: { group_id: string }) => {
    const settings = await windowInstance.api.getSettings()
    const newProfiles = profile_ids.map((id) => ({ id, group_id: values.group_id }))
    const oldProfiles = settings.profiles.filter((profile) => !profile_ids.includes(profile.id))

    windowInstance.api.saveSettings({
      ...settings,
      profiles: [...oldProfiles, ...newProfiles],
    })
  }

  return (
    <Modal title="Smart Setting" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <Select
            options={map(groups, (group) => ({
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