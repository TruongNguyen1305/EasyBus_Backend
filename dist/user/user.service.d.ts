import { User } from '@prisma/client';
import { ProfileDto } from 'src/auth/dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    updateProfile(id: string, profile: ProfileDto): Promise<User>;
}
