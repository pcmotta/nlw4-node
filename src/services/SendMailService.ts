import fs from 'fs'

import nodemailer, { Transporter } from 'nodemailer'
import handleBars from 'handlebars'

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
    }
    
    async execute (to: string, subject: string, variables: object, path: string) {
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
}

export default new SendMailService()