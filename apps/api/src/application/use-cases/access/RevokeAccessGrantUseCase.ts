import { IAccessGrantRepository, AccessGrant, AccessGrantNotFoundError, UnauthorizedAccessRevocationError } from '../../../domain/access';

export interface RevokeAccessGrantRequest {
  grantId: string;
  patientId: string;
}

export class RevokeAccessGrantUseCase {
  constructor(private readonly accessGrantRepository: IAccessGrantRepository) {}

  async execute(req: RevokeAccessGrantRequest): Promise<AccessGrant> {
    const grant = await this.accessGrantRepository.findById(req.grantId);
    if (!grant) {
      throw new AccessGrantNotFoundError(req.grantId);
    }
    
    if (grant.patientId !== req.patientId) {
      throw new UnauthorizedAccessRevocationError();
    }

    grant.revoke();
    await this.accessGrantRepository.save(grant);
    
    // An event could be published here: AccessRevokedEvent if we had one.
    return grant;
  }
}
