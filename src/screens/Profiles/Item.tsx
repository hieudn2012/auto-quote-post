import Checkbox from "@/components/Checkbox";
// import ProfileStatus from "@/components/ProfileStatus";
import { Profile } from "@/services/profile.service"
import Stop from "./Stop";
import Run from "./Run";
import Setting from "./Setting";
import { Setting as SettingType } from "@/types/window";
import { find } from "lodash";
import { LastPost } from "@/components/LastPost";
import { Column } from "./CustomShowColumn";
interface ItemProps {
  profile: Profile;
  selected: boolean;
  onSelect: (profile: Profile) => void;
  onRun: (profile: Profile) => void;
  onStop: (profile: Profile) => void;
  onSetting: (profile: Profile) => void;
  settings: SettingType;
  checkedColumns: Column[];
}

const Item = ({ profile, selected, onSelect, onRun, onStop, onSetting, settings, checkedColumns }: ItemProps) => {
  const profileSetting = find(settings.profiles, { id: profile.id })
  const groupSetting = find(settings.groups, { id: profileSetting?.group_id })
  const isValid = !!profileSetting?.group_id

  return (
    <div
      className="flex flex-col gap-2 p-2 border border-gray-100 rounded-md cursor-pointer hover:border-primary transition-all duration-300 select-none"
      onClick={() => onSelect(profile)}
    >
      <div className="flex items-center gap-2">
        <div className="w-5 h-5">
          <Checkbox checked={selected} onChange={() => onSelect(profile)} />
        </div>
        <ProviderColumn name={Column.NAME} checkedColumns={checkedColumns}>
          <div className="text-sm font-medium w-[100px]">{profile.name}</div>
        </ProviderColumn>
        <ProviderColumn name={Column.NOTES} checkedColumns={checkedColumns}>
          <div className="text-sm font-medium w-[200px]">
            <div dangerouslySetInnerHTML={{ __html: profile.notes }} />
          </div>
        </ProviderColumn>
        <ProviderColumn name={Column.PROXY} checkedColumns={checkedColumns}>
          <div className="text-sm font-medium w-[50px]">{profile.proxy.port}</div>
        </ProviderColumn>
        <ProviderColumn name={Column.GROUP} checkedColumns={checkedColumns}>
          <div className="text-sm font-medium w-[100px]">
            {groupSetting?.name || '-'}
          </div>
        </ProviderColumn>
        <div>
          {isValid ? <i className="fa-solid fa-check-circle text-green-500" /> : <i className="fa-solid fa-exclamation-triangle text-red-500" />}
        </div>
        <LastPost profileId={profile.id} />
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

const ProviderColumn = ({ children, name, checkedColumns }: { children: React.ReactNode, name: Column, checkedColumns: Column[] }) => {
  const isVisible = checkedColumns.includes(name)
  if (!isVisible) return null
  return (
    <>
      {children}
    </>
  )
}

export default Item