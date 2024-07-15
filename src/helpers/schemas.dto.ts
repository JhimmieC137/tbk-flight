import { Booking } from "src/modules/bookings/entities/booking.entity";
import { Flight } from "src/modules/flights/entities/flight.entity";

export class CustomInfoResDto {
  status: number = 200;
  message: string = 'Successful';
  info: string = '';
}

export class CustomErrResDto {
  status: number = 400;
  message: string = 'Failed';
  error: string = '';
}

export class SampleInfoResDto {
  status = 200;
  message = 'Successful';
  info = 'Request processed successfully';
}

export class CustomListResDto {
  status: number = 200;
  message: string = 'Successful';
  count: number = null;
  total_count: number = null;
  page: number = null;
  next_page: number = null;
  results: Flight[] | Booking[]= [];
}

export class CustomResDto {
  status: number = 200;
  message: string = 'Successful';
  results: object = {};
}
