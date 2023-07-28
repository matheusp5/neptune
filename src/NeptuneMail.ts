import * as neptune from "Neptune";

class NeptuneMail {
    private smtp_server: string
    private smtp_authentication: neptune.NeptuneAuthenticationCredentials
    private smtp_port: number = 587
    constructor({smtpServer, smtpPort, smtpEmail, smtpPassword}: neptune.NeptuneServerConfig) {
        this.smtp_server = smtpServer;
        this.smtp_authentication = {email: smtpEmail, password: smtpPassword}
        if(smtpPort) this.smtp_port = smtpPort
    }
    
}

export default NeptuneMail