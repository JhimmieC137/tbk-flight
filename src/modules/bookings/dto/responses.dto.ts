import { ApiProperty } from "@nestjs/swagger";
import { Booking } from "../entities/booking.entity";

export class QueryResponseDto {
    @ApiProperty()
    totalCount: number = null;
    
    @ApiProperty()
    page: number = null;
}


export class BookingQueryResponseDto extends QueryResponseDto {
    @ApiProperty()
    bookings: Booking[] = [];
}