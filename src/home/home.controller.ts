import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Put,
  Query,
  ParseIntPipe,
  Param,
} from '@nestjs/common';
import { HomeService } from './home.service';
import {
  CreateHomeDto,
  GetHomesResponseDto,
  UpdateHomeDto,
} from './dto/home.dto';
import { PropertyType } from '@prisma/client';
import { GetHomesFilters } from './interfaces/getHomesFilters.interface';
import { User } from '../user/decorators/user.decorator';
import { UserInfo } from './interfaces/userTokenInfo.interface';

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
  createHome(@Body() createHomeBody: CreateHomeDto, @User() user: UserInfo) {
    // console.log('USERCONTROLLER', user);
    return this.homeService.createHome(createHomeBody, user.id);
  }

  @Put(':id')
  updateHome(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateHomeBody: UpdateHomeDto,
    @User() user: UserInfo,
  ) {
    return this.homeService.updateHome(id, updateHomeBody, user);
  }

  @Delete(':id')
  deleteHome(@Param('id', ParseIntPipe) id: number, @User() user: UserInfo) {
    return this.homeService.deleteHome(id, user);
  }
}
