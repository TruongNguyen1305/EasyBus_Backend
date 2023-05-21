import { PrismaService } from '../prisma/prisma.service';
export declare class FavouriteService {
    private prisma;
    constructor(prisma: PrismaService);
    getUser(userId: string): Promise<import(".prisma/client").User>;
    findAllStation(userId: string): Promise<string[]>;
    findAllBus(userId: string): Promise<string[]>;
    updateStation(userId: string, id: string): Promise<string[]>;
    updateBus(userId: string, id: string): Promise<string[]>;
}
