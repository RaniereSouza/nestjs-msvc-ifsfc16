import { Controller, Get, Query } from '@nestjs/common';
import { DirectionsService } from './directions.service';

@Controller('directions')
export class DirectionsController {
  constructor(private directionsService: DirectionsService) {}

  @Get()
  getDirections(
    @Query('origin_id') originId: string,
    @Query('destination_id') destinationId: string,
  ) {
    return this.directionsService.getDirections(originId, destinationId);
  }
}
