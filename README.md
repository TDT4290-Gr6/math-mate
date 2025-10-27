# Math-mate

## Getting Started

First, run the development server:

```bash
npm install
# then:
npx prisma generate
# then:
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Testing

### End-to-end tests

End-to-end tests are written using Cypress. The server has a dedicated mode for e2e testing, where authentication can be bypassed. To run the e2e tests, first build and start the server in e2e mode:

```bash
npm run e2e:build
npm run e2e:start
```

Then, in another terminal, either run the tests in headless mode:

```bash
npm run e2e:run
```

Or open the Cypress Test Runner:

```bash
npm run e2e:open
```

## Contributing

We follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for all commit messages.

This means each commit message should follow the format `<type>(<optional scope>): <short description> (#issue-number)`.

The main types are `fix` and `feat`, though others like `build`, `chore`, `ci`, `docs`, `style`, `refactor`, `perf` and `test` may also be used.

## Architecture

This project follows the principles of [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html). In short, this means:

- We keep business logic independent of frameworks
- Business logic lives in the inner layers (use cases, domain) without framework or DB code
- Frameworks and external services live in the outer layers
- Dependencies only point inwards, never from core logic outwards
- We follow a one controller per use case pattern, with each controller corresponding to a specific topic in the logical view

For a practical reference, see this example of [Clean Architecture in Next.js](https://github.com/nikolovlazar/nextjs-clean-architecture).

## Used packages

- tailwind
- prisma
- shadcn
- eslint/prettier
- ioctopus (for di)

## Prisma

Prisma is the project's ORM and database toolkit. It generates a type-safe database client from the schema and provides a convenient query API (via the generated Prisma Client) used throughout the app.

After updating the schema or pulling changes, generate the Prisma client with:

```bash
npx prisma generate
```

## Generating methods and steps for a dataset

There is a script in `scripts/dataset/generate-dataset.ts` that can be used to generate methods and steps for a dataset. This script would need to be modified depending on the structure of the dataset, to adhere to the `ProblemInsert` interface in `src/entities/models/problem.ts` (`methods` should be set to an empty array). The methods and steps will be generated when calling `generateMethods` defined in `scripts/dataset/generate-methods.ts`. Note, math problems using asymptote is not currently supported.

The generation of methods and steps can be done by either using OpenAI or Gemini, depending on the `llmProvider` variable passed to `generateMethods`. Running the script can be done by running `npm run generate-dataset`, and the problems and generated methods, steps and title will be stored in the database. Only problems that are not already in the database will be processed.

Currently the MATH-500 dataset is used. To use the script for MATH-500, you need to download the dataset from [Hugging Face](https://huggingface.co/datasets/HuggingFaceH4/MATH-500). The dataset should be placed in `MATH-500/test.jsonl`, and can be downloaded using git:

```bash
git lfs install
git clone git@hf.co:datasets/HuggingFaceH4/MATH-500
```

To use Gemini or OpenAI, you need to set the respective API keys in a `.env.local` file in the root of the project.

### OpenAI API key

You can get a OpenAI API key by creating a new API key on the [OpenAI platform](https://platform.openai.com/account/api-keys). Environment variable name: `OPENAI_API_KEY`.

### Gemini API key

You can get a Gemini API key by creating a new project in the [Gemini AI Studio](https://aistudio.google.com/api-keys). Environment variable name: `GEMINI_TOKEN`.
