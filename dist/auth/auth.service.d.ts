import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from '../prisma/prisma.service';
import { SignInDto, SignUpDto } from "./dto";
export declare class AuthService {
    private prisma;
    private jwt;
    private config;
    constructor(prisma: PrismaService, jwt: JwtService, config: ConfigService);
    signup(dto: SignUpDto): Promise<{
        user: import(".prisma/client").User;
        access_token: string;
    }>;
    signin(dto: SignInDto): Promise<{
        user: import(".prisma/client").User;
        access_token: string;
    }>;
    signToken(userId: string): Promise<{
        access_token: string;
    }>;
}
