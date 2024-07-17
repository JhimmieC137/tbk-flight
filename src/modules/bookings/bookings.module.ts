import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Booking } from './entities/booking.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenBlacklist } from '../flights/entities/blacklist.entity';
import { CustomErrResDto, CustomInfoResDto, CustomListResDto, CustomResDto } from 'src/helpers/schemas.dto';
import { JwtStrategy } from 'src/helpers/jwt.strategy';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { baseConfig } from 'src/settings/base.config';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'NOTIFICATION_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [baseConfig().rabbit_url],
          queue: 'notification_queue',
        }
      },
    ]),
    TypeOrmModule.forFeature([Booking, TokenBlacklist])
  ],
  controllers: [BookingsController],
  providers: [BookingsService, JwtStrategy, CustomErrResDto, CustomListResDto, CustomInfoResDto, CustomResDto],
})
export class BookingsModule {}
