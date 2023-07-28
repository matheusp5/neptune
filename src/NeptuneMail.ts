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

  async sendSimpleMail(receivers: string[], subject: string, content: string) {
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

      await channel.connect();
      await channel.helo({ hostName: this.smtp_server });

      const from: string = `<${this.smtp_authentication.email}>`;
      const to = receivers.map((rcvr: string) => `<${rcvr}>`).join(', ');
      const headers = {
        From: from,
        To: to,
        Subject: subject,
      };

      const emailData = Object.entries(headers)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\r\n');

      await channel.mail(from);

      for (const receiver of receivers) {
        await channel.rcpt(`<${receiver}>`);
      }

      await channel.data(emailData + '\r\n\r\n' + content + '\r\n');
      await channel.quit();

      console.log('E-mail sent with success!');
    } catch (e) {
      console.error(`An error ocurred during the e-mail send. ${e}`);
    }
  }
}

export default NeptuneMail;
