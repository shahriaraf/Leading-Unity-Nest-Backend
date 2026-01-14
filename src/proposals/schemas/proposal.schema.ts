/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ProposalDocument = Proposal & Document;

@Schema()
class TeamMember {
  @Prop() name: string;
  @Prop() studentId: string;
  @Prop() cgpa: string;
  @Prop() email: string;
  @Prop() mobile: string;
}

@Schema({ timestamps: true })
export class Proposal {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  student: any;

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'User' }])
  supervisors: any[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Course', required: true })
  course: any;

  @Prop([TeamMember])
  teamMembers: TeamMember[];

  @Prop({ required: true, enum: ['approved', 'rejected'], default: 'approved' })
  status: string;
}

export const ProposalSchema = SchemaFactory.createForClass(Proposal);