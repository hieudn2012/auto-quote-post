import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { Select } from "@/components/Select";
import { windowInstance } from "@/types/window";
import { useFormik } from "formik";
import { map } from "lodash";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useSetting } from "@/services/setting.service";
interface SettingModalProps {
  isOpen: boolean
  onClose: () => void
  profile_id: string
}

export default function SettingModal({ isOpen, onClose, profile_id }: SettingModalProps) {
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

    const profile = settings.profiles.find(p => p.id === profile_id)
    if (!profile) {
      const newProfile = {
        id: profile_id,
        group_id: values.group_id,
      }
      const newProfiles = [...settings.profiles, newProfile]
      const result = {
        ...settings,
        profiles: newProfiles,
      }
      setSettings(result)
      windowInstance.api.saveSettings(result)
      toast.success("Profile settings created")
      return
    }

    const newProfiles = settings.profiles.map((profile) => ({
      ...profile,
      group_id: profile.id === profile_id ? values.group_id : profile.group_id,
    }))
    const result = {
      ...settings,
      profiles: newProfiles,
    }
    setSettings(result)
    windowInstance.api.saveSettings(result)
    toast.success("Profile settings saved")
  }

  useEffect(() => {
    if (isOpen) {
      windowInstance.api.getSettings().then((settings) => {
        const profile = settings.profiles.find(p => p.id === profile_id)
        if (profile) {
          setFieldValue("group_id", profile.group_id || "")
        }
      })
    }
  }, [isOpen, profile_id, setFieldValue, settings])

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