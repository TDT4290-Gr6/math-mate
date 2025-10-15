import { IAddSolvedProblemUseCase } from '@/application/use-cases/add-solved-problem.use-case';
import { IAuthenticationService } from '@/application/services/auth.service.interface';
import { UnauthenticatedError } from '@/entities/errors/auth';
import { insertSolveSchema } from '@/entities/models/solve';
import { InputParseError } from '@/entities/errors/common';
import { z } from 'zod';

export type IAddSolvedProblemController = ReturnType<
    typeof addSolvedProblemController
>;
export const addSolvedProblemController =
    (
        authenticationService: IAuthenticationService,
        addSolvedProblemUseCase: IAddSolvedProblemUseCase,
    ) =>
    async (input: z.infer<typeof insertSolveSchema>) => {
        const isAuthenticated = await authenticationService.isAuthenticated();
        if (!isAuthenticated) {
            throw new UnauthenticatedError('User must be logged in.');
        }

        const result = insertSolveSchema.partial().safeParse(input);

        if (!result.success) {
            throw new InputParseError('Invalid input', { cause: result.error });
        }

        return await addSolvedProblemUseCase(input);
    };
