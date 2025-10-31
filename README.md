# Math-mate

## Getting Started

First, run the development server:

```bash
npm install
# then:
npm run prisma:generate
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

## Environment Variables

The following environment variables are required for all development and production environments:

- `NEXT_AUTH_GITHUB_ID` - GitHub OAuth App Client ID (used for GitHub authentication)
- `NEXT_AUTH_GITHUB_SECRET` - GitHub OAuth App Client Secret (used for GitHub authentication)
- `NEXT_AUTH_GOOGLE_ID` - Google OAuth App Client ID (used for Google authentication)
- `NEXT_AUTH_GOOGLE_SECRET` - Google OAuth App Client Secret (used for Google authentication)
- `AUTH_SECRET` - Secret used to sign and encrypt authentication tokens
- `DATABASE_URL` - Database connection URL (used by Prisma)
- `OPENAI_API_KEY` - OpenAI API key (used for generating steps and for the chat feature)

The following environment variable is required for when deploying to production:

- `NEXTAUTH_URL` - The URL of the deployed application (e.g. `https://mathmate.example.com`). Defaults to `http://localhost:3000` if not set.

The following environment variable are optional:

- `GEMINI_TOKEN` - Gemini API key (used for generating steps)
- `CYPRESS_TESTING` - Set to `true` to have the option to bypass authentication on build for end-to-end testing (IMPORTANT: should only be used in testing environments)
- `STANDALONE_BUILD` - Set to `true` to enable Next.js standalone build mode (used automatically in Docker deployment)

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

### Unit tests

Our project uses Vitest as the testing framework for running unit tests.

The unit tests are located in the tests/unit/ folder and all files follow the naming convention:

```bash
filename.test.ts
```

To run the unit tests, use:

```bash
npm run test
```

This command executes Vitest in the console and provides live feedback on test results.

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
npm run prisma:generate
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

## Deployment

When deploying to production, there are some environment variables that need to be set. Especially important for production, is to set the `NEXTAUTH_URL` variable to the URL of your deployed application, e.g. `https://mathmate.example.com` (if not set, it will default to `http://localhost:3000`).

### Docker

The application can be run using Docker. To build and start the application using Docker Compose, run the following command:

```bash
docker compose up --build -d
```

Stopping the application can be done using:

```bash
docker compose down
```
