import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { GetHomesResponseDto } from './dto/home.dto';
import { GetHomesFilters } from './interfaces/getHomesFilters.interface';
import { PropertyType } from '@prisma/client';
import { CreateHomeParams } from './interfaces/createHomeParams.interface';
import { UpdateHomeParams } from './interfaces/updateHomeParams.interface';
import { UserInfo } from './interfaces/userTokenInfo.interface';

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

  async createHome(
    {
      address,
      numberOfBedrooms,
      numberOfBathrooms,
      city,
      price,
      landSize,
      propertyType,
      images,
    }: CreateHomeParams,
    userId: number,
  ) {
    const home = await this.prisma.home.create({
      data: {
        address,
        number_of_bedrooms: numberOfBedrooms,
        number_of_bathrooms: numberOfBathrooms,
        city,
        price,
        land_size: landSize,
        propertyType,
        realtor_id: userId,
      },
    });

    // const image = await this.prisma.image.createMany({
    //   data: [{url: 'url1', home_id: 1}]
    // })

    const homeImages = images.map((image) => {
      return { ...image, home_id: home.id };
    });

    await this.prisma.image.createMany({
      data: homeImages,
    });

    return new GetHomesResponseDto(home);
  }

  async updateHome(id: number, updateData: UpdateHomeParams, user: UserInfo) {
    const home = await this.prisma.home.findFirst({
      where: {
        id,
      },
    });

    if (!home) {
      throw new NotFoundException(`Home with id ${id} not found`);
    }

    const realtorByHomeId = await this.getRealtorByHomeId(id);

    if (!realtorByHomeId) {
      throw new NotFoundException('No realtor found for this home');
    }

    if (realtorByHomeId.realtor.id !== user.id) {
      throw new UnauthorizedException();
    }

    const updatedHome = await this.prisma.home.update({
      where: {
        id,
      },
      data: updateData,
    });

    return new GetHomesResponseDto(updatedHome);
  }

  async deleteHome(id: number, user: UserInfo) {
    const realtor = await this.getRealtorByHomeId(id);

    if (realtor.realtor.id !== user.id) {
      throw new UnauthorizedException();
    }

    await this.prisma.home.delete({
      where: {
        id,
      },
    });
  }

  async getRealtorByHomeId(homeId: number) {
    const realtorByHomeId = await this.prisma.home.findUnique({
      where: {
        id: homeId,
      },
      select: {
        realtor: {
          select: {
            name: true,
            id: true,
            email: true,
            phone_number: true,
          },
        },
      },
    });

    return realtorByHomeId;
  }
}
