import { IUsersRepository } from '@/application/repositories/users.repository.interface';
import { UserInsert, User } from '@/entities/models/user';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export class UsersRepository implements IUsersRepository {
    createUser(user: UserInsert): Promise<User> {
        return prisma.user.create({
            data: user,
        });
    }
}
