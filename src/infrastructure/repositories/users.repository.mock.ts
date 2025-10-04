import { IUsersRepository } from '@/application/repositories/users.repository.interface';
import { UserInsert, User } from '@/entities/models/user';

export class MockUsersRepository implements IUsersRepository {
    private _users: User[];

    constructor() {
        this._users = [];
    }
    async createUser(user: UserInsert): Promise<User> {
        // check if user with same uuid exists
        const existingUser = this._users.find((u) => u.uuid === user.uuid);
        if (existingUser) {
            console.log(
                'MockUsersRepository: User already exists',
                existingUser,
            );
            return existingUser;
        }

        const newUser: User = {
            id: this._users.length + 1,
            ...user,
            score: 0,
        };
        this._users.push(newUser);
        console.log('MockUsersRepository: Created user', newUser);
        return newUser;
    }
}
