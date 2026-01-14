/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ProposalsController } from './proposals.controller';
import { ProposalsService } from './proposals.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Proposal, ProposalSchema } from './schemas/proposal.schema';
// 👇 1. Import User Schema
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
    imports: [
      MongooseModule.forFeature([
        { name: Proposal.name, schema: ProposalSchema },
        // 👇 2. Register User Schema here so ProposalsService can use it
        { name: User.name, schema: UserSchema }, 
      ]),
    ],
  controllers: [ProposalsController],
  providers: [ProposalsService],
})
export class ProposalsModule {}