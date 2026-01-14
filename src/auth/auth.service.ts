import { JwtService } from '@nestjs/jwt';
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { AppSettings, AppSettingsDocument } from '../settings/schemas/app-settings.schema';
import { RegisterStudentDto } from './dto/register-student.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterAdminDto } from './dto/register-admin.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(AppSettings.name) private settingsModel: Model<AppSettingsDocument>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.userModel.findOne({ email: loginDto.email });
    if (user && (await user.matchPassword(loginDto.password))) {
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
        batch: user.batch,
        section: user.section,
        token: this.generateToken(user._id),
      };
    }
    throw new UnauthorizedException('Invalid email or password');
  }

  async registerAdmin(dto: RegisterAdminDto) {
    const adminExists = await this.userModel.findOne({ role: 'admin' });
    if (adminExists) throw new BadRequestException('An admin account already exists.');

    const user = await this.userModel.create({ ...dto, role: 'admin' });
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: this.generateToken(user._id),
    };
  }

  async registerStudent(dto: RegisterStudentDto) {
    // 1. Check Settings
    const settings = await this.settingsModel.findOne();
    if (!settings || !settings.isStudentRegistrationOpen) {
      throw new BadRequestException('Student registration is currently closed.');
    }

    // 2. Check Duplicates
    const userExists = await this.userModel.findOne({ email: dto.email });
    if (userExists) throw new BadRequestException('User already exists');

    // 3. Create User
    const user = await this.userModel.create({ ...dto, role: 'student' });
    
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      studentId: user.studentId,
      batch: user.batch,
      section: user.section,
      token: this.generateToken(user._id),
    };
  }

  private generateToken(id: any) {
    return this.jwtService.sign({ id });
  }
}