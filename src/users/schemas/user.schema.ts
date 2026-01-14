/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { NextFunction } from 'express';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: ['student', 'supervisor', 'admin'] })
  role: string;

  @Prop()
  studentId?: string;

  @Prop()
  batch?: string;

  @Prop()
  section?: string;

  // Helper method for password matching
  async matchPassword(enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
  }
}

const UserSchema = SchemaFactory.createForClass(User);

// Pre-save hook for hashing
UserSchema.pre('save', async function (next: NextFunction) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  return next();
});

export { UserSchema };