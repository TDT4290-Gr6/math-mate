import type { IAuthenticationService } from '@/application/services/auth.service.interface';

export class MockAuthenticationService implements IAuthenticationService {
    private userMap: Map<string, string> = new Map(); // sessionId -> userId

    async validateSession(sessionId: string): Promise<boolean> {
        return this.userMap.has(sessionId);
    }
    async createSession(userId: string): Promise<string> {
        const sessionId = `session-${Math.random().toString(36)}`;
        this.userMap.set(sessionId, userId);
        return sessionId;
    }
    async invalidateSession(sessionId: string): Promise<boolean> {
        return this.userMap.delete(sessionId);
    }
}
