import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma/prisma.service";
import { PaymentDto } from "./dto";
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
    updateTicketFromUser(userId: string, dto: PaymentDto): Promise<void>;
}
