import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { FlightsService } from './flights.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CustomInfoResDto, CustomListResDto, CustomResDto } from 'src/helpers/schemas.dto';
import { CreateFlightDto, FlightQueryDto, UpdateFlightDto } from './dto/requests.dto';
import { EventPattern, Payload } from '@nestjs/microservices';
import { JwtAuthGuard } from 'src/helpers/jwt-auth.guard';
import * as reqType from 'express';
import { FORBIDDEN_403 } from 'src/helpers/exceptions/auth';

@ApiTags('Flights')
@Controller('flights')
export class FlightsController {
  constructor(
    private readonly flightsService: FlightsService,
    private readonly customResDto: CustomResDto,
    private readonly customInfoResDto: CustomInfoResDto,
    private readonly customListResDto: CustomListResDto,
  ) {}

  async checkBlacklist(req: reqType.Request) {
    try {
      const isBlacklisted = await this.flightsService.checkBlacklist(req.headers.authorization.split(' ')[1])
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
  async create(@Request() req: reqType.Request, @Body() createFlightDto: CreateFlightDto): Promise<CustomResDto> {
    await this.checkBlacklist(req);
    const response = this.customResDto;
    response.results = await this.flightsService.create(createFlightDto);
    response.message = "Flight created successfully"

    return response;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req: reqType.Request, @Query() flightQueryDto: FlightQueryDto): Promise<CustomListResDto> {
    await this.checkBlacklist(req);
    const page = Number(flightQueryDto?.page) ?? 1;
    const limit = Number(flightQueryDto?.limit) ?? 10;
    
    const flights =  await this.flightsService.findAll(page, limit, flightQueryDto.search);
    
    const response = this.customListResDto;
    response.results = flights.flights;
    response.total_count = flights.totalCount;
    response.count = response.results.length;
    response.page = flights.page
    response.message = 'Flights retrieved successfully'
    response.next_page = flights.page + 1
    return response;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Request() req: reqType.Request, @Param('id') id: string): Promise<CustomResDto> {
    await this.checkBlacklist(req);
    const flight =  await this.flightsService.findOne(id);
    const response = this.customResDto;
    response.results = flight;
    response.message = 'Flight retrieved successfully'
    return response;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Request() req: reqType.Request, @Param('id') id: string, @Body() updateFlightDto: UpdateFlightDto) {
    await this.checkBlacklist(req);
    const flight =  await this.flightsService.update(id, updateFlightDto);
    const response = this.customResDto;
    response.results = flight;
    response.message = 'Flight updated successfully'
    return response;
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.flightsService.remove(+id);
  // }

  @EventPattern('blacklist_token')
  async handleBlacklistToken(@Payload() token: string): Promise<CustomInfoResDto> {
    const response = this.customInfoResDto; 
    response.message = await this.flightsService.blacklistToken(token);
    return response
  }
}
