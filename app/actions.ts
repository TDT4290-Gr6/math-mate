'use server';

import {
    clearConversation,
    SendMessageResult,
} from '@/application/use-cases/send-chat-message.use-case';
import type { Problem } from '@/entities/models/problem';
import { getInjection } from '@/di/container';

/**
 * Retrieves a paginated list of problems filtered by subjects.
 *
 * @param offset - The starting index for fetching problems.
 * @param limit - The maximum number of problems to fetch.
 * @param subjects - Array of subject names to filter problems by.
 * @returns A promise that resolves with an array of `Problem` objects.
 * @throws Logs and rethrows any error encountered while fetching problems.
 */
export async function getProblems(
    offset: number,
    limit: number,
    subjects: string[],
): Promise<Problem[]> {
    try {
        const getProblemsController = getInjection('IGetProblemsController');
        const problems = await getProblemsController({
            offset,
            limit,
            subjects,
        });
        return problems;
    } catch (error) {
        console.error('Failed to get problems:', error);
        throw error;
    }
}

/**
 * Retrieves a single problem by its ID.
 *
 * @param problemId - The ID of the problem to fetch.
 * @returns A promise that resolves with a `Problem` object.
 * @throws Logs and rethrows any error encountered while fetching the problem.
 */
export async function getProblem(problemId: number): Promise<Problem> {
    try {
        const getProblemController = getInjection('IGetProblemController');
        return await getProblemController({ problemId });
    } catch (error) {
        console.error('Failed to get problem:', error);
        throw error;
    }
}

/**
 * Retrieves a list of countries available for selection.
 *
 * @returns A promise that resolves with an array of country objects.
 * @throws Logs and rethrows any error encountered while fetching countries.
 */
export async function getCountries() {
    try {
        const getCountriesController = getInjection('IGetCountriesController');
        return await getCountriesController();
    } catch (error) {
        console.error('Failed to get countries:', error);
        throw error;
    }
}

/**
 * Retrieves the current user's selected country.
 *
 * @returns A promise that resolves with the country ID of the current user.
 * @throws Logs and rethrows any error encountered while fetching the user's country.
 */
export async function getCountry() {
    try {
        const getUserController = getInjection('IGetUserController');
        const user = await getUserController();
        return user.countryId;
    } catch (error) {
        console.error('Failed to get country for current user:', error);
        throw error;
    }
}

/**
 * Sets the current user's country.
 *
 * @param countryId - The ID of the country to set for the user.
 * @returns A promise that resolves with the updated user or country info.
 * @throws Logs and rethrows any error encountered while setting the user's country.
 */
export async function setCountry(countryId: number) {
    try {
        const setCountryController = getInjection('ISetCountryController');
        return await setCountryController({ countryId });
    } catch (error) {
        console.error('Failed to set country for current user:', error);
        throw error;
    }
}

/**
 * Retrieves the current user's ID.
 *
 * @returns A promise that resolves with the user's ID.
 * @throws Logs and rethrows any error encountered while fetching the user ID.
 */
export async function getUserId() {
    try {
        const getUserController = getInjection('IGetUserController');
        const user = await getUserController();
        return user.id;
    } catch (error) {
        console.error('Failed to get user ID:', error);
        throw error;
    }
}

/**
 * Sends a user message to the chat controller and returns the AI assistant's response.
 *
 * This server-side action performs the following steps:
 * 1. Retrieves the `ISendChatMessageController` instance from the dependency injection container.
 * 2. Calls the controller with the provided context and message string.
 * 3. Returns the assistant's response.
 * 4. Catches and logs any errors that occur during the process, then returns a failure result to the caller.
 *
 * @param {string} context - The problem context (e.g., problem statement, method, steps, current step) to provide to the chatbot.
 * @param {string} message - The user's message to be sent to the chat service.
 * @returns {Promise<SendMessageResult>} - A success object with the assistant's message, or a failure object with an error message.
 *
 * @throws {Error} Throws a generic error if the chat controller fails or the message cannot be sent.
 */
