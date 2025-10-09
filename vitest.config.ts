import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

// npm install vitest
// npm install vite-tsconfig-paths
export default defineConfig({
    plugins: [tsconfigPaths()],
});
