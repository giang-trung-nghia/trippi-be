import { AuthUserResponseDto } from '@/modules/auth/dtos/auth-user-response.dto';
import { TokensResponse } from '@/modules/auth/interfaces/tokens-response.interface';

export interface SessionWithTokens {
  user: AuthUserResponseDto;
  tokens: TokensResponse;
}
