import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { UserRole } from '../types/users.enum';

@Schema({ timestamps: true, collection: 'users' })
export class User {
  @Prop({ type: mongoose.Schema.ObjectId, auto: true })
  _id: mongoose.Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false, enum: UserRole })
  role: UserRole;

  @Prop({ required: false, default: null })
  storeId: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
