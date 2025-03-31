import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './DTO/create-booking.dto';
import { UpdateBookingStatusDto } from './DTO/update-booking-status.dto';
import { JwtAuthGuard } from '..auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Request() req, @Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(req.user.id, createBookingDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Request() req) {
    return this.bookingsService.findAll(req.user.id, req.user.role);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @Request() req) {
    return this.bookingsService.findById(id, req.user.id, req.user.role);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateBookingStatusDto,
    @Request() req,
  ) {
    return this.bookingsService.updateStatus(id, updateStatusDto, req.user.role);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Request() req) {
    return this.bookingsService.remove(id, req.user.id, req.user.role);
  }

  @Get('/availability/check')
  @UseGuards(JwtAuthGuard)
  checkAvailability(
    @Query('venueId') venueId: string,
    @Query('date') date: string,
    @Query('time') time?: string,
  ) {
    if (time) {
      // Nếu có time, kiểm tra slot cụ thể
      // Giả sử slot là 1 giờ
      const startTime = time;
      const [hours, minutes] = time.split(':');
      const endTime = `${(parseInt(hours) + 1).toString().padStart(2, '0')}:${minutes}`;
      
      return this.bookingsService.checkAvailability(venueId, date, startTime, endTime);
    } else {
      // Nếu không có time, trả về tất cả slot khả dụng trong ngày
      return this.bookingsService.getAvailability(venueId, date);
    }
  }
}