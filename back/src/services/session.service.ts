import { v4 as uuidv4 } from 'uuid';
import Session, { ISession } from '../models/session.model';

class SessionService {
  private TOKEN_LIFETIME_MS = 10 * 60 * 1000; // 10 minutes

  public async generateToken(): Promise<string> {
    const token = uuidv4();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.TOKEN_LIFETIME_MS);

    console.log(`DEBUG: Gerando novo token: ${token}. Expira em: ${expiresAt.toISOString()}`);

    const newSession = new Session({
      token,
      createdAt: now,
      expiresAt,
    });

    await newSession.save();
    console.log(`DEBUG: Token ${token} salvo no DB.`);
    return token;
  }

  public async validateToken(token: string): Promise<boolean> {
    console.log(`DEBUG: Validando token: ${token}`);
    const session = await Session.findOne({ token });

    if (!session) {
      console.log(`DEBUG: Token ${token} não encontrado no DB.`);
      return false; // Token not found
    }

    console.log(`DEBUG: Token ${token} encontrado no DB. Expira em: ${session.expiresAt.toISOString()}. Agora: ${new Date().toISOString()}`);
    if (session.expiresAt.getTime() < Date.now()) {
      console.log(`DEBUG: Token ${token} expirado. Removendo do DB.`);
      await Session.deleteOne({ token }); // Token expired, remove it
      return false;
    }

    console.log(`DEBUG: Token ${token} válido.`);
    return true; // Token is valid
  }

  public async invalidateToken(token: string): Promise<void> {
    console.log(`DEBUG: Invalidando token: ${token}`);
    await Session.deleteOne({ token });
    console.log(`DEBUG: Token ${token} removido do DB.`);
  }
}

export const sessionService = new SessionService();
