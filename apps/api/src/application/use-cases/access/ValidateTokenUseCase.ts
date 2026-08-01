import { IAccessTokenService, IAccessGrantRepository, AccessStatus } from '../../../domain/access';

export class ValidateTokenUseCase {
  constructor(
    private readonly tokenService: IAccessTokenService,
    private readonly grantRepository: IAccessGrantRepository
  ) {}

  async execute(tokenValue: string): Promise<{ valid: boolean; reason?: string; grantId?: string }> {
    const payload = await this.tokenService.verifyToken(tokenValue);
    if (!payload) {
      return { valid: false, reason: 'Invalid or expired token signature' };
    }

    const grant = await this.grantRepository.findById(payload.grantId);
    if (!grant) {
      return { valid: false, reason: 'Grant not found' };
    }

    if (grant.status !== AccessStatus.ACTIVE) {
      return { valid: false, reason: `Grant status is ${grant.status}` };
    }

    if (grant.isExpired()) {
      return { valid: false, reason: 'Grant is expired' };
    }

    return { valid: true, grantId: grant.id.value };
  }
}
