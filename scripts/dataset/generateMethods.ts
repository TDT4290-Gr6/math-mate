import {
    Method,
    MethodSchema,
    Problem,
    ProblemMethodsGenerator,
    LLMProviderType,
} from './types';
import { generateMethodsOpenAI } from './providers/openai';
import { generateMethodsGemini } from './providers/gemini';
import { z } from 'zod';

const PROVIDERS: Record<LLMProviderType, ProblemMethodsGenerator> = {
    [LLMProviderType.OPENAI]: generateMethodsOpenAI,
    [LLMProviderType.GEMINI]: generateMethodsGemini,
};

export const giveStepsPrompt = `You are an educational assistant specializing in teaching mathematics. Your task is to guide students by demonstrating three diverse methods for solving a given math problem.

First, create a concise title for the problem. Then, for each of the three methods, provide the following details:

For each method:
- Provide a very short and descriptive title for the method
- Write a brief explanation describing the relevance of the method to the problem without including specific solution steps
- Outline the solution process using a list of steps. Each step should:
  - Be a single, concise line without sub-steps
  - Avoid stating the final answer until the last step
  - Ensure the final step explicitly provides the final answer

Guidelines:
- Use LaTeX formatting for mathematical expressions (e.g., $x^2$, $\\frac{a}{b}$)
- Each method should use a different mathematical approach or technique
- Steps should be clear and educational, suitable for students learning the concept
- Do not perform actual calculations in your response - focus on the methodology
- Each step should be concise and fit on a single line

The three methods should represent different approaches to solving the same problem, such as:
- Different mathematical techniques (algebraic vs geometric vs numerical)
- Different levels of complexity or abstraction
- Different problem-solving strategies`;

function parseMethods(response: z.infer<typeof MethodSchema>[]) {
    const methods: Method[] = response.map((item, index: number) => ({
        methodID: `method_${index + 1}`,
        title: item.title,
        description: item.description,
        steps: item.steps.map((step: string, index: number) => ({
            stepID: `step_${index + 1}`,
            content: step,
        })),
    }));

    return methods;
}

export async function generateMethods(
    problem: Problem,
    llmProvider: LLMProviderType,
): Promise<Problem> {
    if (problem.methods.length !== 0) {
        // Methods already exist, skip generation
        return problem;
    }

    const generateMethodsForProblem = PROVIDERS[llmProvider];
    const answer = await generateMethodsForProblem(problem, giveStepsPrompt);
    if (!answer) {
        throw new Error(`No parsed response from ${llmProvider}`);
    }

    const returnProblem = { ...problem };

    const methods = parseMethods(answer.methods);
    returnProblem.methods = methods;
    returnProblem.title = answer.title;

    return returnProblem;
}
