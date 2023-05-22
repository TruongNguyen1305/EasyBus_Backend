import { BadRequestException, Body, Controller, HttpCode, Post, UseGuards, InternalServerErrorException, HttpException } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { JwtGuard } from "src/auth/guard";
import { GetUser } from "src/auth/decorator";
import { PaymentDto } from "./dto";

@Controller('payment')
export class PaymentController {
    constructor(private paymentService: PaymentService){}

    @UseGuards(JwtGuard)
    @Post()
    async getPaymentFromMoMo(@GetUser('id') userId: string, @Body() dto: PaymentDto){
        const res: any = await this.paymentService.getPaymentFromMoMo(userId, dto)
        if(res.error){
            if(res.status === 400){
                throw new BadRequestException(res.message)
            }
            else{
                throw new InternalServerErrorException(res.message)
            }
        }
        return res
    }

    @Post('notify')
    notifyPayment(@Body() payload: any){
        console.log(this.paymentService.notifyPayment(payload))
    }
}