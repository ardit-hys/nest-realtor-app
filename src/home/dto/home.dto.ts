import { PropertyType } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

export class GetHomesResponseDto {
  id: number;
  address: string;

  @Exclude()
  number_of_bedrooms: number;

  @Expose({ name: 'numberOfBedrooms' })
  numberOfBedrooms() {
    return this.number_of_bedrooms;
  }

  @Exclude()
  number_of_bathrooms: number;

  city: string;

  @Exclude()
  listed_date: Date;

  @Expose({ name: 'listedDate' })
  getListedDate() {
    return this.listed_date;
  }

  price: number;

  @Exclude()
  land_size: number;

  @Expose({ name: 'landSize' })
  getLandSize() {
    return this.land_size;
  }

  propertyType: PropertyType;

  image: string;

  @Exclude()
  created_at: Date;
  @Exclude()
  updated_at: Date;
  @Exclude()
  realtor_id: number;

  constructor(partial: Partial<GetHomesResponseDto>) {
    Object.assign(this, partial);
  }
}

class Image {
  @IsString()
  @IsNotEmpty()
  url: string;
}

export class CreateHomeDto {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsNumber()
  @IsPositive()
  numberOfBedrooms: number;

  @IsNumber()
  @IsPositive()
  numberOfBathrooms: number;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsPositive()
  landSize: number;

  @IsEnum(PropertyType)
  propertyType: PropertyType;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Image)
  images: Image[];
}


export class UpdateHomeDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  address?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  numberOfBedrooms?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  numberOfBathrooms?: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  city?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  landSize?: number;

  @IsEnum(PropertyType)
  @IsOptional()
  propertyType?: PropertyType;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Image)
  @IsOptional()
  images?: Image[];
}