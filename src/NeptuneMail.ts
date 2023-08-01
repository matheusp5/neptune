import nodemailer, { Transporter } from 'nodemailer';
import fs from 'fs-extra';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import NeptuneConfigParser, {
  MailerConfigInterface,
} from './utils/NeptuneConfigParser';
import QueueBuilder from './utils/QueueBuilder';

export interface NeptuneTemplateData {
  [key: string]: string;
}

export type NeptuneConstructorConfigs = {
  configFilePath?: string;
  config: string;
};

class NeptuneMail {
  private mailerConfig: MailerConfigInterface;
  private readonly configParser: NeptuneConfigParser;
  private mailQueue: QueueBuilder<nodemailer.SendMailOptions>;
  private isSending: boolean;
  constructor(configs: NeptuneConstructorConfigs) {
    if (!configs.configFilePath) {
      this.configParser = new NeptuneConfigParser(configs.config);
    } else {
      this.configParser = new NeptuneConfigParser(
        configs.config,
        configs.configFilePath,
      );
    }

    this.mailerConfig = this.configParser.parseConfiguration();

    this.mailQueue = new QueueBuilder<nodemailer.SendMailOptions>();
    this.isSending = false;
    console.log(this.mailerConfig.secure_ssl);
  }

  /**
   * The sendSimpleMail method allows the user to send an email to multiple recipients. It takes the following parameters:
   * @param receivers An array of recipient email addresses.
   * @param subject The subject of the email.
   * @param content The content of the email.
   */
  async sendMail(receivers: string[], subject: string, content: string) {
    const smtpConfig = {
      host: this.mailerConfig.host,
      port: this.mailerConfig.port,
      secure: this.mailerConfig.secure_ssl,
      auth: {
        user: this.mailerConfig.user,
        pass: this.mailerConfig.password,
      },
    };

    const transporter = nodemailer.createTransport(smtpConfig);

    for (const receiver of receivers) {
      const mailOptions: nodemailer.SendMailOptions = {
        from: this.mailerConfig.email,
        to: receiver,
        subject,
        text: content,
      };

      this.mailQueue.enqueue(mailOptions);
    }

    if (!this.isSending) {
      this.isSending = true;
      return await this.processMailQueue(transporter);
    }
  }

  private async processMailQueue(
    transporter: Transporter<SMTPTransport.SentMessageInfo>,
  ) {
    let messages = []
    while (!this.mailQueue.isEmpty()) {
      const mailOptions = this.mailQueue.dequeue();
      if (mailOptions) {
        try {
          const info = await transporter.sendMail(mailOptions);
          messages.push(info)
        } catch (error) {
          console.error(error)
        }
      }
    }

    this.isSending = false;
    return messages
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
