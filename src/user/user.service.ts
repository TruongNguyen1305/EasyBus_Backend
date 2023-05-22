import { ForbiddenException, Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common'
import { Prisma, Ticket, TicketType, User } from '@prisma/client';
import { ActivateTicketDto, ProfileDto } from 'src/auth/dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async updateProfile(id: string, profile: ProfileDto){
        try{
            const userUpdated = await this.prisma.user.update({
                where: {
                    id
                },
                data: {
                    ...profile
                }
            })
            delete userUpdated.password
            return userUpdated
        }
        catch(error){
            console.log(error)
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new BadRequestException('Credentials taken')
                }
            }
            throw new InternalServerErrorException("server error")
        }
    }

    async getAllTicket(userId: string){
        try {
            const {remainTickets} = await this.prisma.user.findFirst({
                where: {
                    id: userId
                },
                select:{
                    remainTickets: true
                }
            })
            const res = {
                normalTickets: 0,
                monthTickets: 0
            }

            remainTickets.forEach((ticket: Ticket) => {
                if(ticket.type === TicketType.DAY){
                    res.normalTickets += 1
                }
                else{
                    res.monthTickets += 1
                }
            });

            return res
        }
        catch (error) {
            throw new InternalServerErrorException("server error")
        }
    }

    async getCurrentActiveTicket(userId: string) {
        try {
            const { currentActiveTicket } = await this.prisma.user.findFirst({
                where: {
                    id: userId
                },
                select: {
                    currentActiveTicket: true
                }
            })

            return {currentActiveTicket}
        }
        catch (error) {
            throw new InternalServerErrorException("server error")
        }
    }

    async activateTicket(userId: string, dto: ActivateTicketDto) {
        try {
            let { remainTickets, currentActiveTicket } = await this.prisma.user.findFirst({
                where: {
                    id: userId
                },
                select: {
                    remainTickets: true,
                    currentActiveTicket: true
                }
            })


            if(currentActiveTicket && currentActiveTicket.remainTurn > 0){
                return {
                    statusCode: 400,
                    error: 'Bạn đang kích hoạt một vé khác!'
                }
            }
            else{
                let type = dto.type === 'day' ? TicketType.DAY : TicketType.MONTH
                currentActiveTicket = remainTickets.find((ticket: Ticket) => ticket.type === type)
                remainTickets = remainTickets.filter((ticket: Ticket) => ticket !== currentActiveTicket)
                await this.prisma.user.update({
                    where: {
                        id: userId
                    },
                    data: {
                        remainTickets,
                        currentActiveTicket
                    }
                })
                console.log('Successfully updated')
                return {
                    currentActiveTicket
                }
            }
        }
        catch (error) {
            throw new InternalServerErrorException("server error")
        }
    }
}