import { ViewDto } from '../dto/view.dto';
import { HotelDto } from '../dto/hotel.dto';
import { FoodDto } from '../dto/food.dto';
import { QuerylistDto } from '../dto/querylist.dto';

export interface ScheduleSplitDto {
  view: ViewDto[];
  hotel: HotelDto[];
  food: FoodDto[];
  querylist: QuerylistDto[];
}

export interface QueryListNew {
  status: string;
  pagecount: number;
  data: QuerylistDto[];
}
