/* eslint-disable prettier/prettier */
import { Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppSettings, AppSettingsDocument } from './schemas/app-settings.schema';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('settings')
export class SettingsController {
  constructor(@InjectModel(AppSettings.name) private settingsModel: Model<AppSettingsDocument>) {}

  @Get()
  async getSettings() {
    let settings = await this.settingsModel.findOne();
    if (!settings) {
      settings = await this.settingsModel.create({ isStudentRegistrationOpen: false });
    }
    return settings;
  }

  @Patch('toggle-registration')
  @UseGuards(AuthGuard('jwt'), new RolesGuard(['admin']))
  async toggleRegistration() {
    // eslint-disable-next-line prefer-const
    let settings = await this.settingsModel.findOne();
    if (settings) {
      settings.isStudentRegistrationOpen = !settings.isStudentRegistrationOpen;
      return settings.save();
    } else {
      return this.settingsModel.create({ isStudentRegistrationOpen: true });
    }
  }
}