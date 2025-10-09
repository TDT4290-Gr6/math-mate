import { IUsersRepository } from '@/application/repositories/users.repository.interface';
import { DatabaseOperationError } from '@/entities/errors/common';
import { UserInsert, User } from '@/entities/models/user';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

/**
 * Repository class for managing user entities in the database.
 *
 * Provides methods to create, retrieve, update, and delete users using Prisma ORM.
 * Handles database operation errors and wraps them in custom error types.
 *
 * Implements the `IUsersRepository` interface.
 */
export class UsersRepository implements IUsersRepository {
    /**
     * Creates a new user in the database.
     *
     * @param user - The user data to insert into the database.
     * @returns A promise that resolves to the created user object.
     * @throws {DatabaseOperationError} If the user creation fails due to a known Prisma client error.
     * @throws {Error} If an unknown error occurs during user creation.
     */
    async createUser(user: UserInsert): Promise<User> {
        let createdUser;
        try {
            createdUser = await prisma.user.create({
                data: user,
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw new DatabaseOperationError(
                    'Failed to create user in the database.',
                    { cause: error },
                );
            }
            throw error;
        }

        return {
            id: createdUser.id,
            uuid: createdUser.uuid,
            score: createdUser.score,
            countryId: createdUser.countryId,
        } as User;
    }

    /**
     * Retrieves a user by their unique numeric ID from the database.
     *
     * Attempts to find a user with the specified `id` using Prisma ORM. If the user is found,
     * returns a `User` object with normalized fields. If no user is found, returns `null`.
     * Throws a `DatabaseOperationError` if a known Prisma database error occurs.
     *
     * @param id - The unique numeric identifier of the user to retrieve.
     * @returns A `Promise` that resolves to the `User` object if found, or `null` if not found.
     * @throws {DatabaseOperationError} If a known database error occurs during the operation.
     * @throws {Error} If an unknown error occurs during user retrieval.
     */
    async getUserById(id: number): Promise<User | null> {
        let user;
        try {
            user = await prisma.user.findUnique({
                where: { id: id },
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw new DatabaseOperationError(
                    'Failed to retrieve user from the database.',
                    { cause: error },
                );
            }
            throw error;
        }

        if (!user) {
            return null;
        }

        return {
            id: user.id,
            uuid: user.uuid,
            score: user.score,
            countryId: user.countryId,
        } as User;
    }

    /**
     * Retrieves a user from the database by their UUID.
     *
     * Attempts to find a user record matching the provided UUID. If a user is found,
     * returns a `User` object with normalized fields. If no user is found, returns `null`.
     * Throws a `DatabaseOperationError` if a known Prisma database error occurs.
     *
     * @param uuid - The UUID of the user to retrieve.
     * @returns A promise that resolves to the `User` object if found, or `null` if not found.
     * @throws {DatabaseOperationError} If a known Prisma database error occurs during retrieval.
     * @throws {Error} If an unknown error occurs during user retrieval.
     */
    async getUserByUuid(uuid: string): Promise<User | null> {
        let user;
        try {
            user = await prisma.user.findUnique({
                where: { uuid: uuid },
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw new DatabaseOperationError(
                    'Failed to retrieve user from the database.',
                    { cause: error },
                );
            }
            throw error;
        }

        if (!user) {
            return null;
        }

        return {
            id: user.id,
            uuid: user.uuid,
            score: user.score,
            countryId: user.countryId,
        } as User;
    }

    /**
     * Updates the score of a user in the database by their unique identifier.
     *
     * @param id - The unique numeric identifier of the user whose score is to be updated.
     * @param score - The new score value to set for the user.
     * @returns A promise that resolves to the updated User object.
     * @throws {DatabaseOperationError} If the update operation fails due to a known Prisma client error.
     * @throws {Error} If an unexpected error occurs during the update operation.
     */
    async updateUserScore(id: number, score: number): Promise<User> {
        let updatedUser;
        try {
            updatedUser = await prisma.user.update({
                where: { id: id },
                data: { score: score },
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw new DatabaseOperationError(
                    'Failed to update user score in the database.',
                    { cause: error },
                );
            }
            throw error;
        }

        return {
            id: updatedUser.id,
            uuid: updatedUser.uuid,
            score: updatedUser.score,
            countryId: updatedUser.countryId,
        } as User;
    }

    /**
     * Deletes a user from the database by their unique identifier.
     *
     * @param id - The unique identifier of the user to be deleted.
     * @returns A promise that resolves when the user has been deleted.
     * @throws {DatabaseOperationError} If the deletion fails due to a known Prisma client error.
     * @throws {Error} If an unexpected error occurs during the deletion process.
     */
    async deleteUserById(id: number): Promise<void> {
        try {
            await prisma.user.delete({
                where: { id: id },
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw new DatabaseOperationError(
                    'Failed to delete user from the database.',
                    { cause: error },
                );
            }
            throw error;
        }
    }
}
