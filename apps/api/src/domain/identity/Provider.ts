export class Provider {
  constructor(
    public readonly id: string,
    public npi: string,
    public name: string,
    public type: string,
    public readonly createdAt: Date,
    public updatedAt: Date,
    public deletedAt: Date | null
  ) {}

  static create(props: { id: string; npi: string; name: string; type: string }): Provider {
    const now = new Date();
    return new Provider(
      props.id,
      props.npi,
      props.name,
      props.type,
      now,
      now,
      null
    );
  }
}
