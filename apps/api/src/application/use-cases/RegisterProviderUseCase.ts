import { IUserRepository, IProviderRepository, IPasswordHasher, User, Provider, DuplicateEmailError, DuplicateNpiError } from '../../domain/identity';

export interface RegisterProviderRequest {
  providerId: string;
  userId: string;
  npi: string;
  providerName: string;
  type: string;
  userName: string;
  email: string;
  password: string;
}

import { IDomainEventPublisher } from '../../domain/events/IDomainEventPublisher';

export class RegisterProviderUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly providerRepository: IProviderRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly eventPublisher: IDomainEventPublisher
  ) {}

  async execute(req: RegisterProviderRequest): Promise<void> {
    const existingProvider = await this.providerRepository.findByNpi(req.npi);
    if (existingProvider) {
      throw new DuplicateNpiError(req.npi);
    }
    const existingUser = await this.userRepository.findByEmail(req.email);
    if (existingUser) {
      throw new DuplicateEmailError(req.email);
    }

    const passwordHash = await this.passwordHasher.hash(req.password);
    
    const provider = Provider.create({
      id: req.providerId,
      npi: req.npi,
      name: req.providerName,
      type: req.type
    });

    const user = User.createProviderStaff({
      id: req.userId,
      name: req.userName,
      email: req.email,
      passwordHash
    });

    await this.providerRepository.save(provider);
    await this.userRepository.save(user);

    // Create the ProviderStaff link between the user and the provider
    const { prisma } = require('@shias/database');
    await prisma.providerStaff.create({
      data: {
        providerId: provider.id,
        userId: user.id,
        role: 'ADMIN',
      }
    });

    await this.eventPublisher.publish({
      eventName: 'ProviderRegistered',
      occurredOn: new Date(),
      actorId: user.id,
      providerId: provider.id,
      npi: provider.npi,
      email: user.email
    } as any);
  }
}
