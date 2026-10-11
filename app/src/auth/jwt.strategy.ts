import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';

interface CognitoAccessTokenPayload {
  sub: string;
  iss: string;
  client_id: string;
  token_use: string;
  username: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly clientId: string;

  constructor() {
    const region = process.env.AWS_REGION;
    const userPoolId = process.env.COGNITO_USER_POOL_ID;
    const clientId = process.env.COGNITO_CLIENT_ID;

    if (!region || !userPoolId || !clientId) {
      throw new Error(
        'AWS_REGION, COGNITO_USER_POOL_ID and COGNITO_CLIENT_ID must be set',
      );
    }

    const issuer = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`;

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      issuer,
      algorithms: ['RS256'],
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 10,
        jwksUri: `${issuer}/.well-known/jwks.json`,
      }),
    });

    this.clientId = clientId;
  }

  validate(payload: CognitoAccessTokenPayload) {
    if (payload.token_use !== 'access' || payload.client_id !== this.clientId) {
      throw new UnauthorizedException();
    }
    return { userId: payload.sub, username: payload.username };
  }
}
