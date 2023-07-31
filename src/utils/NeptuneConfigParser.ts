import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export interface NeptuneAuthenticationCredentials {
  email: string;
  password: string;
}

export interface NeptuneSenderInfo {
  email: string;
  name: string;
}

export interface NeptuneServerConfig {
  host: string;
  port: number;
  secureSSL: boolean;
  authentication: NeptuneAuthenticationCredentials;
  sender: NeptuneSenderInfo;
}

interface Configurations {
  [key: string]: NeptuneServerConfig;
}

class NeptuneConfigParser {
  private configurations: Configurations;

  constructor(configFile: string) {
    this.configurations = this.loadConfigurations(configFile);
  }
  private loadConfigurations(configFile: string): { [key: string]: NeptuneServerConfig } {
    const configPath = path.resolve(configFile);
    const fileContent = fs.readFileSync(configPath, 'utf-8');
    return this.parseConfigurations(fileContent);
  }

  private parseConfigurations(fileContent: string): { [key: string]: NeptuneServerConfig } {
    const configurations: { [key: string]: NeptuneServerConfig } = {};
    const lines = fileContent.split('\n');
    let currentConfig: string | null = null;
    let currentAuth: NeptuneAuthenticationCredentials | null = null;
    let currentSender: NeptuneSenderInfo | null = null;

    for (const line of lines) {
      const trimmedLine = line.trim();

      if (trimmedLine) {
        if (trimmedLine.endsWith('{')) {
          const configName = trimmedLine.slice(0, -1).trim();
          currentConfig = configName;
          configurations[configName] = {} as NeptuneServerConfig;
        } else if (trimmedLine.endsWith('}')) {
          currentConfig = null;
          currentAuth = null;
          currentSender = null;
        } else if (currentConfig) {
          const [key, value] = trimmedLine.split(':').map((item) => item.trim());

          if (key === 'auth') {
            currentAuth = {} as NeptuneAuthenticationCredentials;
            configurations[currentConfig].authentication = currentAuth;
          } else if (key === 'sender') {
            currentSender = {} as NeptuneSenderInfo;
            configurations[currentConfig].sender = currentSender;
          } else if (currentAuth && key === 'email') {
            currentAuth.email = process.env[value] || value;
          } else if (currentAuth && key === 'password') {
            currentAuth.password = process.env[value] || value;
          } else if (currentSender && key === 'email') {
            currentSender.email = process.env[value] || value;
          } else if (currentSender && key === 'name') {
            currentSender.name = process.env[value] || value;
          } else {
            // @ts-ignore
            configurations[currentConfig][key] = value;
          }
        }
      }
    }

    return configurations;
  }

  getConfigurations(): { [key: string]: NeptuneServerConfig } {
    return this.configurations;
  }
}

export default NeptuneConfigParser;
