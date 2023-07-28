declare module 'smtp-channel' {
  import { EventEmitter } from 'events';

  interface SMTPChannelOptions {
    host: string;
    port?: number;
    secure?: boolean;
    auth?: {
      user: string;
      pass: string;
    };
    // Adicione outras opções aqui, se necessário
  }

  export class SMTPChannel extends EventEmitter {
    constructor(options: SMTPChannelOptions);

    connect(): Promise<void>;
    helo(params: { hostName: string }): Promise<void>;
    mail(from: string): Promise<void>;
    rcpt(to: string): Promise<void>;
    data(data: string): Promise<void>;
    quit(): Promise<void>;
    // Adicione outras funções aqui, se necessário
  }
}
