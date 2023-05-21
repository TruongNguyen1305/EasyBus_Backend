import { PaymentService } from "./payment.service";
import { PaymentDto } from "./dto";
export declare class PaymentController {
    private paymentService;
    constructor(paymentService: PaymentService);
    getPaymentFromMoMo(userId: string, dto: PaymentDto): Promise<any>;
    updateTicketFromUser(userId: string): Promise<void>;
    activateTicketFromUser(userId: string): Promise<void>;
}
