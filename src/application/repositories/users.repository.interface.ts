import { User, UserInsert } from '@/entities/models/user';

/**
 * Interface for managing users in a repository.
 */
export interface IUsersRepository {
    /**
     * Creates a new user in the repository.
     *
     * @param user - The user data to insert.
     * @returns A promise that resolves to the newly created User object.
     */
    createUser(user: UserInsert): Promise<User>;

    /**
     * Retrieves a user by their unique numeric ID.
     *
     * @param id - The ID of the user.
     * @returns A promise that resolves to the User object, or null if not found.
     */
    getUserById(id: number): Promise<User | null>;

    /**
     * Retrieves a user by their UUID (universal unique identifier).
     *
     * @param uuid - The UUID of the user.
     * @returns A promise that resolves to the User object, or null if not found.
     */
    getUserByUuid(uuid: string): Promise<User | null>;

    /**
     * Updates the score of a user.
     *
     * @param id - The ID of the user.
     * @param score - The new score to set.
     * @returns A promise that resolves to the updated User object.
     */
    updateUserScore(id: number, score: number): Promise<User>;

    /**
     * Deletes a user by their ID.
     *
     * @param id - The ID of the user to delete.
     * @returns A promise that resolves when the user has been deleted.
     */
    deleteUserById(id: number): Promise<void>;

    /**
     * Associates a country with a user.
     *
     * @param id - The ID of the user.
     * @param countryId - The ID of the country to assign.
     * @returns A promise that resolves to the updated User object.
     */
    addCountryToUser(id: number, countryId: number): Promise<User>;
}
