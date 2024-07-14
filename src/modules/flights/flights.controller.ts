import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { FlightsService } from './flights.service';
import { ApiTags } from '@nestjs/swagger';
import { CustomInfoResDto, CustomListResDto, CustomResDto } from 'src/helpers/schemas.dto';
import { CreateFlightDto, FlightQueryDto, UpdateFlightDto } from './dto/requests.dto';


@ApiTags('Flights')
@Controller('flights')
export class FlightsController {
  constructor(
    private readonly flightsService: FlightsService,
    private readonly customResDto: CustomResDto,
    private readonly customInfoResDto: CustomInfoResDto,
    private readonly customListResDto: CustomListResDto,
  ) {}

  @Post()
  async create(@Body() createFlightDto: CreateFlightDto): Promise<CustomResDto> {
    const response = this.customResDto;
    response.results = await this.flightsService.create(createFlightDto);
    response.message = "Flight created successfully"

    return response;
  }

  @Get()
  async findAll(@Query() flightQueryDto: FlightQueryDto): Promise<CustomListResDto> {
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

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CustomResDto> {
    const flight =  await this.flightsService.findOne(id);
    const response = this.customResDto;
    response.results = flight;
    response.message = 'Flight retrieved successfully'
    return response;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateFlightDto: UpdateFlightDto) {
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
}
