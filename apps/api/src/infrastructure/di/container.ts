import { PrismaUserRepository, PrismaProviderRepository } from '../repositories';
import { Argon2PasswordHasher, JwtTokenService } from '../services';
import { 
  RegisterPatientUseCase, 
  RegisterProviderUseCase, 
  AuthenticateUserUseCase, 
  RefreshSessionUseCase, 
  SearchPatientsUseCase,
  ListUsersUseCase,
  GetUserUseCase
} from '../../application/use-cases';
import { prisma } from '@shias/database';

export const userRepository = new PrismaUserRepository(prisma);
export const providerRepository = new PrismaProviderRepository(prisma);
export const passwordHasher = new Argon2PasswordHasher();
export const tokenService = new JwtTokenService();



import { PrismaProviderRepository as ProviderContextRepo, PrismaProviderStaffRepository } from '../repositories/provider';
import { PrismaPointerRepository } from '../repositories/pointer';
import { PrismaConsentRepository } from '../repositories/consent/PrismaConsentRepository';
import { PrismaAccessRequestRepository } from '../repositories/access/PrismaAccessRequestRepository';
import { PrismaAccessGrantRepository } from '../repositories/access/PrismaAccessGrantRepository';
import { JwtAccessTokenService } from '../services/JwtAccessTokenService';
import { PrismaAuditRepository } from '../repositories/audit/PrismaAuditRepository';
import { EventEmitterDomainEventPublisher } from '../events/EventEmitterDomainEventPublisher';
import { AuditEventSubscriber } from '../../application/subscribers/AuditEventSubscriber';
import { createLogger } from '@shias/observability';

export const logger = createLogger(process.env.NODE_ENV || 'development');
import { 
  CreateProviderUseCase, 
  UpdateProviderUseCase, 
  GetProviderUseCase, 
  ListProvidersUseCase, 
  SuspendProviderUseCase, 
  ReactivateProviderUseCase,
  AddProviderStaffUseCase,
  RemoveProviderStaffUseCase,
  ListProviderStaffUseCase
} from '../../application/use-cases/provider';
import {
  RegisterPointerUseCase,
  UpdatePointerUseCase as UpdatePtrUseCase,
  GetPointerUseCase as GetPtrUseCase,
  ListPatientPointersUseCase,
  ListProviderPointersUseCase,
  ArchivePointerUseCase
} from '../../application/use-cases/pointer';
import {
  CreateConsentRequestUseCase,
  ApproveConsentUseCase,
  RejectConsentUseCase,
  RevokeConsentUseCase,
  GetConsentUseCase,
  ListPatientConsentsUseCase,
  ListProviderConsentsUseCase,
  EvaluateConsentUseCase
} from '../../application/use-cases/consent';
import {
  RequestAccessUseCase,
  GetAccessGrantUseCase,
  RevokeAccessGrantUseCase,
  ValidateTokenUseCase,
  ListProviderGrantsUseCase,
  ListProviderAccessRequestsUseCase,
  ListAllGrantsUseCase,
  ListAllAccessRequestsUseCase
} from '../../application/use-cases/access';

const providerContextRepository = new ProviderContextRepo(prisma);
const providerStaffRepository = new PrismaProviderStaffRepository(prisma);
const pointerRepository = new PrismaPointerRepository(prisma);
const consentRepository = new PrismaConsentRepository(prisma);
const accessRequestRepository = new PrismaAccessRequestRepository(prisma);
const accessGrantRepository = new PrismaAccessGrantRepository(prisma);
const auditRepository = new PrismaAuditRepository(prisma);

const accessTokenService = new JwtAccessTokenService();
export const domainEventPublisher = new EventEmitterDomainEventPublisher(logger);
export const auditEventSubscriber = new AuditEventSubscriber(domainEventPublisher, auditRepository, logger);

