import * as Neptune from 'Neptune';
import { SMTPChannel } from 'smtp-channel';

class NeptuneMail {
  private smtp_server: string;
  private smtp_authentication: Neptune.NeptuneAuthenticationCredentials;
  private smtp_port: number = 587;
  private smtp_secure: boolean = false;
  constructor({
    smtpServer,
    smtpPort,
    smtpEmail,
    smtpPassword,
    secureSSL,
  }: Neptune.NeptuneServerConfig) {
    this.smtp_server = smtpServer;
    this.smtp_authentication = { email: smtpEmail, password: smtpPassword };
    if (smtpPort) this.smtp_port = smtpPort;
    if (secureSSL) this.smtp_secure = secureSSL;
  }

  async sendSimpleMail(receivers: string[]) {
    try {
      const channel: SMTPChannel = new SMTPChannel({
        host: this.smtp_server,
        port: this.smtp_port,
        secure: false,
        auth: {
          user: this.smtp_authentication.email,
          pass: this.smtp_authentication.password,
        },
      });
    } catch (e) {
      console.error(`An error ocurred during the email send. ${e}`);
    }
  }
}

export default NeptuneMail;
