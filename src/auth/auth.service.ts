import { ForbiddenException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { SignInDto, SignUpDto } from "./dto";
import * as argon from 'argon2'
import { Prisma } from "@prisma/client";


@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService){}
    
    async signup(dto: SignUpDto) {
        dto.password = await argon.hash(dto.password)
        try{
            const user = await this.prisma.user.create({
                data: {
                    ...dto
                }
            })
            const {access_token} = await this.signToken(user.id)
            delete user.password
            return {
                user,
                access_token
            }
        }
        catch(error){
            console.log(error)
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Credentials taken')
                }
            }
            throw new InternalServerErrorException("server error")
        }
    }

    async signin(dto: SignInDto){
        try {
            console.log(dto)
            const user = await this.prisma.user.findUnique({
                where: {
                    email: dto.email
                }
            })

            if (user && await argon.verify(user.password, dto.password)) {
                const {access_token} = await this.signToken(user.id)
                delete user.password
                return {
                    user,
                    access_token
                }
            }
            else{
                throw new ForbiddenException('Credentials incorrect')
            }
        } catch (error) {
            if(error.getStatus() === 403){
                throw new ForbiddenException('Credentials incorrect')
            }
            throw new InternalServerErrorException("server error")
        }
    }

    async signToken(userId: string): Promise<{ access_token: string }> {
        const payload = {
            userId
        }

        const token = await this.jwt.signAsync(payload, {
            expiresIn: '1m',
            secret: this.config.get('JWT_SECRET')
        })

        return {
            access_token: token
        }
    }
}