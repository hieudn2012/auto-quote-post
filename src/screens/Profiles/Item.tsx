import Checkbox from "@/components/Checkbox";
import ProfileStatus from "@/components/ProfileStatus";
import { Profile } from "@/services/profile.service"
import Stop from "./Stop";
import Run from "./Run";
import Setting from "./Setting";
import { useEffect, useMemo, useState } from "react";
import { windowInstance } from "@/types/window";
import { ProfileSetting } from "@/types/window";
import { size } from "lodash";
interface ItemProps {
  profile: Profile;
  selected: boolean;
  onSelect: (profile: Profile) => void;
  onRun: (profile: Profile) => void;
  onStop: (profile: Profile) => void;
  onSetting: (profile: Profile) => void;
}

const Item = ({ profile, selected, onSelect, onRun, onStop, onSetting }: ItemProps) => {
  const [setting, setSetting] = useState<ProfileSetting | null>(null)

  useEffect(() => {
    windowInstance.api.getSettingByProfileId(profile.id).then((setting) => {
      setSetting(setting)
    })
  }, [profile.id])

  const hasMediaFolder = size(setting?.media_folder_ids) > 0
  const hasCaption = size(setting?.caption_ids) > 0
  const isInvalid = hasMediaFolder && hasCaption

  return (
    <div
      className="flex flex-col gap-2 p-2 border border-gray-100 rounded-md cursor-pointer hover:border-primary transition-all duration-300 select-none"
      onClick={() => onSelect(profile)}
    >
      <div className="flex items-center gap-2">
        <div className="w-5 h-5">
          <Checkbox checked={selected} onChange={() => onSelect(profile)} />
        </div>
        <div className="text-sm font-medium w-[100px]">{profile.name}</div>
        <div className="text-sm font-medium w-[200px]">
          <div dangerouslySetInnerHTML={{ __html: profile.notes }} />
        </div>
        <div className="text-sm font-medium w-[50px]">{profile.proxy.port}</div>
        <div className="text-sm font-medium w-[100px]">
          <ProfileStatus id={profile.id} />
        </div>
        <div>
          {!isInvalid ? <i className="fa-solid fa-exclamation-triangle text-red-500" /> : <i className="fa-solid fa-check-circle text-green-500" />}
        </div>
        <div className="flex-1 text-sm" id={`profile-message-${profile.id}`}></div>
        <div className="flex gap-2">
          <Setting onClick={() => onSetting(profile)} />
          <Run id={profile.id} onClick={() => onRun(profile)} />
          <Stop onClick={() => onStop(profile)} />
        </div>
      </div>
    </div>
  )
}

export default Item