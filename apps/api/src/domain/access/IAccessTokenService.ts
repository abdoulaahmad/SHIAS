import { AccessToken } from './ValueObjects';
import { AccessGrant } from './AccessGrant';

export interface IAccessTokenService {
  generateToken(grant: AccessGrant): Promise<AccessToken>;
  verifyToken(tokenValue: string): Promise<{ grantId: string } | null>;
}
