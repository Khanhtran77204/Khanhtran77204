import { IsNotEmpty, IsDateString, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty()
  venueId: string;

  @IsDateString()
  date: string;

  @IsString()
  @IsNotEmpty()
  startTime: string;

  @IsString()
  @IsNotEmpty()
  endTime: string;
}