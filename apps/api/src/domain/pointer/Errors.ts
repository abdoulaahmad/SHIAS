export class InvalidPointerStateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidPointerStateError';
  }
}

export class DuplicatePointerError extends Error {
  constructor(message: string = 'A pointer for this external record already exists.') {
    super(message);
    this.name = 'DuplicatePointerError';
  }
}

export class InvalidStorageLocationError extends Error {
  constructor(message: string = 'Storage location must be a secure HTTPS URI.') {
    super(message);
    this.name = 'InvalidStorageLocationError';
  }
}

export class ClinicalPayloadError extends Error {
  constructor(message: string = 'Pointers must not contain clinical payloads.') {
    super(message);
    this.name = 'ClinicalPayloadError';
  }
}

export class PointerNotFoundError extends Error {
  constructor(id: string) {
    super(`Pointer with id ${id} not found.`);
    this.name = 'PointerNotFoundError';
  }
}
