import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma/prisma.service";
import { PaymentDto } from "./dto";
import { Ticket } from "@prisma/client";
export declare class PaymentService {
    private prisma;
    private config;
    private partnerCode;
    private accessKey;
    private secretkey;
    private lang;
    private orderInfo;
    private ipnUrl;
    private redirectUrl;
    private partnerClientId;
    constructor(prisma: PrismaService, config: ConfigService);
    getPaymentFromMoMo(userId: string, dto: PaymentDto): Promise<any>;
    notifyPayment(payload: any): Promise<{
        remainTickets: Ticket[];
        currentActiveTicket: Ticket;
    } | {
        statusCode: number;
        message: any;
    } | {
        message: any;
        statusCode?: undefined;
    }>;
}
