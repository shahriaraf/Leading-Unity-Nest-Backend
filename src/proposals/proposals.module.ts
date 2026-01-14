/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ProposalsController } from './proposals.controller';
import { ProposalsService } from './proposals.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Proposal, ProposalSchema } from './schemas/proposal.schema';

@Module({
    imports: [
      MongooseModule.forFeature([
        { name: Proposal.name, schema: ProposalSchema },
      ]),
    ],
  controllers: [ProposalsController],
  providers: [ProposalsService],
})
export class ProposalsModule {}
