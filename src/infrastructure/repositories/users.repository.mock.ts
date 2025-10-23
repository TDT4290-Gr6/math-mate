import { IUsersRepository } from '@/application/repositories/users.repository.interface';
import { DatabaseOperationError } from '@/entities/errors/common';
import { UserInsert, User } from '@/entities/models/user';

/**
 * Mock repository class for managing user entities in memory.
 *
 * Provides methods to create, retrieve, update, and delete users for testing purposes.
 * Does not persist data and is intended for use in unit tests or development environments.
 *
 * Implements the `IUsersRepository` interface.
 */
export class MockUsersRepository implements IUsersRepository {
    private _users: User[];

    constructor() {
        this._users = [
            {
                id: 1,
                uuid: '123e4567-e89b-12d3-a456-426614174000',
                score: 2,
            },
        ];
    }

    /**
     * Creates a new user and adds it to the mock users repository.
     *
     * If a user with the same UUID already exists, returns the existing user instead of creating a new one.
     * Otherwise, assigns a new incremental ID, sets the initial score to 0, and stores the new user.
     *
     * @param user - The user data to insert (excluding the ID and score).
     * @returns A promise that resolves to the created user, or the existing user if a duplicate UUID is found.
     */
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

    /**
     * Retrieves a user by their unique identifier.
     *
     * @param id - The unique identifier of the user to retrieve.
     * @returns A promise that resolves to the user with the specified ID, or `null` if no user is found.
     */
    async getUserById(id: number): Promise<User | null> {
        const user = this._users.find((u) => u.id === id);
        return user ?? null;
    }

    /**
     * Retrieves a user by their unique UUID.
     *
     * @param uuid - The unique identifier of the user to retrieve.
     * @returns A promise that resolves to the user with the specified UUID, or `null` if no such user exists.
     */
    async getUserByUuid(uuid: string): Promise<User | null> {
        const user = this._users.find((u) => u.uuid === uuid);
        return user ?? null;
    }

    /**
     * Updates the score of a user with the specified ID.
     *
     * @param id - The unique identifier of the user whose score is to be updated.
     * @param score - The new score to assign to the user.
     * @returns A promise that resolves to the updated {@link User} object.
     * @throws {DatabaseOperationError} If a user with the given ID is not found.
     */
    async updateUserScore(id: number, score: number): Promise<User> {
        const user = this._users.find((u) => u.id === id);
        if (!user) {
            throw new DatabaseOperationError(`User with id ${id} not found.`);
        }
        user.score = score;
        return user;
    }

    /**
     * Deletes a user from the internal users array by their unique ID.
     *
     * @param id - The unique identifier of the user to delete.
     * @throws {DatabaseOperationError} If no user with the specified ID is found.
     * @returns A promise that resolves when the user has been deleted.
     */
    async deleteUserById(id: number): Promise<void> {
        const index = this._users.findIndex((u) => u.id === id);
        if (index === -1) {
            throw new DatabaseOperationError(`User with id ${id} not found.`);
        }
        this._users.splice(index, 1);
    }

    /**
     * Associates a country with a user by setting the user's `countryId`.
     *
     * @param id - The unique identifier of the user to update.
     * @param countryId - The unique identifier of the country to associate with the user.
     * @returns A promise that resolves to the updated `User` object.
     * @throws {DatabaseOperationError} If a user with the specified `id` is not found.
     */
    addCountryToUser(id: number, countryId: number): Promise<User> {
        const user = this._users.find((u) => u.id === id);
        if (!user) {
            throw new DatabaseOperationError(`User with id ${id} not found.`);
        }
        user.countryId = countryId;
        return Promise.resolve(user);
    }

    /**
     * Resets the in-memory users repository by clearing all stored users.
     *
     * Primarily used in tests to ensure a clean state between test cases.
     *
     */
    reset(): void {
        this._users = [];
    }
}
