import { IPointerRepository, Pointer } from '../../../domain/pointer';

export class ListProviderPointersUseCase {
  constructor(private readonly pointerRepository: IPointerRepository) {}

  public async execute(providerId: string): Promise<Pointer[]> {
    return this.pointerRepository.findByProvider(providerId);
  }
}
