import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UsersResponse {
  @Expose()
  email!: string;

  @Expose()
  firstName!: string;

  @Expose()
  lastName!: string;

  @Expose()
  identifier!: string;
}
