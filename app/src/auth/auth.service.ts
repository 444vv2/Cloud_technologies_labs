import {
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
  InitiateAuthCommand,
  SignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly client = new CognitoIdentityProviderClient({
    region: process.env.AWS_REGION,
  });
  private readonly clientId = process.env.COGNITO_CLIENT_ID as string;

  async signUp(email: string, password: string) {
    try {
      await this.client.send(
        new SignUpCommand({
          ClientId: this.clientId,
          Username: email,
          Password: password,
          UserAttributes: [{ Name: 'email', Value: email }],
        }),
      );
      return { message: 'Code sent to email' };
    } catch (err) {
      throw this.mapError(err);
    }
  }

  async confirm(email: string, code: string) {
    try {
      await this.client.send(
        new ConfirmSignUpCommand({
          ClientId: this.clientId,
          Username: email,
          ConfirmationCode: code,
        }),
      );
      return { message: 'Email confirmed, you can now log in' };
    } catch (err) {
      throw this.mapError(err);
    }
  }

  async login(email: string, password: string) {
    try {
      const res = await this.client.send(
        new InitiateAuthCommand({
          AuthFlow: 'USER_PASSWORD_AUTH',
          ClientId: this.clientId,
          AuthParameters: { USERNAME: email, PASSWORD: password },
        }),
      );
      const result = res.AuthenticationResult;
      if (!result?.AccessToken) {
        throw new UnauthorizedException('Authentication failed, no access token received');
      }
      return {
        accessToken: result.AccessToken,
        refreshToken: result.RefreshToken,
        expiresIn: result.ExpiresIn,
        tokenType: 'Bearer',
      };
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw this.mapError(err);
    }
  }

  private mapError(err: unknown): HttpException {
    const name = (err as { name?: string }).name;
    const message = (err as { message?: string }).message ?? 'Error';

    switch (name) {
      case 'UsernameExistsException':
        return new ConflictException('User with this email already exists');
      case 'InvalidPasswordException':
        return new BadRequestException('Password does not meet the required criteria');
      case 'InvalidParameterException':
        return new BadRequestException('Invalid parameters provided');
      case 'CodeMismatchException':
        return new BadRequestException('Invalid confirmation code');
      case 'ExpiredCodeException':
        return new BadRequestException(message);
      case 'UserNotConfirmedException':
        return new ForbiddenException('email not confirmed, please confirm your email first');
      case 'NotAuthorizedException':
        return new UnauthorizedException(message);
      case 'TooManyRequestsException':
        return new HttpException(
          'Too many requests, please try again later',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      case 'LimitExceededException':
        return new HttpException(
          'Request limit exceeded, please try again later',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      default:
        this.logger.error(`Cognito error: ${name} - ${message}`);
        return new InternalServerErrorException();
    }
  }
}
