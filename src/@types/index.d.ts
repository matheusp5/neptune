
declare module 'Neptune' {
    export interface NeptuneServerConfig {
        smtpServer: string
        smtpEmail: string
        smtpPassword: string
        smtpPort?: number
    }
    export interface NeptuneAuthenticationCredentials {
        email: string
        password: string
    }
}