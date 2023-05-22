import { Ticket, User } from '@prisma/client';
import { ActivateTicketDto, ProfileDto } from 'src/auth/dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    updateProfile(id: string, profile: ProfileDto): Promise<User>;
    getAllTicket(userId: string): Promise<{
        normalTickets: number;
        monthTickets: number;
    }>;
    getCurrentActiveTicket(userId: string): Promise<{
        currentActiveTicket: Ticket;
    }>;
    activateTicket(userId: string, dto: ActivateTicketDto): Promise<{
        statusCode: number;
        error: string;
        currentActiveTicket?: undefined;
    } | {
        currentActiveTicket: Ticket;
        statusCode?: undefined;
        error?: undefined;
    }>;
}
