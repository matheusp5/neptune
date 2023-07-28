
declare module 'Neptune' {
    export interface NeptuneServerConfig {
        smtpServer: string
        smtpEmail: string
        smtpPassword: string
        smtpPort?: number
    }
}