export async function sendMessageAction(
    context: string,
    message: string,
): Promise<SendMessageResult> {
    try {
        const chatController = getInjection('ISendChatMessageController');

        const reply = await chatController(context, message);
        return reply;
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error('Failed to send message:', err.message);
            return {
                success: false,
                error: 'Failed to send message. Please try again.',
            };
        } else {
            console.error('Failed to send message:', err);
            return {
                success: false,
                error: 'Failed to send message. Please try again.',
            };
        }
    }
}

/**
 * Clears the current user's conversation history.
 *
 * This function retrieves the current authenticated user via the injected `IGetUserController`,
 * then calls `clearConversation` with the user's ID to remove their conversation data.
 * Any errors encountered during this process are caught and logged to the console.
 *
 * @async
 * @function clearConversationAction
 * @returns {Promise<void>} A promise that resolves when the conversation has been cleared.
 * @throws Will log an error to the console if retrieving the user or clearing the conversation fails.
 */
export async function clearConversationAction(): Promise<void> {
    try {
        const getUserController = getInjection('IGetUserController');
        const user = await getUserController();
        clearConversation(user.id);
    } catch (error) {
        console.error('Failed to clear conversation:', error);
    }
}

/**
 * Adds a record for a solved problem.
 *
 * @param problemId - The id of the problem that was solved.
 * @param stepsUsed - The number of solution steps the user used to solve the problem. Should be 0 if user used "Solve on your own".
 * @param startedSolvingAt - Timestamp indicating when the user started solving the problem.
 * @param finishedSolvingAt - Optional timestamp indicating when the user finished solving the problem.
 * @param feedback - Optional numeric difficulty feedback. 1 (easiest) to 5 (hardest).
 *
 * @returns A promise that resolves with the value returned with the insertion info from the controller.
 *
 * @throws Rethrows any error encountered while retrieving the controller or invoking it. Errors are logged to the console before being rethrown.
 */
export async function addSolvedProblem(
    problemId: number,
    stepsUsed: number,
    startedSolvingAt: Date,
    finishedSolvingAt?: Date,
    feedback?: number,
    wasCorrect?: boolean,
) {
    try {
        const addSolvedProblemController = getInjection(
            'IAddSolvedProblemController',
        );
        return await addSolvedProblemController({
            problemId,
            stepsUsed,
            startedSolvingAt,
            finishedSolvingAt,
            feedback,
            wasCorrect,
        });
    } catch (error) {
        console.error('Failed to add solved problem:', error);
        throw error;
    }
}

/**
 * Retrieves the latest solves for the current user.
 *
 * @returns A promise that resolves with a list of the latest solves for the user.
 */
export async function getLatestSolves() {
    try {
        const getLatestSolvesController = getInjection(
            'IGetLatestSolvesController',
        );
        const solves = await getLatestSolvesController();
        return solves;
    } catch (error) {
        console.error('Failed to get latest solves:', error);
        throw error;
    }
}

/**
 * Saves an event by invoking the injected createEvent controller.
 *
 * @param sessionId - Numeric identifier for the current session.
 * @param actionName - Name of the action being recorded (e.g., "chat_message_sent").
 * @param problemId - Optional identifier for the related problem, if applicable.
 * @param methodId - Optional identifier for the selected method, if applicable.
 * @param stepId - Optional identifier for the step within a method/problem, if applicable.
 * @param payload - Arbitrary string payload (e.g., serialized JSON) containing event details.
 *
 * @returns A promise that resolves with the id and loggedAt timestamp of the created event.
 */
export async function saveEvent(
    sessionId: number,
    actionName: string,
    problemId: number | undefined,
    methodId: number | undefined,
    stepId: number | undefined,
    payload: string,
) {
    try {
        const createEventController = getInjection('ICreateEventController');
        const response = await createEventController({
            sessionId,
            actionName,
            problemId,
            methodId,
            stepId,
            payload,
        });
        return response;
    } catch (error) {
        console.error('Failed to log event:', error);
        throw error;
    }
}
