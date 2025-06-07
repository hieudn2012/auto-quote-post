import fs from 'fs';

interface History {
  profileId: string;
  message: string;
  dateTime: string;
}

interface Browser {
  profileId: string;
  wsUrl: string;
}

interface Error {
  profileId: string;
  error: string;
}

export const writeHistory = ({ profileId, message, dateTime }: History) => {
  const historyPath = `store/histories/${profileId}.txt`;
  if (!fs.existsSync(historyPath)) {
    fs.writeFileSync(historyPath, '');
  }

  fs.appendFileSync(historyPath, `${profileId} || ${message} || ${dateTime}\n`);
}

export const writeBrowser = ({ profileId, wsUrl }: Browser) => {
  const browserPath = `store/browsers/${profileId}.txt`;
  if (!fs.existsSync(browserPath)) {
    fs.writeFileSync(browserPath, '');
  }

  fs.appendFileSync(browserPath, `${wsUrl}\n`);
}

export const writeError = ({ profileId, error }: Error) => {
  const errorPath = `store/errors/${profileId}.txt`;
  if (!fs.existsSync(errorPath)) {
    fs.writeFileSync(errorPath, '');
  }

  fs.appendFileSync(errorPath, `${profileId} || ${error} || ${new Date().toISOString()}\n`);
}

export const getAllHistory = () => {
  const historyPath = `store/histories/`;
  if (!fs.existsSync(historyPath)) {
    return [];
  }

  const files = fs.readdirSync(historyPath);
  const allHistory: string[] = [];
  
  for (const file of files) {
    const filePath = `${historyPath}${file}`;
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const lines = fileContent.split('\n').filter(line => line.trim());
    allHistory.push(...lines);
  }

  return allHistory;
}

export const getAllError = () => {
  const errorPath = `store/errors/`;
  if (!fs.existsSync(errorPath)) {
    return [];
  }

  const files = fs.readdirSync(errorPath);
  const allError: string[] = [];
  
  for (const file of files) {
    const filePath = `${errorPath}${file}`;
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const lines = fileContent.split('\n').filter(line => line.trim());
    allError.push(...lines);
  }

  return allError;
}

export const getBrowser = (profileId: string) => {
  const browserPath = `store/browsers/${profileId}.txt`;

  // get last line
  const lines = fs.readFileSync(browserPath, 'utf8').split('\n');
  return lines[lines.length - 2];
}
