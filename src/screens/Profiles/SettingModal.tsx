import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { MultipleSelect } from "@/components/MultipleSelect";
import { Setting, windowInstance } from "@/types/window";
import { useFormik } from "formik";
import { useEffect, useState } from "react";

interface SettingModalProps {
  isOpen: boolean
  onClose: () => void
  profile_id: string
}

const shortenCaption = (caption: string) => {
  return caption.length > 20 ? caption.slice(0, 20) + "..." : caption
}

export default function SettingModal({ isOpen, onClose, profile_id }: SettingModalProps) {
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
    url: "",
    token: "",
    captions: [],
    profiles: [],
    media_folders: [],
  })

  const handleSave = (values: { caption_ids: string[], media_folder_ids: string[] }) => {
    windowInstance.api.saveSettings({
      ...settings,
      profiles: settings.profiles.map((profile) => ({
        ...profile,
        caption_ids: profile.id === profile_id ? values.caption_ids : profile.caption_ids,
        media_folder_ids: profile.id === profile_id ? values.media_folder_ids : profile.media_folder_ids,
      })),
    })
  }

  useEffect(() => {
    if (isOpen) {
      windowInstance.api.getSettings().then((settings) => {
        setSettings(settings)
        
        const profile = settings.profiles.find(p => p.id === profile_id)
        if (profile) {
          setFieldValue("media_folder_ids", profile.media_folder_ids || [])
          setFieldValue("caption_ids", profile.caption_ids || [])
        } else {
          setFieldValue("media_folder_ids", [])
          setFieldValue("caption_ids", [])
        }
      })
    }
  }, [isOpen, profile_id, setFieldValue])

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