import { IPointerRepository, Pointer, PointerNotFoundError, PointerStatus } from '../../../domain/pointer';

export interface UpdatePointerCommand {
  id: string;
  status?: PointerStatus;
}

export class UpdatePointerUseCase {
  constructor(private readonly pointerRepository: IPointerRepository) {}

  public async execute(command: UpdatePointerCommand): Promise<Pointer> {
    const pointer = await this.pointerRepository.findById(command.id);
    if (!pointer) {
      throw new PointerNotFoundError(command.id);
    }
    
    if (command.status === PointerStatus.REVOKED) {
      pointer.revoke();
    } else if (command.status === PointerStatus.ARCHIVED) {
      pointer.archive();
    }
    
    await this.pointerRepository.save(pointer);
    return pointer;
  }
}
