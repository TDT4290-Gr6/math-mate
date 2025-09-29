# Math-mate

## Getting Started

First, run the development server:

```bash
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
