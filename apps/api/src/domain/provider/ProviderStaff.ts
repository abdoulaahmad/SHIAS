export class ProviderStaff {
  constructor(
    public readonly id: string,
    public readonly providerId: string,
    public readonly userId: string,
    public readonly role: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(props: { id: string; providerId: string; userId: string; role: string }): ProviderStaff {
    const now = new Date();
    return new ProviderStaff(
      props.id,
      props.providerId,
      props.userId,
      props.role,
      now,
      now
    );
  }
}
