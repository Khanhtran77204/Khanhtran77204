import { IsNotEmpty, IsIn } from 'class-validator';

export class UpdateBookingStatusDto {
  @IsNotEmpty()
  @IsIn(['pending', 'confirmed', 'rejected', 'cancelled'])
  status: string;
}