import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { messaging } from 'firebase-admin';
import * as sendpulse from 'sendpulse-api';
import { UserFcm } from 'src/models/user-fcm.entity';

@Injectable()
export class PushService {
    constructor(
        @InjectModel(UserFcm)
        private userFcmModel: typeof UserFcm,
        private config: ConfigService,
    ) {
        sendpulse.init(this.config.get('sendpulse.id'), this.config.get('sendpulse.secret'), 'dist/sendpulse/', (data) => {
            if (data && data.is_error) {
                throw new Error(`Sendpulse error: ${data.message}`);
            }
        });
    }

    public async sendMail(email: string, subject: string, template: { id: number; variables?: Record<string, any> }) {
        return new Promise((resolve, reject) => {
            sendpulse.smtpSendMail(
                (data) => {
                    if (!(data && data.result)) {
                        reject(data);
                    }
                    resolve(data);
                },
                {
                    subject,
                    template,
                    from: this.config.get('sendpulse.from'),
                    to: [
                        {
                            name: email,
                            email,
                        },
                    ],
                },
            );
        });
    }

    async toToken(tokens: string[], title: string, body: string, data: any = {}) {
        for (const token of tokens) {
            const message = {
                data: {
                    ...data,
                    click_action: "FLUTTER_NOTIFICATION_CLICK",
                },
                notification: { title, body },
                token
            };
            try {
                await messaging().send(message);
            } catch (e) {
                console.error(e);
                // this.userFcmModel.destroy({ where: { token } });
            }
        }
    }

    async toUser(userId: number, role: string, title: string, body: string, data: any = {}) {
        const tokens = await this.userFcmModel.findAll({ where: { userId, role } });
        return this.toToken(tokens.map(_ => _.token), title, body, data);
    }

}
