import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "src/prisma/prisma.service";
import { PaymentDto } from "./dto";
import {createHmac} from 'crypto'
import axios from "axios";

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
        let requestType = 'linkWallet'
        let extraData = "ew0KImVtYWlsIjogImh1b25neGRAZ21haWwuY29tIg0KfQ=="
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
}