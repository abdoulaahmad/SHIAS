import { IAccessGrantRepository, AccessGrant, AccessGrantNotFoundError } from '../../../domain/access';

export class GetAccessGrantUseCase {
  constructor(private readonly accessGrantRepository: IAccessGrantRepository) {}

  async execute(id: string): Promise<AccessGrant> {
    const grant = await this.accessGrantRepository.findById(id);
    if (!grant) {
      throw new AccessGrantNotFoundError(id);
    }
    return grant;
  }
}
