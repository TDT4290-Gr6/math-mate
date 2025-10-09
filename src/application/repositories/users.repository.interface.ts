import { User, UserInsert } from '@/entities/models/user';

export interface IUsersRepository {
    createUser(user: UserInsert): Promise<User>;
    getUserById(id: number): Promise<User | null>;
    getUserByUuid(uuid: string): Promise<User | null>;
    updateUserScore(id: number, score: number): Promise<User>;
    deleteUserById(id: number): Promise<void>;
    addCountryToUser(id: number, countryId: number): Promise<User>;
}
