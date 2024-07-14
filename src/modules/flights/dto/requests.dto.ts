import { PartialType } from '@nestjs/swagger';
import { ParseIntPipe } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsEmail, IsNumber, IsOptional, IsBoolean } from 'class-validator';

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
  
export class FlightQueryDto extends paginationDto {
    @ApiProperty({
        required:  false,
    })
    search: string = null;
}


export class CreateFlightDto {
    @ApiProperty({
        nullable: true,
        required: false
    })
    destination: String;

    @ApiProperty({
        nullable: true,
        required: false
    })
    departure: String;
}



export class UpdateFlightDto extends PartialType(CreateFlightDto) {}
