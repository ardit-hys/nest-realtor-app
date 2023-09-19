import { PropertyType } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

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
