import { ForbiddenException, Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common'
import { Prisma, User } from '@prisma/client';
import { ProfileDto } from 'src/auth/dto';
import { PrismaService } from 'src/prisma/prisma.service';

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
}