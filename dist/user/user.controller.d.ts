import { UserService } from './user.service';
import { User } from '@prisma/client';
import { ActivateTicketDto, ProfileDto } from 'src/auth/dto';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    getUser(user: User): User;
    updateProfile(id: string, profile: ProfileDto): Promise<User>;
    getAllTicket(id: string): Promise<{
        normalTickets: number;
        monthTickets: number;
    }>;
    getCurrentActiveTicket(id: string): Promise<{
        currentActiveTicket: import(".prisma/client").Ticket;
    }>;
    activateTicket(id: string, dto: ActivateTicketDto): Promise<{
        statusCode: number;
        error: string;
        currentActiveTicket?: undefined;
    } | {
        currentActiveTicket: import(".prisma/client").Ticket;
        statusCode?: undefined;
        error?: undefined;
    }>;
}
