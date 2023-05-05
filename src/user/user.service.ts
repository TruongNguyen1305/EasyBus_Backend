import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/Prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}
}