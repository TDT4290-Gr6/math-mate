import { IUsersRepository } from '@/application/repositories/users.repository.interface';
import { UserInsert, User } from '@/entities/models/user';
import { prisma } from '@/lib/prisma';

export class UsersRepository implements IUsersRepository {
    async createUser(user: UserInsert): Promise<User> {
        const createdUser = await prisma.user.create({
            data: user,
        });

        return {
            id: Number(createdUser.id),
            uuid: createdUser.uuid ?? '',
            score: createdUser.score ?? 0,
            country: Number(createdUser.country),
        } as User;
    }
}
