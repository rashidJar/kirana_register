import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Store {
  @Prop({ type: mongoose.Schema.ObjectId, auto: true })
  _id: mongoose.Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const StoreSchema = SchemaFactory.createForClass(Store);
