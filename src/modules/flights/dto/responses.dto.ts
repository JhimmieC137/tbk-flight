import { ApiProperty } from "@nestjs/swagger";
import { Flight } from "../entities/flight.entity";

export class QueryResponseDto {
    @ApiProperty()
    totalCount: number = null;
    
    @ApiProperty()
    page: number = null;
}


export class FlightQueryResponseDto extends QueryResponseDto {
    @ApiProperty()
    flights: Flight[] = [];
}