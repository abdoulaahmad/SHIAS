export const accessKeys = {
  all: ['access'] as const,
  requests: (providerId: string) => [...accessKeys.all, 'requests', providerId] as const,
  grants: (providerId: string) => [...accessKeys.all, 'grants', providerId] as const,
  grantDetails: (grantId: string) => [...accessKeys.all, 'grant', grantId] as const,
};
