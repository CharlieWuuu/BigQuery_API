import { ViewDto } from 'src/common/dto/view.dto';
import { HotelDto } from 'src/common/dto/hotel.dto';
import { FoodDto } from 'src/common/dto/food.dto';
import { QuerylistDto } from 'src/common/dto/querylist.dto';
import { ScheduleDto } from 'src/common/dto/schedule.dto';

// export interface DataCleanerResult {
//   view: ViewDto[];
//   hotel: HotelDataDto[];
//   food: FoodDto[];
//   querylist: QuerylistDto[];
// }

// // 型別定義
// interface View {
//   id: string;
//   name: string;
//   images?: string;
//   raw_name?: string;
//   description?: string;
//   city?: string;
//   tags?: string[];
//   lat?: number;
//   lng?: number;
// }

// interface Hotel {
//   name: string;
//   url: string;
//   city: string;
//   tags: string[];
//   lat: number;
//   lng: number;
// }

// interface Food {
//   name: string;
//   raw_text: string;
//   city: string;
// }

// interface DayInfo {
//   day: number;
//   date?: string;
//   abstract_1?: string;
//   view?: { id: string; name: string; memo_2?: string }[];
//   hotel?: { data: { name: string; url?: string }[] };
//   breakfast?: string;
//   lunch?: string;
//   dinner?: string;
// }

// export interface RawData {
//   name: string;
//   id: string;
//   price: string | number;
//   img: string;
//   city: string;
//   slogan?: string;
//   day: number;
//   travel?: string;
//   travel_no?: string;
//   schedule: DayInfo[];
// }

// interface Schedule {
//   free?: string;
//   day: number;
//   date: string;
//   title: string;
//   route: string[];
//   abstract_1: string;
//   abstract_2: View[];
//   memo_1?: string;
//   memo_2?: string;
//   memo_3?: string;
//   breakfast?: string;
//   lunch?: string;
//   dinner?: string;
//   hotel: string[];
//   food: string[];
// }

// interface Travel {
//   date?: string;
//   travel_no?: string;
//   price?: string;
// }

// interface QueryList {
//   name: string;
//   id: string;
//   price: number;
//   img: string;
//   city: string;
//   slogan?: string;
//   day: number;
//   travel?: Travel[];
//   travel_no?: string;
//   schedule: Schedule[];
//   tags: string[];
// }

interface Result {
  view: ViewDto[];
  hotel: HotelDto[];
  food: FoodDto[];
  querylist: QuerylistDto[];
}

type MealType = 'breakfast' | 'lunch' | 'dinner';

// 工具函式
function cleanPoiName(raw_name: string): string {
  let name = raw_name.replace(/【.*?】/g, '').replace(/\(.*?\)/g, '');
  if (name.includes('~')) {
    name = name.split('~').pop() || '';
  } else if (name.includes('～')) {
    name = name.split('～').pop() || '';
  } else if (name.includes('－')) {
    name = name.split('－').pop() || '';
  }
  name = name.replace(/[✈★]/g, '');
  return name.trim();
}

function isValidSpot(name: string): boolean {
  const blacklist_strict = [
    '溫暖的家',
    '機上餐食',
    '機上套餐',
    '自理',
    '敬請自理',
    '飯店內',
  ];
  for (const word of blacklist_strict) {
    if (name.includes(word) || name.trim() === '') {
      return false;
    }
  }
  return true;
}

function processSingleItinerary(
  raw_data: QuerylistDto,
): [ViewDto[], HotelDto[], FoodDto[], ScheduleDto[]] {
  const view: ViewDto[] = [];
  const hotel: HotelDto[] = [];
  const food: FoodDto[] = [];
  const food_map: Record<string, FoodDto> = {};
  const schedule: ScheduleDto[] = [];

  if (!raw_data.schedule) return [view, hotel, food, schedule];

  for (const day_info of raw_data.schedule) {
    const day_num = day_info.day;
    const day_title = day_info.abstract_1 || `Day ${day_num}`;

    const daily_route: string[] = [];
    // A. 提取景點
    if (day_info.view) {
      for (const spot of day_info.view) {
        const raw_name = spot.name || '';
        const spot_id = spot.id;

        if (!isValidSpot(raw_name)) continue;

        const clean_name = cleanPoiName(raw_name);
        daily_route.push(clean_name);

        if (spot_id && !(spot_id in view)) {
          view[spot_id] = {
            id: spot_id,
            name: clean_name,
            raw_name: raw_name,
            description: spot.memo_2 || '',
            city: raw_data.city,
            tags: [],
            lat: 0,
            lng: 0,
          };
        }
      }
    }

    // B. 提取飯店
    let hotels: HotelDto[] = [];
    const daily_hotel: HotelDto[] = [];
    if (Array.isArray(day_info.hotel)) {
      hotels = day_info.hotel;
      for (const h of hotels) {
        const h_name = h.name || '';
        daily_hotel.push(h);

        if (isValidSpot(h_name) && !h_name.includes('請自理')) {
          const h_key = h_name;
          if (!hotels.find((hotel) => hotel.name === h_key)) {
            hotels.push({
              name: h_name,
              url: h.url || '',
              city: '',
              tags: [],
              lat: 0,
              lng: 0,
            });
          }
        }
      }
    }

    // C. 提取餐廳
    const daily_food: string[] = [];
    for (const meal_type of ['breakfast', 'lunch', 'dinner'] as MealType[]) {
      const meal_desc = day_info[meal_type] ?? '';
      daily_food.push(meal_desc);

      if (!isValidSpot(meal_desc)) continue;

      const concept_key = meal_desc.trim();
      if (!(concept_key in food_map)) {
        food_map[concept_key] = {
          name: cleanPoiName(meal_desc),
          raw_text: meal_desc,
          city: '',
        };
        food.push(food_map[concept_key]);
      }
    }

    schedule.push({
      day: day_num,
      date: day_info.date || '',
      title: cleanPoiName(day_title),
      route: daily_route,
      hotel: daily_hotel,
      food: daily_food || [],
      abstract_1: day_info.abstract_1 || '',
      abstract_2: day_info.abstract_2 || [],
    });
  }
  console.log(view, hotel, food, schedule);
  return [view, hotel, food, schedule];
}

function deduplicate<T>(items: T[], key: keyof T): T[] {
  const seen = new Set();
  const result: T[] = [];
  for (const item of items) {
    const k = item[key];
    if (k && !seen.has(k)) {
      seen.add(k);
      result.push(item);
    }
  }
  return result;
}

// --- 主函式 ---
export function dataCleaner(raw_data_list: QuerylistDto[]): Result {
  const result: Result = { view: [], hotel: [], food: [], querylist: [] };

  for (const raw_data of raw_data_list) {
    const [view, hotel, food, schedule] = processSingleItinerary(raw_data);
    console.log(view, hotel, food, schedule);
    result.view.push(...Object.values(view));
    result.hotel.push(...Object.values(hotel));
    result.food.push(...food);
    result.querylist.push({
      name: raw_data.name,
      id: raw_data.id,
      img: raw_data.img,
      city: raw_data.city,
      slogan: raw_data.slogan,
      day: raw_data.day,
      travel: Array.isArray(raw_data.travel) ? raw_data.travel : undefined,
      travel_no: raw_data.travel_no,
      schedule: schedule,
      tags: [],
    });
  }

  return {
    view: deduplicate(result.view, 'id'),
    hotel: deduplicate(result.hotel, 'name'),
    food: deduplicate(result.food, 'name'),
    querylist: deduplicate(result.querylist, 'id'),
  };
}
