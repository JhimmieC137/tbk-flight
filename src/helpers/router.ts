import { FlightsModule } from 'src/modules/flights/flights.module';
export const baseRoute = 'api/v1';

const flightsRoute = {
  path: baseRoute,
  module: FlightsModule,
};


export const appRoutes = [
  flightsRoute,
];
