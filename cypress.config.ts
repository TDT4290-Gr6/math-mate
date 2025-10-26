import { defineConfig } from 'cypress';
import { prisma } from './lib/prisma';

export default defineConfig({
    e2e: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        setupNodeEvents(on, config) {
            on('after:run', async () => {
                try {
                    console.log('Deleting Cypress test users...');
                    const result = await prisma.user.deleteMany({
                        where: { uuid: { startsWith: 'cypress' } },
                    });
                    console.log(
                        `Successfully deleted ${result.count} Cypress test user(s).`,
                    );
                } catch (error) {
                    console.error(
                        'Failed to delete Cypress test users:',
                        error,
                    );
                }
            });
        },
        baseUrl: 'http://localhost:3000',
    },
});
