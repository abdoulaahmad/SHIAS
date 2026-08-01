import { User } from './User';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface TokenPayload {
  sub: string;
  role?: string;
  type?: string;
  jti: string;
}

export interface ITokenService {
  generateTokens(user: User): AuthTokens;
  verifyAccessToken(token: string): TokenPayload | null;
  verifyRefreshToken(token: string): TokenPayload | null;
}
