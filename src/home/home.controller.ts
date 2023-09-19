import { Controller, Get, Post, Delete, Put, Query, ParseIntPipe, Param } from '@nestjs/common';
import { HomeService } from './home.service';
import { GetHomesResponseDto } from './dto/home.dto';
import { PropertyType } from '@prisma/client';
import { GetHomesFilters } from './interfaces/getHomesFilters.interface';

@Controller('home')
export class HomeController {
  constructor(private homeService: HomeService) {}

  @Get()
  getHomes(
    @Query('city') city?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('propertyType') propertyType?: PropertyType,
  ): Promise<GetHomesResponseDto[]> {
    const filters: GetHomesFilters = {
      city,
      price: {
        gte: minPrice ? parseInt(minPrice) : undefined,
        lte: maxPrice ? parseInt(maxPrice) : undefined,
      },
      propertyType,
    };
    return this.homeService.getHomes(filters);
  }

  @Get(':id')
  getHomeById(@Param('id', ParseIntPipe) id: number) {
    return this.homeService.getHomeById(id);
  }

  @Post()
  createHome() {
    return 'create';
  }

  @Put(':id')
  updateHome() {
    return {};
  }

  @Delete(':id')
  deleteHome() {
    return {};
  }
}
