import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';
dotenv.config();

export interface MailerConfigInterface {
  host: string;
  port: number;
  secure_ssl: boolean;
  user: string;
  password: string;
  email: string;
}

class NeptuneConfigParser {
  private filePath: string;

  constructor(
    private configName: string,
    filePath?: string,
  ) {
    this.filePath = filePath
      ? path.resolve(filePath)
      : path.resolve('config.nep');
  }

  private getConfigContent(): string {
    return fs.readFileSync(this.filePath, 'utf-8');
  }

  private parseValue(value: string): any {
    if (value.startsWith('env(') && value.endsWith(')')) {
      const envVar = value.slice(4, -1);
      return process.env[envVar] || '';
    }
    return value;
  }

  private parseConfigContent(configContent: string): any {
    const configObject: any = {};
    const lines = configContent.split('\n');

    let currentConfig: string | null = null;
    for (const line of lines) {
      const [key, value] = line
        .trim()
        .split(':')
        .map((item) => item.trim());

      if (key.includes(this.configName + ' {')) {
        currentConfig = key;
        configObject[currentConfig] = {};
      } else if (currentConfig !== null) {
        if (value) {
          if (value.startsWith('{')) {
            configObject[currentConfig][key] = JSON.parse(value);
          } else {
            configObject[currentConfig][key] = this.parseValue(value);
          }
        }
      }
    }

    return configObject;
  }

  parseConfiguration(): MailerConfigInterface {
    const configContent = this.getConfigContent();
    const parsedConfig = this.parseConfigContent(configContent);
    return parsedConfig[this.configName + ' {'] as MailerConfigInterface;
  }
}

export default NeptuneConfigParser;
