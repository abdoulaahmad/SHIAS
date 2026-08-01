import { describe, it, expect } from 'vitest';
import { User } from './User';
import { Role } from './Role';
import { randomUUID } from 'crypto';

describe('User Domain Entity', () => {
  it('should create a valid patient user', () => {
    const id = randomUUID();
    const user = User.createPatient({
      id,
      healthId: 'H123456',
      name: 'John Doe',
      email: 'john@example.com',
      passwordHash: 'hashedpassword'
    });

    expect(user.id).toBe(id);
    expect(user.healthId).toBe('H123456');
    expect(user.role).toBe(Role.PATIENT);
  });

  it('should create a valid provider staff user', () => {
    const id = randomUUID();
    const user = User.createProviderStaff({
      id,
      name: 'Dr. Smith',
      email: 'smith@hospital.com',
      passwordHash: 'hashedpassword'
    });

    expect(user.id).toBe(id);
    expect(user.role).toBe(Role.PROVIDER);
    expect(user.healthId).toBeNull();
  });
});
