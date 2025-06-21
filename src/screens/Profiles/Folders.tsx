import { Profile } from "@/services/profile.service"
import { uniq, map } from "lodash"
import { twMerge } from "tailwind-merge"
interface FoldersProps {
  profiles: Profile[]
  selectedFolder: string
  onSelect: (folder: string) => void
}

export const Folders = ({ profiles, selectedFolder, onSelect }: FoldersProps) => {
  const listFolders = uniq(map(profiles, 'folders').flat())

  return (
    <div className="flex gap-2 flex-wrap">
      <div className={twMerge("flex items-center gap-2 px-4 py-1 border border-gray-200 rounded-md cursor-pointer hover:border-primary", selectedFolder === "" && "border-primary")} onClick={() => onSelect("")}>
        {selectedFolder === "" && <i className="fa-solid fa-check-circle text-green-500" />}
        All
      </div>
      {map(listFolders, (folder, index) => (
        <div key={index} className={twMerge("flex items-center gap-2 px-4 py-1 border border-gray-200 rounded-md cursor-pointer hover:border-primary", selectedFolder === folder && "border-primary")} onClick={() => onSelect(folder)}>
          {selectedFolder === folder && <i className="fa-solid fa-check-circle text-green-500" />}
          {folder}
        </div>
      ))}
    </div>
  )
}