import { IProviderStaffRepository, UserNotProviderStaffError } from '../../../domain/provider';

export interface RemoveProviderStaffRequest {
  providerId: string;
  userId: string;
}

export class RemoveProviderStaffUseCase {
  constructor(private readonly providerStaffRepository: IProviderStaffRepository) {}

  async execute(req: RemoveProviderStaffRequest): Promise<void> {
    const existing = await this.providerStaffRepository.findByProviderAndUser(req.providerId, req.userId);
    if (!existing) {
      throw new UserNotProviderStaffError(req.userId, req.providerId);
    }

    await this.providerStaffRepository.delete(req.providerId, req.userId);
  }
}
