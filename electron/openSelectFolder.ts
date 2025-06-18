import { dialog } from 'electron'

export const openSelectFolder = () => {
  return dialog.showOpenDialog({
    properties: ['openDirectory']
  });
}
