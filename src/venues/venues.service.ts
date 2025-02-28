import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Venue, VenueDocument } from './schemas/venue.schema';
import { CreateVenueDto } from './DTO/create-venue.dto';
import { UpdateVenueDto } from './DTO/update-venue.dto';

@Injectable()
export class VenuesService {
  constructor(
    @InjectModel(Venue.name) private venueModel: Model<VenueDocument>,
  ) {}

  async create(createVenueDto: CreateVenueDto): Promise<Venue> {
    const newVenue = new this.venueModel(createVenueDto);
    return newVenue.save();
  }

  async findAll(): Promise<Venue[]> {
    return this.venueModel.find({ isActive: true }).exec();
  }

  async findById(id: string): Promise<Venue> {
    const venue = await this.venueModel.findById(id).exec();
    if (!venue) {
      throw new NotFoundException(`Venue with ID ${id} not found`);
    }
    return venue;
  }

  async update(id: string, updateVenueDto: UpdateVenueDto): Promise<Venue> {
    const updatedVenue = await this.venueModel
      .findByIdAndUpdate(id, updateVenueDto, { new: true })
      .exec();
    
    if (!updatedVenue) {
      throw new NotFoundException(`Venue with ID ${id} not found`);
    }
    
    return updatedVenue;
  }

  async remove(id: string): Promise<Venue> {
    const deletedVenue = await this.venueModel.findByIdAndDelete(id).exec();
    
    if (!deletedVenue) {
      throw new NotFoundException(`Venue with ID ${id} not found`);
    }
    
    return deletedVenue;
  }
}