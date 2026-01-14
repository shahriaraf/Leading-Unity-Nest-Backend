/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AppSettingsDocument = AppSettings & Document;

@Schema()
export class AppSettings {
  @Prop({ type: Boolean, default: false })
  isStudentRegistrationOpen: boolean;
}

export const AppSettingsSchema = SchemaFactory.createForClass(AppSettings);