import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Flight } from './entities/flight.entity';
import { Repository } from 'typeorm';
import { CreateFlightDto, UpdateFlightDto } from './dto/requests.dto';
import { FlightQueryResponseDto } from './dto/responses.dto';
import { NOT_FOUND_404 } from 'src/helpers/exceptions/auth';
import { TokenBlacklist } from './entities/blacklist.entity';

@Injectable()
export class FlightsService {
  constructor(
    @InjectRepository(Flight)
    private flightRepository: Repository<Flight>,
    @InjectRepository(TokenBlacklist)
    private blacklistRepository: Repository<TokenBlacklist>,
  ){}

  async create(createFlightDto: CreateFlightDto) {
    try{
      const newFlight = new Flight();
      newFlight.destination = createFlightDto.destination;
      newFlight.departure = createFlightDto.departure;

      const newFlightObj = await this.flightRepository.save(newFlight);

      return newFlightObj;

    } catch (error) {
      throw error
    }
  }

  async findAll(page: number, limit: number, search: string): Promise<FlightQueryResponseDto> {
    if (!page) page = 1;
    if (!limit) limit = 10;
    const offset = (page - 1) * limit
    try {
      
      const [flights, totalCount] = await this.flightRepository.findAndCount({
        relations: ['bookings'],
        skip: offset,
        take: limit
      })

      return {
        flights,
        page,
        totalCount
      }

    } catch (error) {
      throw error
    }
  }

  async findOne(id: string) {
    try {
      const flight = await this.flightRepository.findOne({
        where: {
          id,
        },
        relations: ['bookings'],
      })

      if (!flight) {
        throw new NOT_FOUND_404("flight not found");
      } 
      // else if (flight && !flight.is_active) {
      //   throw new BAD_REQUEST_400("flight has been deactivated");
      // }

      return flight;

    } catch (error) {
      throw error
    }
  }

  async update(id: string, updateFlightDto: UpdateFlightDto) {
    try {

      const flight = await this.flightRepository.findOne({
        where: {
          id,
        }
      })


      if (!flight) {
        throw new NOT_FOUND_404("flight not found");
      }
      // else if (flight && !flight.is_active) {
      //   throw new BAD_REQUEST_400("flight has been deactivated");
      // }

      
      await this.flightRepository.update( id, {
        ...updateFlightDto
      })

      const updatedflight = await this.flightRepository.findOne({
        where: {id},
        relations: ['bookings'],
      })

      return updatedflight;

    } catch (error) {
      throw error
    }
  }

  remove(id: number) {
    // return `This action removes a #${id} flight`;
  }

  async blacklistToken(token: string) {
    try {

      const blackToken = new TokenBlacklist();
      blackToken.token = token;
  
      await this.blacklistRepository.save(blackToken);
      
      return "Token blacklisted successfully"
    } catch (error) {
      throw error
    }
  }
}
