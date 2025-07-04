import { v4 as uuidv4 } from 'uuid';
import Session, { ISession } from '../models/session.model';

class SessionService {
  private TOKEN_LIFETIME_MS = 10 * 60 * 1000; // 10 minutes

  public async generateToken(): Promise<string> {
    const token = uuidv4();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.TOKEN_LIFETIME_MS);

    const newSession = new Session({
      token,
      createdAt: now,
      expiresAt,
    });

    await newSession.save();
    return token;
  }

  public async validateToken(token: string): Promise<boolean> {
    const session = await Session.findOne({ token });

    if (!session) {
      console.log(`DEBUG: Token ${token} não encontrado no DB.`);
      return false; // Token not found
    }

    if (session.expiresAt.getTime() < Date.now()) {
      console.log(`DEBUG: Token ${token} expirado. Removendo do DB.`);
      await Session.deleteOne({ token }); // Token expired, remove it
      return false;
    }

    console.log(`DEBUG: Token ${token} válido.`);
    return true; // Token is valid
  }

  public async invalidateToken(token: string): Promise<void> {
    await Session.deleteOne({ token });
  }
}

export const sessionService = new SessionService();
