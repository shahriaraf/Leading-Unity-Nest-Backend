/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
// If you want to protect these routes, import your Guard:
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('courses')
export class CoursesController {
  // 1. Inject the Service
  constructor(private readonly coursesService: CoursesService) {}

  // 2. GET /api/courses
  @Get()
  getAll() {
    return this.coursesService.getAll();
  }

  // 3. POST /api/courses
  // @UseGuards(JwtAuthGuard) // Uncomment if you want to protect this
  @Post()
  create(@Body() dto: CreateCourseDto) {
    return this.coursesService.create(dto);
  }

  // 4. PUT /api/courses/:id
  // @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCourseDto) {
    return this.coursesService.update(id, dto);
  }

  // 5. DELETE /api/courses/:id
  // @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.coursesService.delete(id);
  }
}