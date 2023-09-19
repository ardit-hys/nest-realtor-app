import { PropertyType } from '@prisma/client';

export interface GetHomesFilters {
  city?: string;
  price?: {
    gte?: number;
    lte?: number;
  };
  propertyType?: PropertyType;
}
