import { UserService } from './user.service';
import { User } from '@prisma/client';
import { ProfileDto } from 'src/auth/dto';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    getUser(user: User): User;
    updateProfile(id: string, profile: ProfileDto): Promise<User>;
}
