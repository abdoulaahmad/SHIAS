import jwt from 'jsonwebtoken';
import { IAccessTokenService, AccessGrant, AccessToken } from '../../domain/access';

export class JwtAccessTokenService implements IAccessTokenService {
  private readonly secretKey: string;
  
  constructor() {
    this.secretKey = process.env.JWT_SECRET || 'fallback-secret-for-dev';
  }

  async generateToken(grant: AccessGrant): Promise<AccessToken> {
    const payload = {
      grantId: grant.id.value,
      patientId: grant.patientId,
      providerId: grant.providerId,
      purpose: grant.purpose,
      pointerIds: grant.pointerIds
    };
    
    // Convert expiration Date to unix timestamp (seconds)
    const exp = Math.floor(grant.expiresAt.getTime() / 1000);

    const token = jwt.sign(payload, this.secretKey, {
      algorithm: 'HS256',
      // DO NOT USE expiresIn string IF explicitly setting exp in payload, 
      // but we can just use expiresIn if we pass a number, or just pass exp directly
    });
    
    // Better yet, just pass exp directly to jsonwebtoken by merging it in payload
    const tokenWithExp = jwt.sign({ ...payload, exp }, this.secretKey, {
      algorithm: 'HS256'
    });

    return new AccessToken(tokenWithExp);
  }

  async verifyToken(tokenValue: string): Promise<{ grantId: string } | null> {
    try {
      const decoded = jwt.verify(tokenValue, this.secretKey) as jwt.JwtPayload;
      if (!decoded || !decoded.grantId) {
        return null;
      }
      return { grantId: decoded.grantId };
    } catch (err) {
      return null;
    }
  }
}
