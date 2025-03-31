import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VenueDocument = Venue & Document;

@Schema()
export class Venue {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  capacity: number;

  @Prop()
  description: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const VenueSchema = SchemaFactory.createForClass(Venue);