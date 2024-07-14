import { Module } from '@nestjs/common';
import { FlightsService } from './flights.service';
import { FlightsController } from './flights.controller';
import { TokenBlacklist } from './entities/blacklist.entity';
import { Flight } from './entities/flight.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomInfoResDto, CustomListResDto, CustomResDto } from 'src/helpers/schemas.dto';

@Module({
  imports: [TypeOrmModule.forFeature([Flight, TokenBlacklist])],
  controllers: [FlightsController],
  providers: [FlightsService, CustomInfoResDto, CustomListResDto, CustomResDto],
})
export class FlightsModule {}
