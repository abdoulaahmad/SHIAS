import { IUserRepository, IPasswordHasher, User, DuplicateEmailError, DuplicateHealthIdError } from '../../domain/identity';

export interface RegisterPatientRequest {
  id: string;
  healthId: string;
  name: string;
  email: string;
  password: string;
}

import { IDomainEventPublisher } from '../../domain/events/IDomainEventPublisher';

export class RegisterPatientUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly eventPublisher: IDomainEventPublisher
  ) {}

  async execute(req: RegisterPatientRequest): Promise<void> {
    const existingByEmail = await this.userRepository.findByEmail(req.email);
    if (existingByEmail) {
      throw new DuplicateEmailError(req.email);
    }
    const existingByHealthId = await this.userRepository.findByHealthId(req.healthId);
    if (existingByHealthId) {
      throw new DuplicateHealthIdError(req.healthId);
    }

    const passwordHash = await this.passwordHasher.hash(req.password);
    
    const user = User.createPatient({
      id: req.id,
      healthId: req.healthId,
      name: req.name,
      email: req.email,
      passwordHash
    });

    await this.userRepository.save(user);

    await this.eventPublisher.publish({
      eventName: 'PatientRegistered',
      occurredOn: new Date(),
      actorId: req.id,
      email: req.email
    } as any);
  }
}
