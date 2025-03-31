import { IsNotEmpty, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class CreateVenueDto {
  @IsNotEmpty()
  name: string;

  @IsNumber()
  capacity: number;

  @IsOptional()
  description: string;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}