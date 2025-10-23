import { IAddSolvedProblemUseCase } from '@/application/use-cases/add-solved-problem.use-case';
import { IAuthenticationService } from '@/application/services/auth.service.interface';
import { solvePresenter } from '../presenters/solve.presenter';
import { UnauthenticatedError } from '@/entities/errors/auth';
import { insertSolveSchema } from '@/entities/models/solve';
import { InputParseError } from '@/entities/errors/common';

export type IAddSolvedProblemController = ReturnType<
    typeof addSolvedProblemController
>;

// UserID will be found by the authentication service
const inputSchema = insertSolveSchema.pick({
    problemId: true,
    startedSolvingAt: true,
    stepsUsed: true,
    finishedSolvingAt: true,
    feedback: true,
    wasCorrect: true,
});

/**
 * Function that creates a controller for adding a solved problem.
 *
 * @param authenticationService - Service responsible for checking user authentication.
 * @param addSolvedProblemUseCase - Use case for adding a solved problem to the system.
 * @returns An async function that takes validated input, checks authentication, validates input schema,
 *          and delegates to the use case to add the solved problem.
 *
 * The returned function:
 * - Verifies if the user is authenticated using the injected authenticationService.
 * - Validates the input against the inputSchema.
 * - Throws appropriate errors if authentication or validation fails.
 * - Calls the injected addSolvedProblemUseCase with the validated data.
 */
export const addSolvedProblemController =
    (
        authenticationService: IAuthenticationService,
        addSolvedProblemUseCase: IAddSolvedProblemUseCase,
    ) =>
    async (input: unknown) => {
        const isAuthenticated = await authenticationService.isAuthenticated();
        if (!isAuthenticated)
            throw new UnauthenticatedError('User must be logged in.');

        const userId = await authenticationService.getCurrentUserId();
        if (!userId) {
            throw new UnauthenticatedError('User id does not exist');
        }

        const result = inputSchema.safeParse(input);

        if (!result.success) {
            throw new InputParseError('Invalid input', { cause: result.error });
        }

        const solve = await addSolvedProblemUseCase({ ...result.data, userId });
        return solvePresenter(solve);
    };
