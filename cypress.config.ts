import { defineConfig } from 'cypress';
import { prisma } from './lib/prisma';

export default defineConfig({
    e2e: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        setupNodeEvents(on, config) {
            on('task', {
                async deleteCypressUsers() {
                    console.log('Deleting Cypress test users...');
                    await prisma.user.deleteMany({
                        where: { uuid: { startsWith: 'cypress' } },
                    });
                    return null;
                },
            });
        },
        baseUrl: 'http://localhost:3000',
    },
});
