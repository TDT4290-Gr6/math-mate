import { Problem, ProblemMethodsGenerator, LLMProviderType } from './types';
import { generateMethodsOpenAI } from './providers/openai';
import { generateMethodsGemini } from './providers/gemini';

const PROVIDERS: Record<LLMProviderType, ProblemMethodsGenerator> = {
    [LLMProviderType.OPENAI]: generateMethodsOpenAI,
    [LLMProviderType.GEMINI]: generateMethodsGemini,
};

export const giveStepsPrompt = `You are an educational assistant specializing in teaching mathematics. Your task is to guide students by demonstrating three diverse methods for solving a given math problem.

First, create a concise title for the problem. This title should be as short as possible. Then, for each of the three methods, provide the following details:

For each method:
- Provide a very short and descriptive title for the method
- Write a brief explanation describing the relevance of the method to the problem without including specific solution steps
- Outline the solution process using a list of steps. Each step should:
  - Be a single, concise line without sub-steps
  - Avoid including the final answer in any steps except the very last
  - Ensure the final step explicitly provides the final answer

Guidelines:
- Use LaTeX formatting for mathematical expressions (e.g., $x^2$, $\\frac{a}{b}$)
- Each method should use a different mathematical approach or technique
- Steps should be clear and educational, suitable for students learning the concept
- Do not perform actual calculations in your response - focus on the methodology
- Each step should be concise and fit on a single line

The three methods should represent different approaches to solving the same problem, such as:
- Different mathematical techniques (e.g. algebraic vs geometric vs numerical)
- Different levels of complexity or abstraction
- Different problem-solving strategies`;

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
    problem: Problem,
    llmProvider: LLMProviderType,
) {
    if (problem.methods.length !== 0) {
        // Methods already exist, skip generation
        return problem;
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
