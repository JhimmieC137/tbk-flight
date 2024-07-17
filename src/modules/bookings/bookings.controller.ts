import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Query, UseGuards, RequestMapping } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingQueryDto, CreateBookingDto, UpdateBookingDto } from './dto/requests.dto';
import {
  CustomInfoResDto,
  CustomListResDto,
  CustomResDto,
} from '../../helpers/schemas.dto';
import { promises } from 'dns';
import { Booking } from './entities/booking.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/helpers/jwt-auth.guard';
import * as reqType from 'express';
import { FORBIDDEN_403 } from 'src/helpers/exceptions/auth';
@ApiTags('Booking')
@Controller('bookings')
export class BookingsController {
  constructor(
    private readonly bookingsService: BookingsService,
    private readonly customResDto: CustomResDto,
    private readonly customInfoResDto: CustomInfoResDto,
    private readonly customListResDto: CustomListResDto,
  ) {}

  async checkBlacklist(req: reqType.Request) {
    try {
      const isBlacklisted = await this.bookingsService.checkBlacklist(req.headers.authorization.split(' ')[1])
      if (isBlacklisted) {
        throw new FORBIDDEN_403("Invalid token")
      }
    } catch (error) {
      throw error
    }

  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req: reqType.Request, @Body() createBookingDto: CreateBookingDto): Promise<CustomResDto> {
    await this.checkBlacklist(req);
    const response = this.customResDto;
    response.results = await this.bookingsService.create(req.user['id'], createBookingDto);
    response.message = "Booking created successfully"

    return response;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req: reqType.Request, @Query() bookingQueryDto: BookingQueryDto): Promise<CustomListResDto> {
    await this.checkBlacklist(req);
    const page = Number(bookingQueryDto?.page) ?? 1;
    const limit = Number(bookingQueryDto?.limit) ?? 10;
    
    const bookings =  await this.bookingsService.findAll(req.user['id'], page, limit, bookingQueryDto.search);
    
    const response = this.customListResDto;
    response.results = bookings.bookings;
    response.total_count = bookings.totalCount;
    response.count = response.results.length;
    response.page = bookings.page
    response.message = 'Bookings retrieved successfully'
    response.next_page = bookings.page + 1
    return response;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Request() req: reqType.Request, @Param('id') id: string): Promise<CustomResDto> {
    await this.checkBlacklist(req);
    const booking =  await this.bookingsService.findOne(req.user['id'], id);
    const response = this.customResDto;
    response.results = booking;
    response.message = 'Booking retrieved successfully'
    return response;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Request() req: reqType.Request, @Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto): Promise<CustomResDto> {
    await this.checkBlacklist(req);
    const booking =  await this.bookingsService.update(req.user['id'], id, updateBookingDto);
    const response = this.customResDto;
    response.results = booking;
    response.message = 'Booking updated successfully'
    return response;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Request() req: reqType.Request, @Param('id') id: string): Promise<CustomInfoResDto> {
    await this.checkBlacklist(req);
    await this.bookingsService.remove(req.user['id'], id);
    const response = this.customInfoResDto;
    response.info = 'Booking Deactivation successful';
    return response;
  }
}
