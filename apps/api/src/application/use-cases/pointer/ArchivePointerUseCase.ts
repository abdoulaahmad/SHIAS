import { IPointerRepository, PointerNotFoundError } from '../../../domain/pointer';

export class ArchivePointerUseCase {
  constructor(private readonly pointerRepository: IPointerRepository) {}

  public async execute(pointerId: string): Promise<void> {
    const pointer = await this.pointerRepository.findById(pointerId);
    if (!pointer) {
      throw new PointerNotFoundError(pointerId);
    }
    
    pointer.archive();
    await this.pointerRepository.save(pointer);
  }
}
