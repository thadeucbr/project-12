import { v4 as uuidv4 } from 'uuid';

import { v4 as uuidv4 } from 'uuid';

interface SessionToken {
  token: string;
  createdAt: number;
  expiresAt: number;
  ip?: string; // Optional: to bind token to IP, though can cause issues with NAT/proxies
}

class SessionService {
  private tokens: Map<string, SessionToken> = new Map();
  private TOKEN_LIFETIME_MS = 10 * 60 * 1000; // 10 minutes

  constructor() {
    // Clean up expired tokens periodically
    setInterval(() => this.cleanupExpiredTokens(), 60 * 1000); // Every minute
  }

  public generateToken(ip?: string): string {
    const token = uuidv4();
    const now = Date.now();
    const expiresAt = now + this.TOKEN_LIFETIME_MS;

    this.tokens.set(token, {
      token,
      createdAt: now,
      expiresAt,
      ip,
    });
    return token;
  }

  public validateToken(token: string, ip?: string): boolean {
    const sessionToken = this.tokens.get(token);

    if (!sessionToken) {
      return false; // Token not found
    }

    if (sessionToken.expiresAt < Date.now()) {
      this.tokens.delete(token); // Token expired, remove it
      return false;
    }

    // Optional: IP binding check
    if (sessionToken.ip && ip && sessionToken.ip !== ip) {
      return false; // Token used from different IP
    }

    return true; // Token is valid
  }

  public invalidateToken(token: string): void {
    this.tokens.delete(token);
  }

  private cleanupExpiredTokens(): void {
    const now = Date.now();
    for (const [token, sessionToken] of this.tokens.entries()) {
      if (sessionToken.expiresAt < now) {
        this.tokens.delete(token);
      }
    }
  }
}

export const sessionService = new SessionService();
