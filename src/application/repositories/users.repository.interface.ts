import { User, UserInsert } from '@/entities/models/user';

export interface IUsersRepository {
    createUser(user: UserInsert): Promise<User>;
}
