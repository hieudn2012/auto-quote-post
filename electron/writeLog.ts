import fs from 'fs';
import { getFolderSystem } from './setting';

interface Browser {
  profileId: string;
  wsUrl: string;
}

export const writeBrowser = ({ profileId, wsUrl }: Browser) => {
  const folderSystem = getFolderSystem()
  const browserPath = `${folderSystem.browsers}/${profileId}.txt`;
  if (!fs.existsSync(browserPath)) {
    fs.writeFileSync(browserPath, '');
  }

  fs.appendFileSync(browserPath, `${wsUrl}\n`);
}

export const getBrowser = (profileId: string) => {
  const folderSystem = getFolderSystem()
  const browserPath = `${folderSystem.browsers}/${profileId}.txt`;

  // get last line
  const lines = fs.readFileSync(browserPath, 'utf8').split('\n');
  return lines[lines.length - 2];
}
