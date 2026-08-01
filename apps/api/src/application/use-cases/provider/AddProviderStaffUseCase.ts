import { IProviderStaffRepository, ProviderStaff, ProviderNotFoundError, IProviderRepository } from '../../../domain/provider';
import { IUserRepository, UserNotFoundError } from '../../../domain/identity';
import { DomainError } from '../../../domain/identity/Errors';

export class DuplicateProviderStaffError extends DomainError {
  constructor(userId: string, providerId: string) {
    super(`User ${userId} is already staff for provider ${providerId}`, 'DUPLICATE_PROVIDER_STAFF');
  }
}

export interface AddProviderStaffRequest {
  id?: string;
  providerId: string;
  userId: string;
  role: string;
}

export class AddProviderStaffUseCase {
  constructor(
    private readonly providerStaffRepository: IProviderStaffRepository,
    private readonly providerRepository: IProviderRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(req: AddProviderStaffRequest): Promise<ProviderStaff> {
    const provider = await this.providerRepository.findById(req.providerId);
    if (!provider) throw new ProviderNotFoundError(req.providerId);

    const user = await this.userRepository.findById(req.userId);
    if (!user) throw new UserNotFoundError(req.userId);

    const existing = await this.providerStaffRepository.findByProviderAndUser(req.providerId, req.userId);
    if (existing) {
      throw new DuplicateProviderStaffError(req.userId, req.providerId);
    }

    const staffId = req.id || crypto.randomUUID();
    const staff = ProviderStaff.create({
      id: staffId,
      providerId: req.providerId,
      userId: req.userId,
      role: req.role
    });

    await this.providerStaffRepository.save(staff);
    return staff;
  }
}
