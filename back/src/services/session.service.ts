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

  public generateToken(): string {
    const token = uuidv4();
    const now = Date.now();
    const expiresAt = now + this.TOKEN_LIFETIME_MS;

    this.tokens.set(token, {
      token,
      createdAt: now,
      expiresAt,
    });
    return token;
  }

  public validateToken(token: string): boolean {
    const sessionToken = this.tokens.get(token);

    if (!sessionToken) {
      return false; // Token not found
    }

    if (sessionToken.expiresAt < Date.now()) {
      this.tokens.delete(token); // Token expired, remove it
      return false;
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
