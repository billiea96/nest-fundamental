import { IsNotEmpty, IsString } from 'class-validator';

export class ValidateTokenDto {
  @IsNotEmpty()
  @IsString()
  readonly token: string;
}
