import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma/prisma.service';

interface NewPointDto {
  route_id: string;
  lat: number;
  lng: number;
}

@Injectable()
export class RoutesDriverService {
  constructor(private prismaService: PrismaService) {}

  async createOrUpdate({ route_id, lat, lng }: NewPointDto) {
    return this.prismaService.routeDriver.upsert({
      include: { route: true },
      where: { route_id },
      create: {
        route_id,
        points: { set: { location: { lat, lng } } },
      },
      update: {
        route_id,
        points: { push: { location: { lat, lng } } },
      },
    });
  }
}
