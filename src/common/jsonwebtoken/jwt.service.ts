import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';

@Injectable()
export class JsonWebTokenService {
  constructor(private readonly jwtService: JwtService) {}

  async sign<T extends object>(payload: T): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  async signWithOptions<T extends object>(
    payload: T,
    options: JwtSignOptions,
  ): Promise<string> {
    return this.jwtService.signAsync(payload, options);
  }

  async validate<T extends object>(token: string): Promise<T> {
    return this.jwtService.verifyAsync<T>(token);
  }

  async validateWithOptions<T extends object>(
    token: string,
    options: JwtVerifyOptions,
  ): Promise<T> {
    return this.jwtService.verifyAsync<T>(token, options);
  }

  decode<T = unknown>(token: string): T | null {
    return this.jwtService.decode(token);
  }
}
