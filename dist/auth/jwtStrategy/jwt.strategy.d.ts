import { ConfigService } from "@nestjs/config";
import { Strategy } from "passport-jwt";
import { PrismaService } from "../../prisma/prisma.service";
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly prismaService;
    constructor(config: ConfigService, prismaService: PrismaService);
    validate(payload: {
        userId: string;
    }): Promise<import(".prisma/client").User>;
}
export {};
