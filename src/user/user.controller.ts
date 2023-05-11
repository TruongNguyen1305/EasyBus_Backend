import {Controller, Get, UseGuards, Query, Param, Patch, Body} from '@nestjs/common'
import { UserService } from './user.service'
import { GetUser } from 'src/auth/decorator'
import { User } from '@prisma/client'
import { JwtGuard } from 'src/auth/guard';
import { profile } from 'console';
import { ProfileDto } from 'src/auth/dto';


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
}