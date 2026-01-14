/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */

import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createSupervisor(dto: CreateUserDto) {
    const exists = await this.userModel.findOne({ email: dto.email });
    if (exists) throw new BadRequestException('Supervisor with this email already exists');

    const user = await this.userModel.create({ ...dto, role: 'supervisor' });
    return this.sanitizeUser(user);
  }

  async getAllUsers() {
    return this.userModel.find({ role: { $in: ['student', 'supervisor'] } });
  }

  async deleteUser(id: string) {
    const user = await this.userModel.findByIdAndDelete(id);
    if (!user) throw new NotFoundException('User not found');
    return { message: 'User removed successfully' };
  }

  // Helper to remove password from response
  private sanitizeUser(user: UserDocument) {
    const { password, ...result } = user.toObject();
    return result;
  }
}