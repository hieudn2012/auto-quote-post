import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { MultipleSelect } from "@/components/MultipleSelect";
import { Setting, windowInstance } from "@/types/window";
import { useFormik } from "formik";
import { useEffect, useState } from "react";

interface SettingModalProps {
  isOpen: boolean
  onClose: () => void
  profile_ids: string[]
}

const shortenCaption = (caption: string) => {
  return caption.length > 20 ? caption.slice(0, 20) + "..." : caption
}

export default function SettingModal({ isOpen, onClose, profile_ids }: SettingModalProps) {
  const { values, setFieldValue, handleSubmit } = useFormik({
    initialValues: {
      media_folder_ids: [],
      caption_ids: [],
    },
    onSubmit: (values) => {
      handleSave(values)
      onClose()
    }
  })

  const [settings, setSettings] = useState<Setting>({
    working_directory: "",
    token: "",
    captions: [],
    profiles: [],
    media_folders: [],
  })

  const handleSave = (values: { caption_ids: string[], media_folder_ids: string[] }) => {
    windowInstance.api.saveSettings({
      ...settings,
      profiles: profile_ids.map((id) => ({ id, caption_ids: values.caption_ids, media_folder_ids: values.media_folder_ids })).filter((profile) => profile.caption_ids.length > 0 && profile.media_folder_ids.length > 0),
    })
  }

  useEffect(() => {
    windowInstance.api.getSettings().then((settings) => {
      setSettings(settings)
    })
  }, [])

  return (
    <Modal title="Smart Setting" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <MultipleSelect
            options={settings.media_folders.map((folder) => ({
              label: folder.name,
              value: folder.id,
            }))}
            value={values.media_folder_ids}
            onChange={(value) => setFieldValue("media_folder_ids", value)}
          />
          <MultipleSelect
            options={settings.captions.map((caption) => ({
              label: shortenCaption(caption.caption),
              value: caption.id,
            }))}
            value={values.caption_ids}
            onChange={(value) => setFieldValue("caption_ids", value)}
          />
          <div>
            <Button icon="fa-solid fa-save" type="submit" size="medium">Save</Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}