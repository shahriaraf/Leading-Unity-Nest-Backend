/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Put, Body, UseGuards, Param } from '@nestjs/common';
import { ProposalsService } from './proposals.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { CreateProposalDto } from './dto/create-proposal.dto';
import type { UserDocument } from 'src/users/schemas/user.schema';


@Controller('proposals')
@UseGuards(AuthGuard('jwt'))
export class ProposalsController {
  constructor(private readonly proposalsService: ProposalsService) {}

  @Post()
  createProposal(@Body() dto: CreateProposalDto, @GetUser() user: UserDocument) {
    return this.proposalsService.create(dto, user);
  }

  @Get()
  @UseGuards(new RolesGuard(['admin']))
  getAllProposals() {
    return this.proposalsService.getAll();
  }

  @Put(':id')
  @UseGuards(new RolesGuard(['admin']))
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.proposalsService.updateStatus(id, status);
  }
}