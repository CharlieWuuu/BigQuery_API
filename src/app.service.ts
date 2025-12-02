import { Injectable } from '@nestjs/common';
import { QuerylistService } from './querylist/querylist.service';
import { ScheduleService } from './schedule/schedule.service';
import { ViewService } from './view/view.service';
import axios from 'axios';
import { Cron, CronExpression } from '@nestjs/schedule';
import { dataEnrich } from './common/utils/data_enrich';

function formatDate(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())}`;
}

function encodeBase64(str: string): string {
  const utf8Bytes: Uint8Array = new TextEncoder().encode(str);
  const binaryString = String.fromCharCode.apply(null, utf8Bytes) as string;
  return btoa(binaryString);
}

@Injectable()
export class AppService {
  constructor(
    private readonly querylistService: QuerylistService,
    private readonly scheduleService: ScheduleService,
    private readonly viewService: ViewService,
  ) {}

  // private async updateDateChunk(pageid: number) {
  //   let result_querylist: QueryListNew;
  //   let result: QuerylistDto[] = [];
  //   let rawData: ScheduleSplitDto;
  //   let enrichedViews: ViewDto[] = [];
  //   let enrichedHotels: HotelDto[] = [];
  //   let enrichedFoods: FoodDto[] = [];
  //   const port = process.env.PORT || 8080;

  //   // 步驟1: 取得所有行程資料
  //   try {
  //     console.log(`📝 步驟1: 開始取得行程資料第${pageid}頁...`);
  //     const res_querylist = await fetch(
  //       `http://localhost:${port}/querylist?pageid=${pageid}`,
  //       {
  //         method: 'GET',
  //         headers: { 'Content-Type': 'application/json' },
  //       },
  //     );

  //     if (!res_querylist.ok) {
  //       throw new Error(
  //         `HTTP ${res_querylist.status}: ${res_querylist.statusText}`,
  //       );
  //     }

  //     result_querylist = (await res_querylist.json()) as QueryListNew;
  //     pagecount = result_querylist.pagecount;
  //     console.log(`✅ 步驟1完成: 取得行程資料，總頁數 ${pagecount}`);
  //   } catch (error) {
  //     console.error('❌ 步驟1失敗:', error.message);
  //     throw new Error(`步驟1失敗: ${error.message}`);
  //   }

  //   // 步驟2: 取得詳細行程資料
  //   try {
  //     console.log('📝 步驟2: 開始取得所有行程的詳細行程資料...');
  //     const res = await fetch(`http://localhost:${port}/schedule/addSchedule`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(result_querylist),
  //     });

  //     if (!res.ok) {
  //       throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  //     }

  //     result = (await res.json()) as QuerylistDto[];
  //     console.log(`✅ 步驟2完成: 取得 ${result?.length || 0} 筆詳細行程資料`);
  //   } catch (error) {
  //     console.error('❌ 步驟2失敗:', error.message);
  //     throw new Error(`步驟2失敗: ${error.message}`);
  //   }

  //   // 步驟3: 行程資料切分
  //   try {
  //     console.log('📝 步驟3: 開始進行行程資料切分...');
  //     const res_split = await fetch(
  //       `http://localhost:${port}/schedule/splitData`,
  //       {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify(result),
  //       },
  //     );

  //     if (!res_split.ok) {
  //       throw new Error(`HTTP ${res_split.status}: ${res_split.statusText}`);
  //     }

  //     rawData = (await res_split.json()) as ScheduleSplitDto;
  //     console.log('✅ 步驟3完成: 行程資料切分完成', {
  //       view: rawData.view?.length || 0,
  //       hotel: rawData.hotel?.length || 0,
  //       food: rawData.food?.length || 0,
  //       querylist: rawData.querylist?.length || 0,
  //     });
  //   } catch (error) {
  //     console.error('❌ 步驟3失敗:', error.message);
  //     throw new Error(`步驟3失敗: ${error.message}`);
  //   }

  //   // 步驟4: 景點資料補強
  //   try {
  //     console.log('📝 步驟4: 開始進行景點資料補強...');
  //     const res_view = await fetch(`http://localhost:${port}/view/enrich`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ data: rawData.view }), // ✅ 修正格式
  //     });

  //     if (!res_view.ok) {
  //       throw new Error(`HTTP ${res_view.status}: ${res_view.statusText}`);
  //     }

  //     enrichedViews = (await res_view.json()) as ViewDto[];
  //     console.log(`✅ 步驟4完成: 景點資料補強完成 ${enrichedViews.length} 筆`);
  //   } catch (error) {
  //     console.error('❌ 步驟4失敗:', error.message);
  //     console.log('⚠️ 使用空陣列繼續處理');
  //     enrichedViews = []; // 失敗時使用空陣列
  //   }

  //   // 步驟5: 飯店資料補強
  //   try {
  //     console.log('📝 步驟5: 開始進行飯店資料補強...');
  //     const res_hotel = await fetch(`http://localhost:${port}/hotel/enrich`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ data: rawData.hotel }), // ✅ 修正格式
  //     });

  //     if (!res_hotel.ok) {
  //       throw new Error(`HTTP ${res_hotel.status}: ${res_hotel.statusText}`);
  //     }

  //     enrichedHotels = (await res_hotel.json()) as HotelDto[];
  //     console.log(`✅ 步驟5完成: 飯店資料補強完成 ${enrichedHotels.length} 筆`);
  //   } catch (error) {
  //     console.error('❌ 步驟5失敗:', error.message);
  //     console.log('⚠️ 使用空陣列繼續處理');
  //     enrichedHotels = []; // 失敗時使用空陣列
  //   }

  //   // 步驟6: 餐飲資料補強
  //   try {
  //     console.log('📝 步驟6: 開始進行餐飲資料補強...');
  //     const res_food = await fetch(`http://localhost:${port}/food/enrich`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ data: rawData.food }), // ✅ 修正格式
  //     });

  //     if (!res_food.ok) {
  //       throw new Error(`HTTP ${res_food.status}: ${res_food.statusText}`);
  //     }

  //     enrichedFoods = (await res_food.json()) as FoodDto[];
  //     console.log(`✅ 步驟6完成: 餐飲資料補強完成 ${enrichedFoods.length} 筆`);
  //   } catch (error) {
  //     console.error('❌ 步驟6失敗:', error.message);
  //     console.log('⚠️ 使用空陣列繼續處理');
  //     enrichedFoods = []; // 失敗時使用空陣列
  //   }

  //   // 步驟7: 景點資料上傳到 BigQuery
  //   try {
  //     console.log('📝 步驟7: 開始進行景點資料上傳到 BigQuery...');
  //     if (enrichedViews.length > 0) {
  //       const res_view_enrich = await fetch(
  //         `http://localhost:${port}/view/bigquery`,
  //         {
  //           method: 'POST',
  //           headers: { 'Content-Type': 'application/json' },
  //           body: JSON.stringify({ data: enrichedViews }), // ✅ 修正格式
  //         },
  //       );

  //       if (!res_view_enrich.ok) {
  //         throw new Error(
  //           `HTTP ${res_view_enrich.status}: ${res_view_enrich.statusText}`,
  //         );
  //       }

  //       const result_view_post = await res_view_enrich.json();
  //       console.log('✅ 步驟7完成: 景點資料上傳完成');
  //     } else {
  //       console.log('⚠️ 步驟7跳過: 沒有景點資料需要上傳');
  //     }
  //   } catch (error) {
  //     console.error('❌ 步驟7失敗:', error.message);
  //     // 不中斷流程，繼續下一步
  //   }

  //   // 步驟8: 飯店資料上傳到 BigQuery
  //   try {
  //     console.log('📝 步驟8: 開始進行飯店資料上傳到 BigQuery...');
  //     if (enrichedHotels.length > 0) {
  //       const res_hotel_enrich = await fetch(
  //         `http://localhost:${port}/hotel/bigquery`,
  //         {
  //           method: 'POST',
  //           headers: { 'Content-Type': 'application/json' },
  //           body: JSON.stringify({ data: enrichedHotels }), // ✅ 修正格式
  //         },
  //       );

  //       if (!res_hotel_enrich.ok) {
  //         throw new Error(
  //           `HTTP ${res_hotel_enrich.status}: ${res_hotel_enrich.statusText}`,
  //         );
  //       }

  //       const result_hotel_post = await res_hotel_enrich.json();
  //       console.log('✅ 步驟8完成: 飯店資料上傳完成');
  //     } else {
  //       console.log('⚠️ 步驟8跳過: 沒有飯店資料需要上傳');
  //     }
  //   } catch (error) {
  //     console.error('❌ 步驟8失敗:', error.message);
  //     // 不中斷流程，繼續下一步
  //   }

  //   // 步驟9: 餐飲資料上傳到 BigQuery
  //   try {
  //     console.log('📝 步驟9: 開始進行餐飲資料上傳到 BigQuery...');
  //     if (enrichedFoods.length > 0) {
  //       const res_food_enrich = await fetch(
  //         `http://localhost:${port}/food/bigquery`,
  //         {
  //           method: 'POST',
  //           headers: { 'Content-Type': 'application/json' },
  //           body: JSON.stringify({ data: enrichedFoods }), // ✅ 修正格式
  //         },
  //       );

  //       if (!res_food_enrich.ok) {
  //         throw new Error(
  //           `HTTP ${res_food_enrich.status}: ${res_food_enrich.statusText}`,
  //         );
  //       }

  //       const result_food_post = await res_food_enrich.json();
  //       console.log('✅ 步驟9完成: 餐飲資料上傳完成');
  //     } else {
  //       console.log('⚠️ 步驟9跳過: 沒有餐飲資料需要上傳');
  //     }
  //   } catch (error) {
  //     console.error('❌ 步驟9失敗:', error.message);
  //     // 不中斷流程，繼續下一步
  //   }

  //   // 步驟10: 行程資料上傳到 BigQuery
  //   try {
  //     console.log('📝 步驟10: 開始進行行程資料上傳到 BigQuery...');
  //     if (rawData.querylist && rawData.querylist.length > 0) {
  //       const res_schedule_enrich = await fetch(
  //         `http://localhost:${port}/schedule/bigquery`,
  //         {
  //           method: 'POST',
  //           headers: { 'Content-Type': 'application/json' },
  //           body: JSON.stringify({ data: rawData.querylist }), // ✅ 修正格式
  //         },
  //       );

  //       console.log('rawData.querylist', rawData.querylist);
  //       console.log('rawData.querylist', rawData.querylist[0].travel);
  //       console.log('rawData.querylist', rawData.querylist[0].schedule);

  //       if (!res_schedule_enrich.ok) {
  //         throw new Error(
  //           `HTTP ${res_schedule_enrich.status}: ${res_schedule_enrich.statusText}`,
  //         );
  //       }

  //       const result_schedule_post = await res_schedule_enrich.json();
  //       console.log('✅ 步驟10完成: 行程資料上傳完成');
  //     } else {
  //       console.log('⚠️ 步驟10跳過: 沒有行程資料需要上傳');
  //     }
  //   } catch (error) {
  //     console.error('❌ 步驟10失敗:', error.message);
  //     // 不中斷流程
  //   }
  // }

  // async updateData(): Promise<string> {
  //   let pageid: number = 1;
  //   console.log(`\n🚀 開始處理第 ${pageid} 頁資料...\n`);
  //   await this.updateDateChunk(pageid);

  //   for (pageid = 2; pageid <= pagecount; pageid++) {
  //     console.log(`\n🚀 開始處理第 ${pageid} 頁資料...\n`);
  //     await this.updateDateChunk(pageid);
  //   }
  //   console.log('🎉 所有資料更新完成！');
  //   return '資料已更新完成';
  // }

  private async getTourData(page_count: number) {
    console.log('[ app.service ] 取得行程清單頁數...');
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);
    const halfYearLater = new Date(today);
    halfYearLater.setMonth(today.getMonth() + 7);

    const nextMonthStr = formatDate(nextMonth);
    const halfYearLaterStr = formatDate(halfYearLater);

    return await axios.request({
      method: 'GET',
      url: 'https://travelapi.besttour.com.tw/api/tour/v3/tourData/',
      headers: {
        'Content-Type': 'application/json',
        Authorization: encodeBase64(`340805,${formatDate(new Date())},&df2*-5`),
      },
      data: {
        date_start: nextMonthStr, // 出發日期：下個月
        date_end: halfYearLaterStr, // 出發日期：下個月的半年後
        takeoff_city: ['桃園', '松山', '台中', '高雄'], // 出發城市
        area: '12, 156', // 日本、泰國
        page: 1,
        page_count,
      },
    });
  }

  async updateDataTourData(
    page: number,
    page_count: number,
  ): Promise<{ status: string; msg: string }> {
    // 1. 刪除過期行程
    await this.scheduleService.deleteItinerary();

    // 2. 取得行程、景點 ID
    const travelIds = await this.querylistService.query();

    // 3. 取得頁數
    const res = await this.getTourData(page_count);
    const total_page = res.data.page.total_page as number;

    // 4. 逐頁處理資料
    for (page; page <= total_page; page++) {
      try {
        console.log(
          `[ app.service ] 取得第 ${page} / ${total_page} 頁 tourData`,
        );
        // 5. 取得清單
        const tourData = (
          await this.querylistService.tourData(page, page_count)
        ).data as number[];

        // 6. 過濾已存在的行程與景點
        const filteredItineraryArr = tourData.filter(
          (itinerary) => !travelIds.includes(itinerary),
        );

        console.log(
          `[ app.service ] 過濾後剩餘 ${filteredItineraryArr.length} 筆新行程資料`,
        );

        if (filteredItineraryArr.length !== 0) {
          // 7. 取得細節
          const itineraryArr =
            await this.scheduleService.itinerary(filteredItineraryArr);
          console.log('[ app.service ] 取得行程細節');

          // 8. 只針對沒上傳過的資料拆資料
          const { itinerary: itineraryData, view: viewData } =
            this.scheduleService.splitDataItinerary(itineraryArr);

          // 9. 上傳 Itinerary（只上傳新資料）
          if (itineraryData.length > 0) {
            await this.scheduleService.mergeItinerary(itineraryData);
          }

          // 10. 上傳景點（只上傳新資料）
          if (viewData.length > 0) {
            await this.viewService.mergeView(viewData);
          }
        }
      } catch (error) {
        console.error(
          `[ app.service ] ❌ 處理第 ${page} 頁時發生錯誤，跳過:`,
          error,
        );
        // 繼續執行下一次迴圈 (下一頁)
        continue;
      }
    }
    console.log('[ app.service ] 所有資料更新完成');

    // 11. 確認哪些景點缺經緯度
    const viewIds = await this.viewService.queryViewNotEnrichedId();

    // 設定批次大小
    const BATCH_SIZE = 5;

    // 遍歷 viewIds 陣列，每次處理一個批次
    for (let i = 0; i < viewIds.length; i += BATCH_SIZE) {
      // 1. 取得當前批次的 view IDs
      const batchIds = viewIds.slice(i, i + BATCH_SIZE);
      console.log('[ app.service ] 處理景點經緯度 (批次:', i, ')', batchIds);

      // 2. 撈景點 (並行處理)
      const fetchPromises = await this.viewService.queryView(batchIds);

      // 3. AI 補經緯度 (單次批次呼叫)
      const viewEnriched = await dataEnrich(fetchPromises, 'view');

      // 4. 更新景點經緯度 (單次批次更新)
      await this.viewService.mergeView(viewEnriched);

      // 記錄進度
      console.log(
        `[ app.service ] 已完成景點增強與批次更新：${i + 1} - ${Math.min(i + BATCH_SIZE, viewIds.length)} / 總數 ${viewIds.length}`,
      );
    }

    return { status: '00', msg: 'Success' };
  }

  // 測試：下午 3:45 執行
  @Cron('45 15 * * *')
  async handleCron() {
    await this.updateDataTourData(1, 20); // 參數可依需求調整
  }
}
