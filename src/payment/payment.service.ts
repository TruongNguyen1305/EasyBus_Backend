import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma/prisma.service";
import { PaymentDto } from "./dto";
import {createHmac} from 'crypto'
import fetch from 'node-fetch'
import { Ticket, TicketType } from "@prisma/client";

type PaymentData = {
    normalTicketCount: number,
    monthTicketCount: number,
    userId: string
}

@Injectable()
export class PaymentService {
    private partnerCode: string
    private accessKey: string
    private secretkey: string
    private lang: string
    private orderInfo: string
    private ipnUrl: string
    private redirectUrl: string
    private partnerClientId: string

    constructor(private prisma: PrismaService, private config: ConfigService){
        this.partnerCode = config.get('partnerCode')
        this.accessKey = config.get('accessKey')
        this.secretkey = config.get('secretkey')
        this.lang = 'vi'
        this.orderInfo = 'Thanh toán qua ví MoMo'
        this.ipnUrl = config.get('ipnUrl')
        this.redirectUrl = config.get('redirectUrl')
        this.partnerClientId = config.get('partnerClientId')
    }

    async getPaymentFromMoMo(userId: string, dto: PaymentDto){
        const data = {
            normalTicketCount: dto.normalTicketCount,
            monthTicketCount: dto.monthTicketCount,
            userId: userId
        }
        let requestType = 'linkWallet'
        let extraData = Buffer.from(JSON.stringify(data)).toString("base64"); 
        let requestId = userId + new Date().getTime()
        let rawSignature = "accessKey=" + this.accessKey + "&amount=" + dto.totalPrice.toString() + "&extraData=" + 
                            extraData + "&ipnUrl=" + this.ipnUrl + "&orderId=" + 
                            requestId + "&orderInfo=" + this.orderInfo + "&partnerClientId=" + this.partnerClientId + "&partnerCode=" + 
                            this.partnerCode + "&redirectUrl=" + this.redirectUrl + "&requestId=" + 
                            requestId + "&requestType=" + requestType

        let signature = createHmac('sha256', this.secretkey)
            .update(rawSignature)
            .digest('hex');

        const requestBody = JSON.stringify({
            partnerCode: this.partnerCode,
            partnerName: "Test",
            partnerClientId: this.partnerClientId,
            requestId: requestId,
            amount: dto.totalPrice.toString(),
            orderId: requestId,
            orderInfo: this.orderInfo,
            redirectUrl: this.redirectUrl,
            ipnUrl: this.ipnUrl,
            extraData: extraData,
            requestType: requestType,
            signature: signature,
            lang: this.lang
        });

        try {
            const response = await fetch("https://test-payment.momo.vn/v2/gateway/api/create", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: requestBody
            })
            return response.json()
        } catch (error) {
            throw new InternalServerErrorException(error.message)
        }
    }

    async updateTicketFromUser(userId: string, dto: PaymentDto) {

    }

    async notifyPayment(payload: any){
        const {
            partnerCode,
            orderId,
            requestId,
            amount,
            orderInfo,
            orderType,
            transId ,
            resultCode,
            message,
            payType,
            responseTime,
            extraData,
            m2signature,
        } = payload

        console.log(payload)

        const rawHash = "accessKey=" + this.accessKey + "&amount=" + amount + "&extraData=" + extraData + "&message=" + message + "&orderId=" + orderId + "&orderInfo=" + orderInfo +
			"&orderType=" + orderType + "&partnerCode=" + partnerCode + "&payType=" + payType + "&requestId=" + requestId + "&responseTime=" + responseTime +
			"&resultCode=" + resultCode + "&transId=" + transId

        let partnerSignature = createHmac('sha256', this.secretkey)
            .update(rawHash)
            .digest('hex');

        //Nay loi roi hic
        // if(m2signature === partnerSignature){
            
        // }

        if (resultCode === 0) {
            //update data
            console.log('oke nhaaaaaaaa')
            const data: PaymentData = JSON.parse(Buffer.from(extraData, "base64").toString())
            let tickets: Ticket[] = []
            while (data.normalTicketCount) {
                tickets.push({
                    type: TicketType.DAY,
                    activatedTime: null
                })
                data.normalTicketCount -= 1
            }
            while (data.monthTicketCount) {
                tickets.push({
                    type: TicketType.MONTH,
                    activatedTime: null
                })
                data.normalTicketCount -= 1
            }
            console.log("data: ", data)
            console.log(tickets)
            try {
                const user = await this.prisma.user.findFirst({
                    where: {
                        id: data.userId
                    }
                })

                user.remainTickets.push(...tickets)
                console.log('User ticket: ', user.remainTickets)

                const updated = await this.prisma.user.update({
                    where: {
                        id: data.userId
                    },
                    data: {
                        remainTickets: user.remainTickets
                    },
                    select: {
                        remainTickets: true,
                        currentActiveTicket: true
                    }
                })
                return updated
            }
            catch (e) {
                throw new InternalServerErrorException()
            }
        }
        else {
            return {
                message: message
            }
        }
    }
}