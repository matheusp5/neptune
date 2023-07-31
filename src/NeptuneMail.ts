import nodemailer from 'nodemailer';
import fs from 'fs-extra';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export interface NeptuneServerConfig {
  host: string;
  authentication: NeptuneAuthenticationCredentials;
  port?: number;
  secure_ssl?: boolean;
  sender_email: string;
}
export interface NeptuneAuthenticationCredentials {
  email: string;
  password: string;
}

export interface NeptuneTemplateData {
  [key: string]: string;
}

export interface SenderInterface {
  email: string
  name: string
}

type NeptuneConstructorConfigs = {
  configFilePath?: string
  config: string
}


class NeptuneMail {
  private smtp_server: string;
  private smtp_authentication: NeptuneAuthenticationCredentials;
  private smtp_port: number = 587;
  private smtp_secure: boolean = false;
  private sender_email: SenderInterface;
  constructor(configs: NeptuneConstructorConfigs) {
    if(!configs.configFilePath) configs.configFilePath = ""

  }

  /**
   * The sendSimpleMail method allows the user to send an email to multiple recipients. It takes the following parameters:
   * @param receivers An array of recipient email addresses.
   * @param subject The subject of the email.
   * @param content The content of the email.
   */
  async sendMail(receivers: string[], subject: string, content: string) {
    let messages: SMTPTransport.SentMessageInfo[] = [];
    const smtpConfig = {
      host: this.smtp_server,
      port: this.smtp_port,
      secure: this.smtp_secure,
      auth: {
        user: this.smtp_authentication.email,
        pass: this.smtp_authentication.password,
      },
    };

    const transporter = nodemailer.createTransport(smtpConfig);

    for (const receiver of receivers) {
      const mailOptions = {
        from: this.sender_email,
        to: receiver,
        subject,
        text: content,
      };

      const info = await transporter.sendMail(mailOptions);
      messages.push(info);
    }
    return messages;
  }

  /**
   * The sendMailWithTemplate method allows the user to send an email to multiple recipients using a customizable HTML email template. It takes the following parameters:
   * @param receivers An array of recipient email addresses.
   * @param subject The subject of the email.
   * @param templatePath The file path of the HTML template file containing placeholders like {{key}}.
   * @param templateData An object that contains key-value pairs representing the data to replace the placeholders in the template.
   */
  async sendTemplatedMail(
    receivers: string[],
    subject: string,
    templatePath: string,
    templateData: NeptuneTemplateData,
  ) {
    const templateContent = fs.readFileSync(templatePath, 'utf-8');
    const compiledTemplate = Object.entries(templateData).reduce(
      (acc, [key, value]) => acc.replace(new RegExp(`{{${key}}}`, 'g'), value),
      templateContent,
    );

    await this.sendMail(receivers, subject, compiledTemplate);

  }
}

export default NeptuneMail;
