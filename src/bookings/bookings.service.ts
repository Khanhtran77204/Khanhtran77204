import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Booking, BookingDocument } from './schemas/booking.schema';
import { CreateBookingDto } from './DTO/create-booking.dto';
import { UpdateBookingStatusDto } from './DTO/update-booking-status.dto';
import { VenuesService } from '../venues/venues.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    private venuesService: VenuesService,
  ) {}

  async create(userId: string, createBookingDto: CreateBookingDto): Promise<Booking> {
    const { venueId, date, startTime, endTime } = createBookingDto;
    
    // Kiểm tra venue có tồn tại không
    await this.venuesService.findById(venueId);
    
    // Kiểm tra thời gian có hợp lệ không
    if (startTime >= endTime) {
      throw new BadRequestException('Start time must be before end time');
    }
    
    // Kiểm tra tính khả dụng
    const isAvailable = await this.checkAvailability(venueId, date, startTime, endTime);
    if (!isAvailable) {
      throw new BadRequestException('The selected time slot is not available');
    }
    
    // Tạo booking mới
    const newBooking = new this.bookingModel({
      userId: new Types.ObjectId(userId),
      venueId: new Types.ObjectId(venueId),
      date: new Date(date),
      startTime,
      endTime,
      status: 'pending',
    });
    
    return newBooking.save();
  }

  async findAll(userId: string, role: string): Promise<Booking[]> {
    if (role === 'admin') {
      return this.bookingModel.find()
        .populate('userId', 'name email')
        .populate('venueId', 'name')
        .exec();
    } else {
      return this.bookingModel.find({ userId: new Types.ObjectId(userId) })
        .populate('venueId', 'name')
        .exec();
    }
  }

  async findById(id: string, userId: string, role: string): Promise<Booking> {
    const booking = await this.bookingModel.findById(id)
      .populate('userId', 'name email')
      .populate('venueId', 'name')
      .exec();
    
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    
    // Kiểm tra quyền truy cập
    if (role !== 'admin' && booking.userId.toString() !== userId) {
      throw new ForbiddenException('You do not have permission to access this booking');
    }
    
    return booking;
  }

  async updateStatus(id: string, updateStatusDto: UpdateBookingStatusDto, role: string): Promise<Booking> {
    if (role !== 'admin' && updateStatusDto.status === 'confirmed') {
      throw new ForbiddenException('Only admin can confirm bookings');
    }
    
    const updatedBooking = await this.bookingModel
      .findByIdAndUpdate(id, { status: updateStatusDto.status }, { new: true })
      .exec();
    
    if (!updatedBooking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    
    return updatedBooking;
  }

  async remove(id: string, userId: string, role: string): Promise<Booking> {
    const booking = await this.bookingModel.findById(id);
    
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    
    // Kiểm tra quyền xóa booking
    if (role !== 'admin' && booking.userId.toString() !== userId) {
      throw new ForbiddenException('You do not have permission to delete this booking');
    }
    
    // Chỉ cho phép xóa booking chưa được xác nhận
    if (booking.status === 'confirmed' && role !== 'admin') {
      throw new BadRequestException('Cannot cancel a confirmed booking. Please contact admin.');
    }
    
    return this.bookingModel.findByIdAndDelete(id).exec();
  }

  async checkAvailability(venueId: string, date: string, startTime: string, endTime: string): Promise<boolean> {
    const bookingDate = new Date(date);
    const startOfDay = new Date(bookingDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(bookingDate.setHours(23, 59, 59, 999));
    
    // Tìm các booking cùng ngày và venue
    const existingBookings = await this.bookingModel.find({
      venueId: new Types.ObjectId(venueId),
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      status: { $in: ['pending', 'confirmed'] },
    }).exec();
    
    // Kiểm tra xem có booking nào trùng thời gian không
    for (const booking of existingBookings) {
      const existingStart = booking.startTime;
      const existingEnd = booking.endTime;
      
      // Kiểm tra xem thời gian mới có trùng với booking hiện tại không
      if (
        (startTime >= existingStart && startTime < existingEnd) ||
        (endTime > existingStart && endTime <= existingEnd) ||
        (startTime <= existingStart && endTime >= existingEnd)
      ) {
        return false; // Không khả dụng
      }
    }
    
    return true; // Khả dụng
  }
  
  async getAvailability(venueId: string, date: string): Promise<{ available: boolean, availableSlots: { start: string, end: string }[] }> {
    const bookingDate = new Date(date);
    const startOfDay = new Date(bookingDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(bookingDate.setHours(23, 59, 59, 999));
    
    // Tìm các booking cùng ngày và venue
    const existingBookings = await this.bookingModel.find({
      venueId: new Types.ObjectId(venueId),
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      status: { $in: ['pending', 'confirmed'] },
    }).exec();
    
    // Giả sử giờ làm việc từ 8:00 đến 22:00, mỗi slot là 1 giờ
    const businessHours = {
      start: '08:00',
      end: '22:00',
    };
    
    // Tạo danh sách các slot có sẵn
    const busySlots = existingBookings.map(booking => ({
      start: booking.startTime,
      end: booking.endTime,
    }));
    
    // Tạo các slot 1 giờ từ giờ mở cửa đến giờ đóng cửa
    const allSlots = [];
    let currentHour = 8;
    
    while (currentHour < 22) {
      const startHour = currentHour.toString().padStart(2, '0') + ':00';
      const endHour = (currentHour + 1).toString().padStart(2, '0') + ':00';
      
      allSlots.push({
        start: startHour,
        end: endHour,
      });
      
      currentHour++;
    }
    
    // Lọc ra các slot còn trống
    const availableSlots = allSlots.filter(slot => {
      for (const busySlot of busySlots) {
        if (
          (slot.start >= busySlot.start && slot.start < busySlot.end) ||
          (slot.end > busySlot.start && slot.end <= busySlot.end) ||
          (slot.start <= busySlot.start && slot.end >= busySlot.end)
        ) {
          return false; // Slot bị chiếm
        }
      }
      return true; // Slot còn trống
    });
    
    return {
      available: availableSlots.length > 0,
      availableSlots,
    };
  }
}