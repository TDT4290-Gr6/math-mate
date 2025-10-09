import { IUsersRepository } from '@/application/repositories/users.repository.interface';
import { DatabaseOperationError } from '@/entities/errors/common';
import { UserInsert, User } from '@/entities/models/user';

export class MockUsersRepository implements IUsersRepository {
    private _users: User[];

    constructor() {
        this._users = [];
    }
    async getUserById(id: number): Promise<User | null> {
        const user = this._users.find((u) => u.id === id);
        return user ?? null;
    }

    async getUserByUuid(uuid: string): Promise<User | null> {
        const user = this._users.find((u) => u.uuid === uuid);
        return user ?? null;
    }
    async updateUserScore(id: number, score: number): Promise<User> {
        const user = this._users.find((u) => u.id === id);
        if (!user) {
            throw new DatabaseOperationError(`User with id ${id} not found.`);
        }
        user.score = score;
        return user;
    }

    async deleteUserById(id: number): Promise<void> {
        const index = this._users.findIndex((u) => u.id === id);
        if (index === -1) {
            throw new DatabaseOperationError(`User with id ${id} not found.`);
        }
        this._users.splice(index, 1);
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
