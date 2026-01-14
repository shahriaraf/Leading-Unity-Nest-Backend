/* eslint-disable prettier/prettier */
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Proposal, ProposalDocument } from './schemas/proposal.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { CreateProposalDto } from './dto/create-proposal.dto';

@Injectable()
export class ProposalsService {
  constructor(
    @InjectModel(Proposal.name) private proposalModel: Model<ProposalDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(dto: CreateProposalDto, leaderUser: UserDocument) {
    const { title, description, supervisorIds, courseId, teamMembers } = dto;
    const leaderStudentId = leaderUser.studentId;

    const memberStudentIds = teamMembers ? teamMembers.map((m) => m.studentId) : [];
    const allInvolvedStudentIds = [leaderStudentId, ...memberStudentIds];
    const uniqueIdsToCheck = [...new Set(allInvolvedStudentIds.filter((id) => id))] as string[];

    // 1. Check if members are already in a team (pending or approved)
    const existingMemberConflict = await this.proposalModel.findOne({
      'teamMembers.studentId': { $in: uniqueIdsToCheck },
      status: { $ne: 'rejected' },
    });

    if (existingMemberConflict) {
      throw new BadRequestException('One or more students are already members of another team.');
    }

    // 2. Check if any student is already a Leader (User ID check)
    const users = await this.userModel.find({ studentId: { $in: uniqueIdsToCheck } });
    const userObjectIds = users.map((user) => user._id);

    const existingLeaderConflict = await this.proposalModel.findOne({
      student: { $in: userObjectIds },
      status: { $ne: 'rejected' },
    });

    if (existingLeaderConflict) {
      throw new BadRequestException('One or more students (or the leader) are already leading another team.');
    }

    const proposal = new this.proposalModel({
      title,
      description,
      student: leaderUser._id,
      supervisors: supervisorIds,
      course: courseId,
      teamMembers: teamMembers || [],
    });

    return proposal.save();
  }

  async getAll() {
    return this.proposalModel
      .find({})
      .populate('student', 'name studentId email')
      .populate('supervisors', 'name email')
      .populate('course', 'courseCode courseTitle')
      .sort({ createdAt: -1 });
  }

  async updateStatus(id: string, status: string) {
    const proposal = await this.proposalModel.findById(id);
    if (!proposal) throw new NotFoundException('Proposal not found');
    
    proposal.status = status;
    return proposal.save();
  }
}