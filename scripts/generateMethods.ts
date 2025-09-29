import { Method, Problem } from './problem.entity';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { z } from 'zod';

const MethodSchema = z.object({
    title: z.string(),
    description: z.string(),
    steps: z.array(z.string()),
});

const ProblemMethodsResponseSchema = z.object({
    title: z.string(),
    methods: z.array(MethodSchema),
});

dotenv.config({ quiet: true });

const token = process.env['GITHUB_TOKEN'];
const endpoint = 'https://models.github.ai/inference';
const model = 'openai/gpt-5';

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

async function generateMethodsForProblem(problem: Problem) {
    const client = new OpenAI({ baseURL: endpoint, apiKey: token });

    const response = await client.chat.completions.create({
        model: model,
        messages: [
            { role: 'system', content: giveStepsPrompt },
            { role: 'user', content: problem.description },
            {
                role: 'user',
                content: `Subject: ${problem.topic}. Final answer: $${problem.solution}$`,
            },
        ],
        response_format: {
            type: 'json_schema',
            json_schema: {
                name: 'problem_methods',
                strict: true,
                schema: z.toJSONSchema(ProblemMethodsResponseSchema),
            },
        },
    });

    const message = response.choices[0]?.message;

    return ProblemMethodsResponseSchema.parse(
        JSON.parse(message.content || ''),
    );
}

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

export async function generateMethods(problem: Problem): Promise<Problem> {
    if (problem.methods.length !== 0) {
        return problem;
    }

    const answer = await generateMethodsForProblem(problem);
    if (!answer) {
        throw new Error('No parsed response from OpenAI');
    }

    const returnProblem = { ...problem };
    returnProblem.title = answer.title;

    const methods = parseMethods(answer.methods);
    returnProblem.methods = methods;

    return returnProblem;
}
