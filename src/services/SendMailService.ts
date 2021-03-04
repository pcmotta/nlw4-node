import fs from 'fs'

import nodemailer, { Transporter } from 'nodemailer'
import handleBars from 'handlebars'
import Mail from 'nodemailer/lib/mailer'

class SendMailService {
    private client: Transporter

    constructor () {
        nodemailer.createTestAccount().then(account => {
            const { user, pass, smtp: { host, port, secure } } = account

            const transporter = nodemailer.createTransport({
                host, port, secure,
                auth: {
                    user, pass
                }
            })

            this.client = transporter
        })
        .catch(err => console.log('ERROR', err.response))
    }
    
    async execute (to: string, subject: string, variables: object, path: string) {
        if (!this.client) {
            this.client = await this.createClient()
        }

        const templateFileContent = fs.readFileSync(path).toString('utf8')

        const mailTemplateParse = handleBars.compile(templateFileContent)
        const html = mailTemplateParse(variables)

        const message = await this.client.sendMail({
            to, 
            subject,
            html,
            from: 'NPS <noreply@nps.com.br>'
        })

        console.log('Message sent: %s', message.messageId)
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message))
    }

    async createClient () {
        const account = await nodemailer.createTestAccount()

        const { user, pass, smtp: { host, port, secure } } = account

        const transporter = nodemailer.createTransport({
            host, port, secure,
            auth: {
                user, pass
            }
        })

        return transporter
    }
}

export default new SendMailService()