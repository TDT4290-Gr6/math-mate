import { IUsersRepository } from '@/application/repositories/users.repository.interface';
import { DatabaseOperationError } from '@/entities/errors/common';
import { UserInsert, User } from '@/entities/models/user';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export class UsersRepository implements IUsersRepository {
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
            id: Number(createdUser.id),
            uuid: createdUser.uuid ?? '',
            score: createdUser.score ?? 0,
            country: Number(createdUser.country),
        } as User;
    }

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
            id: Number(user.id),
            uuid: user.uuid ?? '',
            score: user.score ?? 0,
            country: Number(user.country),
        } as User;
    }
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
            id: Number(user.id),
            uuid: user.uuid ?? '',
            score: user.score ?? 0,
            country: Number(user.country),
        } as User;
    }

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
            id: Number(updatedUser.id),
            uuid: updatedUser.uuid ?? '',
            score: updatedUser.score ?? 0,
            country: Number(updatedUser.country),
        } as User;
    }

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
