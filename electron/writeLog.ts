import fs from 'fs';
import { getFolderSystem } from './setting';

interface Browser {
  profileId: string;
  wsUrl: string;
}

export const writeBrowser = ({ profileId, wsUrl }: Browser) => {
  const folderSystem = getFolderSystem()
  const browserPath = `${folderSystem.browsers}/${profileId}.txt`;
  fs.writeFileSync(browserPath, `${wsUrl}\n`);
}

export const getBrowser = (profileId: string) => {
  const folderSystem = getFolderSystem()
  const browserPath = `${folderSystem.browsers}/${profileId}.txt`;

  // get last line
  const lines = fs.readFileSync(browserPath, 'utf8').split('\n');
  return lines[lines.length - 2];
}

export const writeHistory = ({ profileId, postUrl }: { profileId: string, postUrl: string }) => {
  const folderSystem = getFolderSystem()
  const historyPath = `${folderSystem.history}`;
  const content = `${profileId} || ${postUrl} || ${new Date().toISOString()}\n`;
  fs.appendFileSync(historyPath, content);
}
