import { AuthProviderEnum } from '@/common/enums/auth-provider.enum';

export interface GoogleProfilePayload {
  provider: AuthProviderEnum;
  providerUserId: string;
  email: string;
  displayName?: string;
  photo?: string;
}
