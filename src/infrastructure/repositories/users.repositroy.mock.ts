import { IUsersRepository } from '@/application/repositories/users.repository.interface';
import { UserInsert, User } from '@/entities/models/user';

export class MockUsersRepository implements IUsersRepository {
    private _users: User[];

    constructor() {
        this._users = [];
    }
    async createUser(user: UserInsert): Promise<User> {
        const newUser: User = {
            id: this._users.length + 1,
            ...user,
            score: 0,
        };
        this._users.push(newUser);
        return newUser;
    }
}
