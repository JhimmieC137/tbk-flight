import { Inject, Injectable } from '@nestjs/common';
import { CreateBookingDto, UpdateBookingDto } from './dto/requests.dto';
import { Booking } from './entities/booking.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingQueryResponseDto } from './dto/responses.dto';
import { NOT_FOUND_404 } from 'src/helpers/exceptions/auth';
import { TokenBlacklist } from '../flights/entities/blacklist.entity';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(TokenBlacklist)
    private blacklistRepository: Repository<TokenBlacklist>,
    @Inject('NOTIFICATION_SERVICE')
    private rabbitClientNotification: ClientProxy,
  ){}

  async create(user_id: string, createBookingDto: CreateBookingDto) {
    try{
      const newBooking = new Booking();
      newBooking.user_id = user_id;
      newBooking.flight = createBookingDto.flight;

      const newBookingObj = await this.bookingRepository.save(newBooking);

      // Notify
      this.rabbitClientNotification.emit(
        'create-notification',
        JSON.stringify({
          user_id: user_id,
          message: "Your flight has been booked, find more information in your mail"
        })
      )

      return newBookingObj;

    } catch (error) {
      throw error
    }
  }

  async findAll(user_id: string, page: number, limit: number, search: string): Promise<BookingQueryResponseDto> {
    if (!page) page = 1;
    if (!limit) limit = 10;
    const offset = (page - 1) * limit
    try {
      
      const [bookings, totalCount] = await this.bookingRepository.findAndCount({
        where: {user_id},
        skip: offset,
        take: limit
      })

      return {
        bookings,
        page,
        totalCount
      }

    } catch (error) {
      throw error
    }
  }

  async findOne(user_id: string, id: string): Promise<Booking> {
    try {
      const booking = await this.bookingRepository.findOne({
        where: {
          id,
          user_id
        }
      })

      if (!booking) {
        throw new NOT_FOUND_404("Booking not found");
      } 
      // else if (booking && !booking.is_active) {
      //   throw new BAD_REQUEST_400("booking has been deactivated");
      // }

      return booking;

    } catch (error) {
      throw error
    }
  }

  async update(user_id: string, id: string, updateBookingDto: UpdateBookingDto): Promise<Booking>{
    try {

      const booking = await this.bookingRepository.findOne({
        where: {
          id,
          user_id
        }
      })


      if (!booking) {
        throw new NOT_FOUND_404("booking not found");
      } 
      // else if (booking && !booking.is_active) {
      //   throw new BAD_REQUEST_400("booking has been deactivated");
      // }

      
      await this.bookingRepository.update( id, {
        ...updateBookingDto
      })

      const updatedbooking = await this.bookingRepository.findOne({
        where: {id}
      })

      this.rabbitClientNotification.emit(
        'create-notification',
        JSON.stringify({
          user_id: user_id,
          message: "You made changes to your flight booking, find more info in your mail"
        })
      )

      return updatedbooking;

    } catch (error) {
      throw error
    }
  }

  async remove(user_id: string, id: string) {
    try {
      
      const booking = await this.bookingRepository.findOne({
        where: {
          id,
          user_id
        }
      })
  
  
      if (!booking) {
        throw new NOT_FOUND_404("Booking not found");
      } 
      // else if (booking && !booking.is_active) {
      //   throw new BAD_REQUEST_400("booking has been deactivated already");
      // }
  
      await this.bookingRepository.remove(booking);
      
    } catch (error) {
      throw error
    }
  }


  async checkBlacklist(token: string): Promise<Boolean> {
    try{
      const blackToken = await this.blacklistRepository.findOne({
        where: {token}
      });
      
      if (!blackToken) {
        return false;
      };

      return true;
    } catch (error) {
      throw error;
    }

  };

}
