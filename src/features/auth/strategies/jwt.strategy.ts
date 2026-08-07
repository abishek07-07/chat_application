import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IJwtToken } from '../services/auth.service';
import { emitWarning } from 'process';

export const jwtConstants = {
  get secret(): string {
    return process.env.JWT_SECRET as string;
  },
  get expirationTime() {
    return process.env.JWT_EXPIRESIN;
  },

  get audience() {
    return process.env.JWT_AUDIENCE;
  },
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
      audience: jwtConstants.audience,
    });
  }

  async validate(payload: IJwtToken) {
    return {
      id : payload.id, 
      email : payload.email
    }
  }
}
