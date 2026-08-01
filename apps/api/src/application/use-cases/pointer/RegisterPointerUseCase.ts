import { 
  IPointerRepository, 
  Pointer, 
  PointerMetadata, 
  StorageLocation, 
  RecordType,
  DuplicatePointerError
} from '../../../domain/pointer';
import { IDomainEventPublisher } from '../../../domain/events/IDomainEventPublisher';

export interface RegisterPointerCommand {
  patientId: string;
  providerId: string;
  externalSystemId: string;
  externalRecordId: string;
  externalUri: string;
  recordType: RecordType;
  recordCreatedAt: Date;
}

export class RegisterPointerUseCase {
  constructor(
    private readonly pointerRepository: IPointerRepository,
    private readonly eventPublisher: IDomainEventPublisher
  ) {}

  public async execute(command: RegisterPointerCommand): Promise<Pointer> {
    const existing = await this.pointerRepository.findByExternalReference(
      command.providerId,
      command.externalSystemId,
      command.externalRecordId
    );

    if (existing) {
      throw new DuplicatePointerError();
    }

    const metadata = new PointerMetadata({
      externalSystemId: command.externalSystemId,
      externalRecordId: command.externalRecordId,
      externalUri: new StorageLocation(command.externalUri),
      recordType: command.recordType,
      recordCreatedAt: command.recordCreatedAt,
    });

    const pointer = Pointer.create({
      patientId: command.patientId,
      providerId: command.providerId,
      metadata,
    });

    await this.pointerRepository.save(pointer);

    await this.eventPublisher.publish({
      eventName: 'PointerRegistered',
      occurredOn: new Date(),
      actorId: command.providerId,
      pointerId: pointer.id,
      patientId: pointer.patientId,
      recordType: pointer.metadata.recordType
    } as any);

    return pointer;
  }
}
