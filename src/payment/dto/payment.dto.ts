import { IsNotEmpty, IsNumber } from "class-validator";

export class PaymentDto {
    @IsNotEmpty()
    @IsNumber()
    normalTicketCount: number

    @IsNotEmpty()
    @IsNumber()
    monthTicketCount: number

    @IsNotEmpty()
    @IsNumber()
    totalPrice: number
}