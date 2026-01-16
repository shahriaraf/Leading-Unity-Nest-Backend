/* eslint-disable prettier/prettier */
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { User, UserDocument } from '../users/schemas/user.schema';
import {
  AppSettings,
  AppSettingsDocument,
} from '../settings/schemas/app-settings.schema';
import { RegisterStudentDto } from './dto/register-student.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterAdminDto } from './dto/register-admin.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(AppSettings.name)
    private settingsModel: Model<AppSettingsDocument>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    // 1. Find the user
    const user = await this.userModel
      .findOne({ email: loginDto.email })
      .select('+password');
    

    console.log('Login attempt for:', loginDto.email); 

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(loginDto.password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      studentId: user.studentId,
      batch: user.batch,
      section: user.section,
      token: this.generateToken(user._id.toString()),
    };
  }

  async registerAdmin(dto: RegisterAdminDto) {
    const adminExists = await this.userModel.findOne({ role: 'admin' });
    if (adminExists)
      throw new BadRequestException('An admin account already exists.');

    const user = await this.userModel.create({
      ...dto,
      role: 'admin',
    });

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: this.generateToken(user._id.toString()),
    };
  }

  async registerStudent(dto: RegisterStudentDto) {
    const settings = await this.settingsModel.findOne();
    // Optional: Add check for !settings here if database is empty to prevent crash
    if (!settings || !settings.isStudentRegistrationOpen) {
      throw new BadRequestException(
        'Student registration is currently closed.',
      );
    }

    const userExists = await this.userModel.findOne({ email: dto.email });
    if (userExists) throw new BadRequestException('User already exists');

    const user = await this.userModel.create({
      ...dto,
      role: 'student',
    });

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      studentId: user.studentId,
      batch: user.batch,
      section: user.section,
      token: this.generateToken(user._id.toString()),
    };
  }

  private generateToken(id: string) {
    return this.jwtService.sign({ id });
  }

}