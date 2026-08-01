import * as jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { ITokenService, AuthTokens, User, TokenPayload } from '../../domain/identity';

export class JwtTokenService implements ITokenService {
  private readonly jwtSecret: string;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'fallback-secret-for-development-only';
  }

  generateTokens(user: User): AuthTokens {
    const jti = randomUUID();
    const expiresIn = 900; // 15 minutes in seconds
    
    const payload = {
      sub: user.id,
      role: user.role,
      jti
    };

    const accessToken = jwt.sign(payload, this.jwtSecret, { expiresIn: '15m' });
    
    const refreshToken = jwt.sign(
      { sub: user.id, type: 'refresh', jti: randomUUID() },
      this.jwtSecret,
      { expiresIn: '30d' }
    );

    return {
      accessToken,
      refreshToken,
      expiresIn
    };
  }

  verifyAccessToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, this.jwtSecret) as TokenPayload;
    } catch {
      return null;
    }
  }

  verifyRefreshToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as TokenPayload;
      if (decoded.type !== 'refresh') return null;
      return decoded;
    } catch {
      return null;
    }
  }
}
