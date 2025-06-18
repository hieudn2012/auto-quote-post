import Checkbox from "@/components/Checkbox";
import ProfileStatus from "@/components/ProfileStatus";
import { Profile } from "@/services/profile.service"
import Stop from "./Stop";
import Run from "./Run";
import Setting from "./Setting";

interface ItemProps {
  profile: Profile;
  selected: boolean;
  onSelect: (profile: Profile) => void;
  onRun: (profile: Profile) => void;
  onStop: (profile: Profile) => void;
  onSetting: (profile: Profile) => void;
}

const Item = ({ profile, selected, onSelect, onRun, onStop, onSetting }: ItemProps) => {
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
        <div className="flex-1" id={`profile-message-${profile.id}`}></div>
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