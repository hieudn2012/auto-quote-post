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
    <div className="flex gap-2">
      <div className={twMerge("px-4 py-1 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-300", selectedFolder === "" && "bg-gray-500")} onClick={() => onSelect("")}>
        All
      </div>
      {map(listFolders, (folder, index) => (
        <div key={index} className={twMerge("px-4 py-1 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-300", selectedFolder === folder && "bg-gray-500")} onClick={() => onSelect(folder)}>
          {folder}
        </div>
      ))}
    </div>
  )
}