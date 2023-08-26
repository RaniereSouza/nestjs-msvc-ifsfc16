import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Client as GoogleMapsClient,
  DirectionsRequest,
  TravelMode,
} from '@googlemaps/google-maps-services-js';

@Injectable()
export class DirectionsService {
  private gMapsKey!: string;

  constructor(
    private googleMapsClient: GoogleMapsClient,
    private configService: ConfigService,
  ) {
    this.gMapsKey = this.configService.getOrThrow<string>(
      'GOOGLE_MAPS_API_KEY',
    );
  }

  async getDirections(placeOriginId: string, placeDestinationId: string) {
    const requestParams: DirectionsRequest['params'] = {
      origin: `place_id:${placeOriginId}`,
      destination: `place_id:${placeDestinationId}`,
      mode: TravelMode.driving,
      key: this.gMapsKey,
    };

    const { data: directionsData } = await this.googleMapsClient.directions({
      params: requestParams,
    });

    return {
      ...directionsData,
      request: {
        origin: {
          place_id: requestParams.origin,
          location: {
            lat: directionsData.routes[0].legs[0].start_location.lat,
            lng: directionsData.routes[0].legs[0].start_location.lng,
          },
        },
        destination: {
          place_id: requestParams.destination,
          location: {
            lat: directionsData.routes[0].legs[0].end_location.lat,
            lng: directionsData.routes[0].legs[0].end_location.lng,
          },
        },
        mode: requestParams.mode,
      },
    };
  }
}
