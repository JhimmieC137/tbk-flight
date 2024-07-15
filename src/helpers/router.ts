import { BookingsModule } from 'src/modules/bookings/bookings.module';
import { FlightsModule } from 'src/modules/flights/flights.module';
export const baseRoute = 'api/v1';

const flightsRoute = {
  path: baseRoute,
  module: FlightsModule,
};


const bookingsRoute = {
  path: baseRoute,
  module: BookingsModule,
};


export const appRoutes = [
  flightsRoute,
  bookingsRoute
];
