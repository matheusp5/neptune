declare module 'Neptune' {
  export interface NeptuneTemplateData {
    [key: string]: string;
  }

  export type NeptuneConstructorConfigs = {
    configFilePath?: string
    config: string
  }

   export interface MailerConfigInterface {
    host: string;
    port: number;
    secure_ssl: boolean;
    user: string;
    password: string;
    email: string;
  }
}
