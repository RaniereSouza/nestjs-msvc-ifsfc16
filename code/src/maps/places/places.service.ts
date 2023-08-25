import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Client as GoogleMapsClient,
  PlaceInputType,
} from '@googlemaps/google-maps-services-js';

@Injectable()
export class PlacesService {
  private gMapsKey!: string;

  constructor(
    private googleMapsClient: GoogleMapsClient,
    private configService: ConfigService,
  ) {
    this.gMapsKey = this.configService.getOrThrow<string>('GOOGLE_MAPS_API_KEY');
  }

  async findPlace(text: string) {
    const { data:placeData } = await this.googleMapsClient.findPlaceFromText({
      params: {
        input: text,
        inputtype: PlaceInputType.textQuery,
        fields: ['place_id', 'formatted_address', 'geometry', 'name'],
        key: this.gMapsKey,
      },
    });
    return placeData;
  }
}
