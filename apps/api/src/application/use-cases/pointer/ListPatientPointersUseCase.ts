import { IPointerRepository, Pointer } from '../../../domain/pointer';

export class ListPatientPointersUseCase {
  constructor(private readonly pointerRepository: IPointerRepository) {}

  public async execute(patientId: string): Promise<Pointer[]> {
    return this.pointerRepository.findByPatient(patientId);
  }
}
