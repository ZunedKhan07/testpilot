import fs from "fs";
import path from "path";

export interface TestPilotConfig {
  projectId?: string;
  serverUrl: string;
  geminiApiKey: string;
  autoFixOnStart: boolean;
  createdAt: string;
}

const CONFIG_FILE_NAME = "testpilot.config.json";

export const getConfigFilepath = (): string => {
  return path.join(process.cwd(), CONFIG_FILE_NAME);
};

export const configExists = (): boolean => {
  return fs.existsSync(getConfigFilepath());
};

export const saveConfig = (config: TestPilotConfig): void => {
  const filePath = getConfigFilepath();
  fs.writeFileSync(filePath, JSON.stringify(config, null, 2), "utf-8");
};

export const loadConfig = (): TestPilotConfig | null => {
  if (!configExists()) return null;
  try {
    const rawData = fs.readFileSync(getConfigFilepath(), "utf-8");
    return JSON.parse(rawData) as TestPilotConfig;
  } catch (error) {
    return null;
  }
};