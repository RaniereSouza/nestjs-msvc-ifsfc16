import { Injectable } from '@nestjs/common';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { PrismaService } from '../prisma/prisma/prisma.service';
import { DirectionsService } from '../maps/directions/directions.service';

@Injectable()
export class RoutesService {
  constructor(
    private prismaService: PrismaService,
    private directionsService: DirectionsService,
  ) {}

  async create(createRouteDto: CreateRouteDto) {
    const { available_travel_modes, geocoded_waypoints, routes, request } =
      await this.directionsService.getDirections(
        createRouteDto.source_id,
        createRouteDto.destination_id,
      );
    const leg = routes[0].legs[0];

    return this.prismaService.route.create({
      data: {
        name: createRouteDto.name,
        source: {
          name: leg.start_address,
          location: {
            lat: leg.start_location.lat,
            lng: leg.start_location.lng,
          },
        },
        destination: {
          name: leg.end_address,
          location: {
            lat: leg.end_location.lat,
            lng: leg.end_location.lng,
          },
        },
        distance: leg.distance.value,
        duration: leg.duration.value,
        directions: JSON.stringify({
          available_travel_modes,
          geocoded_waypoints,
          routes,
          request,
        }),
      },
    });
  }

  findAll() {
    return this.prismaService.route.findMany();
  }

  findOne(id: string) {
    return this.prismaService.route.findUniqueOrThrow({ where: { id } });
  }

  update(id: number, updateRouteDto: UpdateRouteDto) {
    return `This action updates a #${id} route:\n${JSON.stringify(
      updateRouteDto,
    )}`;
  }

  remove(id: number) {
    return `This action removes a #${id} route`;
  }
}
