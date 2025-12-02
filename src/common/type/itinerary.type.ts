export interface FlyData {
  fly_no: string;
  fly_date: string;
  dep_city_code: string;
  arr_city_code: string;
  dep_tm: string;
  arr_tm: string;
  fly_line: string;
  dep_city: string;
  arr_city: string;
}

export interface ViewContent {
  list?: number;
  view_title: string;
  view_id: string;
  view_content?: string;
  view_image?: string;
  view_memo?: string;
  city?: string;
  tags?: string[];
  lat?: number;
  lng?: number;
}

export interface HotelContent {
  list: number;
  hotel_name: string;
  hotel_url: string;
}

export interface DayContent {
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  title: string;
  view_content: ViewContent[];
  hotel_content: HotelContent[];
}

export interface ItineraryDetail {
  travel_id: number;
  travel_no: string;
  travel_day: number;
  travel_date: string;
  country: string;
  takeoff_city: string;
  travel_image_url: string;
  travel_abstract: string;
  travel_city: string;
  price_adult: number;
  order_person: number;
  unpay_person: number;
  RQ_person: number;
  fly_data: FlyData[];
  day_content: DayContent[];
}
