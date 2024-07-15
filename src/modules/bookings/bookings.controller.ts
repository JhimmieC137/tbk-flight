import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Query, UseGuards } from '@nestjs/common';
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

@ApiTags('Booking')
@Controller('bookings')
export class BookingsController {
  constructor(
    private readonly bookingsService: BookingsService,
    private readonly customResDto: CustomResDto,
    private readonly customInfoResDto: CustomInfoResDto,
    private readonly customListResDto: CustomListResDto,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createBookingDto: CreateBookingDto): Promise<CustomResDto> {
    const response = this.customResDto;
    response.results = await this.bookingsService.create(createBookingDto);
    response.message = "Booking created successfully"

    return response;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req, @Query() bookingQueryDto: BookingQueryDto): Promise<CustomListResDto> {
    const page = Number(bookingQueryDto?.page) ?? 1;
    const limit = Number(bookingQueryDto?.limit) ?? 10;
    
    const bookings =  await this.bookingsService.findAll(page, limit, bookingQueryDto.search);
    
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
  async findOne(@Request() req, @Param('id') id: string): Promise<CustomResDto> {
    const booking =  await this.bookingsService.findOne(id);
    const response = this.customResDto;
    response.results = booking;
    response.message = 'Booking retrieved successfully'
    return response;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Request() req, @Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto): Promise<CustomResDto> {
    const booking =  await this.bookingsService.update(id, updateBookingDto);
    const response = this.customResDto;
    response.results = booking;
    response.message = 'Booking updated successfully'
    return response;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string): Promise<CustomInfoResDto> {
    await this.bookingsService.remove(id);
    const response = this.customInfoResDto;
    response.info = 'Booking Deactivation successful';
    return response;
  }
}
