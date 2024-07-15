import { PartialType } from '@nestjs/swagger';
import { ParseIntPipe } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsEmail, IsNumber, IsOptional, IsBoolean } from 'class-validator';
import { Flight } from 'src/modules/flights/entities/flight.entity';

export class paginationDto {
    @ApiPropertyOptional({
      default: 1
    })
    @Transform(({ value }) => (value ? Number(value) : 1))
    @IsNumber()
    @IsOptional()
    page?: number;
    
    @ApiPropertyOptional({
      default: 10
    })
    @Transform(({ value }) => (value ? Number(value) : 1))
    @IsNumber()
    @IsOptional()
    limit?: number;
}
  
export class BookingQueryDto extends paginationDto {
    @ApiProperty({
        required:  false,
    })
    search: string = null;
}


export class CreateBookingDto {
    @ApiProperty({
        required: true
    })
    user_id: String;

    @ApiProperty({
        nullable: true,
        required: false
    })
    flight: Flight;
}


export class UpdateBookingDto extends PartialType(CreateBookingDto) {}
