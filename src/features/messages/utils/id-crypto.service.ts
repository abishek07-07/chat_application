import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const TAG_LENGTH = 16;

@Injectable()
export class IdCryptoService {
  private readonly key: Buffer;

  constructor(config: ConfigService) {
    const secret = config.get<string>('jwt.secret') ?? '';
    this.key = createHash('sha256').update(secret).digest();
  }

  signMessageId(messageId: number): string {
    return this.encrypt({ messageId });
  }

  resolveMessageId(token: string): number {
    const payload = this.decrypt<{ messageId: number }>(token);
    if (!Number.isInteger(payload?.messageId) || payload!.messageId < 1)
      throw new BadRequestException('Invalid message key');
    return payload!.messageId;
  }

  createCursor(lastMessageId: number, lastSentAt: Date): string {
    return this.encrypt({ p: lastMessageId, t: lastSentAt.toISOString() });
  }

  resolveCursor(token: string): { id: number; sentAt: Date } {
    const payload = this.decrypt<{ p: number; t: string }>(token);
    const sentAt = new Date(payload?.t ?? '');
    if (
      !payload ||
      !Number.isInteger(payload.p) ||
      payload.p < 1 ||
      Number.isNaN(sentAt.getTime())
    )
      throw new BadRequestException('Invalid cursor');
    return { id: payload.p, sentAt };
  }

  private encrypt(payload: object): string {
    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv(ALGORITHM, this.key, iv);
    const plaintext = Buffer.from(JSON.stringify(payload), 'utf8');
    const encrypted = Buffer.concat([cipher.update(plaintext), cipher.final()]);
    const tag = cipher.getAuthTag();
    return Buffer.concat([iv, tag, encrypted]).toString('base64url');
  }

  private decrypt<T>(token: string): T | undefined {
    try {
      const raw = Buffer.from(token, 'base64url');
      const iv = raw.subarray(0, IV_LENGTH);
      const tag = raw.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
      const data = raw.subarray(IV_LENGTH + TAG_LENGTH);
      const decipher = createDecipheriv(ALGORITHM, this.key, iv);
      decipher.setAuthTag(tag);
      const plaintext = Buffer.concat([
        decipher.update(data),
        decipher.final(),
      ]).toString('utf8');
      return JSON.parse(plaintext) as T;
    } catch {
      return undefined;
    }
  }
}
