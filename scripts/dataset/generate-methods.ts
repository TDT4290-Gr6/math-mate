import {
    type ProblemMethodsGenerator,
    LLMProviderType,
    type ProblemMethodsResponseSchema,
} from './types';
import type { ProblemInsert } from '@/entities/models/problem';
import { generateMethodsOpenAI } from './providers/openai';
import { generateMethodsGemini } from './providers/gemini';
import { z } from 'zod';

const PROVIDERS: Record<LLMProviderType, ProblemMethodsGenerator> = {
    [LLMProviderType.OPENAI]: generateMethodsOpenAI,
    [LLMProviderType.GEMINI]: generateMethodsGemini,
};

export const giveStepsPrompt = `You are an educational assistant specializing in teaching mathematics. Your task is to guide students by demonstrating three diverse methods for solving a given math problem.

First, create a short and concise title for the problem. This title does not need to include every detail of the problem. Then, for each of the three methods, provide the following details:

For each method:
- Provide a very short, but descriptive title for the method
- Write a brief explanation describing the relevance of the method to the problem without including specific solution steps
- Outline the solution process using a list of steps. Each step should:
  - Be a single, concise line without sub-steps
  - Focus on providing educational value, by letting the user know what they should do next, instead of you solving each step for them
  - Avoid including the final answer in any steps except the very last
  - Ensure the final step explicitly provides the final answer
  - The final step should not include any additional calculations or explanations, just the final answer

  The three methods should represent different approaches to solving the same problem, such as:
  - Different mathematical techniques (e.g. algebraic vs geometric vs numerical)
  - Different levels of complexity or abstraction
  - Different problem-solving strategies

Guidelines:
- When using mathematical expressions, use LaTeX formatting wrapped in \`$\` (e.g., $x^2$, $\\frac{a}{b}$)
- Each method should use a different mathematical approach or technique
- Steps should be clear and educational, suitable for students learning the concept
- Do not perform actual calculations in your response - focus on the methodology
- Each step should be concise and fit on a single line
- You should under no circumstances include any additional comments like "(do not compute here)", "(do not simplify here)", "(leave the arithmetic until the last step)" or similar
- Again, remember to use LaTeX formatting for all mathematical expressions, wrapped in $, not in parenthesis.
`;

/**
 * Generates solution methods for a given math problem using the specified LLM provider.
 *
 * If the problem already contains methods, generation is skipped and the original problem is returned.
 * Otherwise, it invokes the appropriate provider to generate methods based on the problem and a prompt.
 *
 * @param problem - The math problem for which to generate solution methods.
 * @param llmProvider - The LLM provider to use for generating methods.
 * @returns A promise that resolves to the problem with generated methods.
 * @throws If no response is parsed from the LLM provider.
 */
export async function generateMethods(
    problem: ProblemInsert,
    llmProvider: LLMProviderType,
): Promise<z.infer<typeof ProblemMethodsResponseSchema>> {
    if (problem.methods.length !== 0) {
        // Methods already exist, skip generation
        return {
            title: problem.title ?? '',
            methods: problem.methods.map((method) => ({
                title: method.title,
                description: method.description,
                steps: method.steps.map((step) => step.content),
            })),
        };
    }

    // Select the appropriate method generator based on the LLM provider
    const generateMethodsForProblem = PROVIDERS[llmProvider];

    // Generate methods using the selected provider
    const answer = await generateMethodsForProblem(problem, giveStepsPrompt);
    if (!answer) {
        throw new Error(`No parsed response from ${llmProvider}`);
    }

    return answer;
}
