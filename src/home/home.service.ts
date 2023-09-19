import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { GetHomesResponseDto } from './dto/home.dto';
import { GetHomesFilters } from './interfaces/getHomesFilters.interface';
import { PropertyType } from '@prisma/client';

@Injectable()
export class HomeService {
  constructor(private prisma: PrismaService) {}

  async getHomes(filters: GetHomesFilters): Promise<GetHomesResponseDto[]> {
    const homes = await this.prisma.home.findMany({
      select: {
        id: true,
        address: true,
        city: true,
        price: true,
        propertyType: true,
        number_of_bathrooms: true,
        number_of_bedrooms: true,
        images: {
          select: {
            url: true,
          },
          take: 1,
        },
      },
      where: filters,
    });

    if (!homes.length) {
      throw new NotFoundException('No homes with specified filters found');
    }
    return homes.map((home) => {
      const fetchHome = { ...home, image: home.images[0].url };
      delete fetchHome.images;
      return new GetHomesResponseDto(fetchHome);
    });
  }

  async getHomeById(id: number) {
    const home = await this.prisma.home.findFirst({
      where: {
        id,
      },
    });

    if (!home) {
      return {};
    }
    return new GetHomesResponseDto(home);
  }
  // initializeFilters(
  //   city?: string,
  //   minPrice?: string,
  //   maxPrice?: string,
  //   propertyType?: PropertyType,
  // ): GetHomesFilters {
  //   const price =
  //     minPrice || maxPrice
  //       ? {
  //           ...(minPrice && { gte: parseFloat(minPrice) }),
  //           ...(maxPrice && { lte: parseFloat(maxPrice) }),
  //         }
  //       : undefined;

  //   return {
  //     ...(city && { city }),
  //     ...(price && { price }),
  //     ...(propertyType && { propertyType }),
  //   };
  // }
}
