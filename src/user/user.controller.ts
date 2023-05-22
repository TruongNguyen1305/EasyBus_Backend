import {Controller, Get, UseGuards, Query, Param, Patch, Body, BadRequestException} from '@nestjs/common'
import { UserService } from './user.service'
import { GetUser } from 'src/auth/decorator'
import { User } from '@prisma/client'
import { JwtGuard } from 'src/auth/guard';
import { ActivateTicketDto, ProfileDto } from 'src/auth/dto';
import { error } from 'console';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
    constructor(private userService: UserService){}
    
    @Get('me')
    getUser(@GetUser() user: User){
        return user;
    }

    @Patch(':id')
    updateProfile(@Param('id') id: string, @Body() profile: ProfileDto) {
        return this.userService.updateProfile(id, profile)
    }

    @Get(':id/tickets')
    getAllTicket(@Param('id') id: string) {
        return this.userService.getAllTicket(id)
    }

    @Get(':id/tickets/currentActive')
    getCurrentActiveTicket(@Param('id') id: string) { 
        return this.userService.getCurrentActiveTicket(id)
    }

    @Patch(':id/tickets')
    async activateTicket(@Param('id') id: string, @Body() dto: ActivateTicketDto){
        const res = await this.userService.activateTicket(id, dto)
        if(res.error){
            throw new BadRequestException(res.error)
        }
        return res
    }
}