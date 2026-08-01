import { IPointerRepository, Pointer, PointerNotFoundError } from '../../../domain/pointer';

export class GetPointerUseCase {
  constructor(private readonly pointerRepository: IPointerRepository) {}

  public async execute(pointerId: string): Promise<Pointer> {
    const pointer = await this.pointerRepository.findById(pointerId);
    if (!pointer) {
      throw new PointerNotFoundError(pointerId);
    }
    return pointer;
  }
}