export const createProviderUseCase = new CreateProviderUseCase(providerContextRepository);
export const updateProviderUseCase = new UpdateProviderUseCase(providerContextRepository);
export const getProviderUseCase = new GetProviderUseCase(providerContextRepository);
export const listProvidersUseCase = new ListProvidersUseCase(providerContextRepository);
export const suspendProviderUseCase = new SuspendProviderUseCase(providerContextRepository);
export const reactivateProviderUseCase = new ReactivateProviderUseCase(providerContextRepository);
export const addProviderStaffUseCase = new AddProviderStaffUseCase(providerStaffRepository, providerContextRepository, userRepository);
export const removeProviderStaffUseCase = new RemoveProviderStaffUseCase(providerStaffRepository);
export const listProviderStaffUseCase = new ListProviderStaffUseCase(providerStaffRepository, providerContextRepository);

export const registerPointerUseCase = new RegisterPointerUseCase(pointerRepository, domainEventPublisher);
export const updatePointerUseCase = new UpdatePtrUseCase(pointerRepository);
export const getPointerUseCase = new GetPtrUseCase(pointerRepository);
export const listPatientPointersUseCase = new ListPatientPointersUseCase(pointerRepository);
export const listProviderPointersUseCase = new ListProviderPointersUseCase(pointerRepository);
export const archivePointerUseCase = new ArchivePointerUseCase(pointerRepository);

export const createConsentRequestUseCase = new CreateConsentRequestUseCase(consentRepository, providerContextRepository);
export const approveConsentUseCase = new ApproveConsentUseCase(consentRepository, domainEventPublisher);
export const rejectConsentUseCase = new RejectConsentUseCase(consentRepository, domainEventPublisher);
export const revokeConsentUseCase = new RevokeConsentUseCase(consentRepository, domainEventPublisher);
export const getConsentUseCase = new GetConsentUseCase(consentRepository);
export const listPatientConsentsUseCase = new ListPatientConsentsUseCase(consentRepository);
export const listProviderConsentsUseCase = new ListProviderConsentsUseCase(consentRepository);
export const evaluateConsentUseCase = new EvaluateConsentUseCase(consentRepository);

export const requestAccessUseCase = new RequestAccessUseCase(
  accessRequestRepository,
  accessGrantRepository,
  accessTokenService,
  domainEventPublisher,
  getPointerUseCase,
  getProviderUseCase,
  evaluateConsentUseCase
);
export const getAccessGrantUseCase = new GetAccessGrantUseCase(accessGrantRepository);
export const revokeAccessGrantUseCase = new RevokeAccessGrantUseCase(accessGrantRepository);
export const validateTokenUseCase = new ValidateTokenUseCase(accessTokenService, accessGrantRepository);
export const listProviderGrantsUseCase = new ListProviderGrantsUseCase(accessGrantRepository);
export const listProviderAccessRequestsUseCase = new ListProviderAccessRequestsUseCase(accessRequestRepository);
export const listAllGrantsUseCase = new ListAllGrantsUseCase(accessGrantRepository, providerContextRepository, userRepository);
export const listAllAccessRequestsUseCase = new ListAllAccessRequestsUseCase(accessRequestRepository, providerContextRepository, userRepository);

export const registerPatientUseCase = new RegisterPatientUseCase(userRepository, passwordHasher, domainEventPublisher);
export const registerProviderUseCase = new RegisterProviderUseCase(userRepository, providerRepository, passwordHasher, domainEventPublisher);
export const authenticateUserUseCase = new AuthenticateUserUseCase(userRepository, passwordHasher, tokenService);
export const refreshSessionUseCase = new RefreshSessionUseCase(userRepository, tokenService);
export const searchPatientsUseCase = new SearchPatientsUseCase(userRepository);
export const listUsersUseCase = new ListUsersUseCase(userRepository);
export const getUserUseCase = new GetUserUseCase(userRepository);
import {
  SearchAuditEventsUseCase,
  GetAuditEventUseCase,
  GetAuditEventsByActorUseCase,
  GetAuditEventsByResourceUseCase
} from '../../application/use-cases/audit';

export const searchAuditEventsUseCase = new SearchAuditEventsUseCase(auditRepository);
export const getAuditEventUseCase = new GetAuditEventUseCase(auditRepository);
export const getAuditEventsByActorUseCase = new GetAuditEventsByActorUseCase(auditRepository);
export const getAuditEventsByResourceUseCase = new GetAuditEventsByResourceUseCase(auditRepository);
