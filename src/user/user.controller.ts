import {Controller, Get, UseGuards, Query, Param} from '@nestjs/common'
import { UserService } from './user.service'
import { GetUser } from 'src/auth/decorator'
import { User } from '@prisma/client'
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
    constructor(private userService: UserService){}
    
    @Get('me')
    getUser(@GetUser() user: User){
        return user;
    }
}