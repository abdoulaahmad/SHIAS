import { Role } from './Role';

export class User {
  constructor(
    public readonly id: string,
    public readonly healthId: string | null,
    public name: string,
    public email: string,
    public passwordHash: string,
    public role: Role,
    public readonly createdAt: Date,
    public updatedAt: Date,
    public deletedAt: Date | null
  ) {}

  static createPatient(props: { id: string; healthId: string; name: string; email: string; passwordHash: string }): User {
    const now = new Date();
    return new User(
      props.id,
      props.healthId,
      props.name,
      props.email,
      props.passwordHash,
      Role.PATIENT,
      now,
      now,
      null
    );
  }

  static createProviderStaff(props: { id: string; name: string; email: string; passwordHash: string }): User {
    const now = new Date();
    return new User(
      props.id,
      null,
      props.name,
      props.email,
      props.passwordHash,
      Role.PROVIDER,
      now,
      now,
      null
    );
  }
}
