import { ViewDto } from '../dto/view.dto';
import { HotelDto } from '../dto/hotel.dto';
import { FoodDto } from '../dto/food.dto';
import { QuerylistDto } from '../dto/querylist.dto';

export type ScheduleSplitDto = {
  view: ViewDto[];
  hotel: HotelDto[];
  food: FoodDto[];
  querylist: QuerylistDto[];
};

export type QueryListNew = {
  status: string;
  pagecount: number;
  data: QuerylistDto[];
};
