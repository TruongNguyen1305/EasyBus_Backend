"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const crypto_1 = require("crypto");
const node_fetch_1 = require("node-fetch");
const client_1 = require("@prisma/client");
let PaymentService = class PaymentService {
    constructor(prisma, config) {
        this.prisma = prisma;
        this.config = config;
        this.partnerCode = config.get('partnerCode');
        this.accessKey = config.get('accessKey');
        this.secretkey = config.get('secretkey');
        this.lang = 'vi';
        this.orderInfo = 'Thanh toán qua ví MoMo';
        this.ipnUrl = config.get('ipnUrl');
        this.redirectUrl = config.get('redirectUrl');
        this.partnerClientId = config.get('partnerClientId');
    }
    async getPaymentFromMoMo(userId, dto) {
        const data = {
            normalTicketCount: dto.normalTicketCount,
            monthTicketCount: dto.monthTicketCount,
            userId: userId
        };
        let requestType = 'linkWallet';
        let extraData = Buffer.from(JSON.stringify(data)).toString("base64");
        let requestId = userId + new Date().getTime();
        let rawSignature = "accessKey=" + this.accessKey + "&amount=" + dto.totalPrice.toString() + "&extraData=" +
            extraData + "&ipnUrl=" + this.ipnUrl + "&orderId=" +
            requestId + "&orderInfo=" + this.orderInfo + "&partnerClientId=" + this.partnerClientId + "&partnerCode=" +
            this.partnerCode + "&redirectUrl=" + this.redirectUrl + "&requestId=" +
            requestId + "&requestType=" + requestType;
        let signature = (0, crypto_1.createHmac)('sha256', this.secretkey)
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
            const response = await (0, node_fetch_1.default)("https://test-payment.momo.vn/v2/gateway/api/create", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: requestBody
            });
            return response.json();
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    async updateTicketFromUser(userId, dto) {
    }
    async notifyPayment(payload) {
        const { partnerCode, orderId, requestId, amount, orderInfo, orderType, transId, resultCode, message, payType, responseTime, extraData, m2signature, } = payload;
        console.log(payload);
        const rawHash = "accessKey=" + this.accessKey + "&amount=" + amount + "&extraData=" + extraData + "&message=" + message + "&orderId=" + orderId + "&orderInfo=" + orderInfo +
            "&orderType=" + orderType + "&partnerCode=" + partnerCode + "&payType=" + payType + "&requestId=" + requestId + "&responseTime=" + responseTime +
            "&resultCode=" + resultCode + "&transId=" + transId;
        let partnerSignature = (0, crypto_1.createHmac)('sha256', this.secretkey)
            .update(rawHash)
            .digest('hex');
        if (m2signature === partnerSignature) {
            if (resultCode === 0) {
                console.log('oke nha');
                const data = JSON.parse(Buffer.from(extraData, "base64").toString());
                let tickets = [];
                while (data.normalTicketCount) {
                    tickets.push({
                        type: client_1.TicketType.DAY,
                        activatedTime: null
                    });
                }
                while (data.monthTicketCount) {
                    tickets.push({
                        type: client_1.TicketType.MONTH,
                        activatedTime: null
                    });
                }
                try {
                    const user = await this.prisma.user.findFirst({
                        where: {
                            id: data.userId
                        }
                    });
                    user.remainTickets.push(...tickets);
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
                    });
                    return updated;
                }
                catch (e) {
                    throw new common_1.InternalServerErrorException();
                }
            }
            else {
                return {
                    message: message
                };
            }
        }
    }
};
PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, config_1.ConfigService])
], PaymentService);
exports.PaymentService = PaymentService;
//# sourceMappingURL=payment.service.js.map