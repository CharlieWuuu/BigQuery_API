import { Controller, Get, Post, Body } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
// import { ScheduleDto } from 'src/common/dto/schedule.dto';
import { ApiOperation, ApiBody, ApiQuery } from '@nestjs/swagger';
import { QuerylistDto } from 'src/common/dto/querylist.dto';
import type { QueryListNew } from 'src/common/type/schedule.type';

// const testData = [
//   {
//     name: '【特別企劃‧四國相撲５日】雷歐瑪森之湯、小豆島觀景纜車、大步危遊船、道後溫泉散策',
//     id: '5534',
//     price: '45900',
//     img: 'https://hsihung.ittms.com.tw/intranet/travel_list/images/5534.jpg',
//     city: '日本 松山',
//     slogan: '',
//     day: '5',
//     travel: [{ date: '12/10', travel_no: 'TAK05CI251210A', price: '45900' }],
//   },
//   {
//     name: '【特惠輕旅大阪５日】日本環球影城、京都清水寺、大阪城公園、下鴨神社、錦市場、黑毛和牛',
//     id: '27449',
//     price: '21800',
//     img: 'https://hsihung.ittms.com.tw/intranet/travel_list/images/27449.jpg',
//     city: '日本 京都',
//     slogan: '',
//     day: '5',
//     travel: [
//       { date: '12/14', travel_no: 'OSA05VZ251214Z', price: '21800' },
//       { date: '01/03', travel_no: 'OSA05VZ260103Z', price: '25800' },
//       { date: '01/06', travel_no: 'OSA05VZ260106Z', price: '26800' },
//       { date: '01/10', travel_no: 'OSA05VZ260110Z', price: '27800' },
//       { date: '01/13', travel_no: 'OSA05VZ260113Z', price: '26800' },
//       { date: '01/17', travel_no: 'OSA05VZ260117Z', price: '27800' },
//     ],
//   },
//   {
//     name: '【特選捷克波蘭１０日】維利奇卡鹽礦、布拉格城堡區、遊船、華沙、克拉克夫、OUTLET',
//     id: '26605',
//     price: '64800',
//     img: 'https://hsihung.ittms.com.tw/intranet/travel_list/images/26605.jpg',
//     city: '歐洲 捷克',
//     slogan: '東歐',
//     day: '10',
//     travel: [
//       { date: '01/13', travel_no: 'CZV10CA260113W', price: '64800' },
//       { date: '01/27', travel_no: 'CZV10CA260127W', price: '64800' },
//       { date: '02/24', travel_no: 'CZV10CA260224W', price: '64800' },
//       { date: '03/17', travel_no: 'CZV10CA260317W', price: '64800' },
//       { date: '03/24', travel_no: 'CZV10CA260324W', price: '64800' },
//     ],
//   },
// ];

// // const sampleData: QuerylistDto[] = [
// //   {
// //     name: '【特別企劃‧四國相撲５日】雷歐瑪森之湯、小豆島觀景纜車、大步危遊船、道後溫泉散策',
// //     id: '5534',
// //     img: 'https://hsihung.ittms.com.tw/intranet/travel_list/images/5534.jpg',
// //     city: '日本 松山',
// //     slogan: '',
// //     day: '5',
// //     travel: [
// //       {
// //         date: '12/10',
// //         travel_no: 'TAK05CI251210A',
// //         price: '45900',
// //       },
// //     ],
// //     schedule: [
// //       {
// //         day: '1',
// //         date: '12 10 2025',
// //         title: '四國香川縣溫泉',
// //         route: ['桃園國際機場高松空港'],
// //         hotel: {
// //           status: '1',
// //           data: [
// //             {
// //               name: '雷歐瑪REOMA森之湯溫泉SPA飯店',
// //               url: 'http://www.ooedoonsen.jp/reomanomori/',
// //             },
// //           ],
// //         },
// //         food: ['溫暖的家', '機上套餐', '飯店內迎賓會席料理或飯店自助餐'],
// //         abstract_1: '台北／高松空港－夜宿～四國香川縣溫泉',
// //         abstract_2: [{ id: 'VJPNKGW11', name: '桃園國際機場✈高松空港' }],
// //       },
// //     ],
// //     tags: [],
// //   },
// // ];

// const insertData: QuerylistDto[] = [
//   {
//     name: '【特別企劃‧四國相撲５日】雷歐瑪森之湯、小豆島觀景纜車、大步危遊船、道後溫泉散策',
//     id: '5534',
//     img: 'https://hsihung.ittms.com.tw/intranet/travel_list/images/5534.jpg',
//     city: '日本 松山',
//     slogan: '',
//     day: '5',
//     price: 45900,
//     travel: [
//       {
//         date: '12/10',
//         travel_no: 'TAK05CI251210A',
//         price: 45900,
//       },
//     ],
//     schedule: [
//       {
//         day: '1',
//         date: '12 10 2025',
//         title: '四國香川縣溫泉',
//         route: ['桃園國際機場高松空港'],
//         hotel: {
//           status: '1',
//           data: [
//             {
//               name: '雷歐瑪REOMA森之湯溫泉SPA飯店',
//               url: 'http://www.ooedoonsen.jp/reomanomori/',
//             },
//             {
//               name: '新樺川觀光飯店',
//               url: 'http://www.shinkabakawa.com/',
//             },
//             {
//               name: '高松麗嘉飯店ZEST',
//               url: 'http://www.rihga-takamatsu.co.jp/',
//             },
//           ],
//         },
//         food: ['溫暖的家', '機上套餐', '飯店內迎賓會席料理或飯店自助餐'],
//         abstract_1: '台北／高松空港－夜宿～四國香川縣溫泉',
//         abstract_2: [
//           {
//             id: 'VJPNKGW11',
//             name: '桃園國際機場✈高松空港',
//           },
//         ],
//       },
//       {
//         day: '2',
//         date: '12 11 2025',
//         title: '神隱少女油屋、少爺音樂鐘－愛媛縣',
//         route: [
//           '大步危．小步危 / 遊船趣',
//           '祖谷溪．葛藤橋',
//           '今治毛巾總店',
//           '神隱少女湯婆婆的湯屋、少爺機關鬧鐘',
//           '道後溫泉♨',
//         ],
//         hotel: {
//           status: '1',
//           data: [
//             {
//               name: '今治溫泉 汐之丸',
//               url: 'http://www.hotel-ajour.jp/',
//             },
//             {
//               name: '奧道後 壹湯之守',
//               url: 'https://www.okudogo.co.jp/',
//             },
//             {
//               name: '大江戶溫泉物語 道後',
//               url: 'http://dogo-saichoraku.jp/',
//             },
//             {
//               name: '道後溫泉茶玻璃',
//               url: 'http://www.chaharu.com/',
//             },
//             {
//               name: '道後王子飯店',
//               url: 'http://www.dogoprince.co.jp/',
//             },
//           ],
//         },
//         food: [
//           '飯店內享用',
//           '大步危川魚鄉村料理￥2200',
//           '飯店內迎賓會席料理或飯店自助餐',
//         ],
//         abstract_1:
//           '大步危‧小步危～仙境溪谷遊船趣－秘境祖谷溪‧葛藤橋(日本三大奇橋之一)－愛媛必買伴手禮～今治毛巾總店－道後溫泉街散策～神隱少女油屋、少爺音樂鐘－愛媛縣',
//         abstract_2: [
//           {
//             id: 'VJPNTKS01',
//             name: '仙境奇峽－大步危．小步危 / 遊船趣',
//           },
//           {
//             id: 'VJPNTKS02',
//             name: '日本三大奇橋－祖谷溪．葛藤橋',
//           },
//           {
//             id: 'VJPNEHI37',
//             name: '今治毛巾總店',
//           },
//           {
//             id: 'VJPNEHI04',
//             name: '神隱少女湯婆婆的湯屋、少爺機關鬧鐘',
//           },
//           {
//             id: 'VJPNEHI05',
//             name: '日本最古老名湯－道後溫泉♨',
//           },
//         ],
//       },
//       {
//         day: '3',
//         date: '12 12 2025',
//         title: '郵輪港口搭船－夜宿小豆島溫泉飯店',
//         route: [
//           '松山城公園',
//           '小豆島遊船觀光',
//           '京寶亭',
//           '小豆島橄欖公園',
//           '日本三大絕美溪谷之一',
//         ],
//         hotel: {
//           status: '1',
//           data: [
//             {
//               name: '小豆島OLIVEAN',
//               url: 'http://olivean.com/',
//             },
//           ],
//         },
//         food: [
//           '飯店內享用',
//           '日式定食￥2200',
//           '飯店內迎賓會席料理或飯店自助餐',
//         ],
//         abstract_1:
//           '日本三大平山城堡～松山城公園～(搭乘空中纜車、不上天守閣）－港口搭渡輪（瀨戶內海、島影相映美景）－小豆島觀光：小豆島醬油之鄉～京寶亭－橄欖公園～白色風車－寒霞溪～日本三大絕美溪谷之一(搭乘單程觀景纜車)～郵輪港口搭船－夜宿小豆島溫泉飯店',
//         abstract_2: [
//           {
//             id: 'VJPNEHI03',
//             name: '松山城公園(含空中纜車、不上天守閣)',
//           },
//           {
//             id: 'VJPNKGW09',
//             name: '小豆島遊船觀光',
//           },
//           {
//             id: 'VJPNKGW49',
//             name: '小豆島醬之鄉～京寶亭',
//           },
//           {
//             id: 'VJPNKGW03',
//             name: '亞洲愛情海－小豆島橄欖公園',
//           },
//           {
//             id: 'VJPNKOH15',
//             name: '寒霞溪～日本三大絕美溪谷之一(搭乘單程觀景纜車)',
//           },
//         ],
//       },
//       {
//         day: '4',
//         date: '12 13 2025',
//         title: '相撲比賽》',
//         route: ['小豆島天使之路', '相撲巡迴表演大賽'],
//         hotel: {
//           status: '1',
//           data: [
//             {
//               name: 'Dormy Inn高松中央公園前天然溫泉',
//               url: 'https://dormy-hotels.com/dormyinn/hotels/takamatsuchuo/?utm_source=google&utm_medium=gbp&utm_campaign=gbpurl',
//             },
//             {
//               name: 'SECOND STAGE櫻花莊溫泉飯店',
//               url: 'http://hotel-secondstage.com/',
//             },
//             {
//               name: 'Hyper Resort Villa鹽江',
//               url: 'http://www.hyper-inn.net/asp/newscat.asp?nc_id=76',
//             },
//             {
//               name: '高松JR CLEMENT(前:高松全日空)',
//               url: 'http://www.jrclement.co.jp/',
//             },
//           ],
//         },
//         food: [
//           '飯店內享用',
//           '日式御膳風味￥2500',
//           '飯店內迎賓會席料理或飯店自助餐',
//         ],
//         abstract_1:
//           '天使的散步道（天使之路）－港口搭渡輪（瀨戶內海、島影相映美景）－《日本相撲聖域：體驗日本國民體育的力量～相撲比賽》',
//         abstract_2: [
//           {
//             id: 'VJPNKGW67',
//             name: '戀人聖地～小豆島天使之路',
//           },
//           {
//             id: 'VJPNKGW42',
//             name: '相撲巡迴表演大賽',
//           },
//         ],
//       },
//       {
//         day: '5',
//         date: '12 14 2025',
//         title: '金刀比羅宮－免稅店－綾川AEON－高松空港／台北',
//         route: ['金刀比羅宮', '免稅店', '香川AEON', '高松空港台北'],
//         hotel: {
//           status: '1',
//           data: [
//             {
//               name: '溫暖的家',
//               url: '',
//             },
//           ],
//         },
//         food: ['飯店內享用', '香川名物：讚岐烏龍麵風味定食￥2200', '機上套餐'],
//         abstract_1: '海之守護神～金刀比羅宮－免稅店－綾川AEON－高松空港／台北',
//         abstract_2: [
//           {
//             id: 'VJPNKGW02',
//             name: '海之守護神～金刀比羅宮',
//           },
//           {
//             id: 'VJPNKGW40',
//             name: '免稅店',
//           },
//           {
//             id: 'VJPNKGW07',
//             name: '香川AEON',
//           },
//           {
//             id: 'VJPNKGW12',
//             name: '高松空港✈台北',
//           },
//         ],
//       },
//     ],
//     tags: [],
//   },
//   {
//     name: '【特惠輕旅大阪５日】日本環球影城、京都清水寺、大阪城公園、下鴨神社、錦市場、黑毛和牛',
//     id: '27449',
//     img: 'https://hsihung.ittms.com.tw/intranet/travel_list/images/27449.jpg',
//     city: '日本 京都',
//     slogan: '',
//     day: '5',
//     price: 21800,
//     travel: [
//       {
//         date: '12/14',
//         travel_no: 'OSA05VZ251214Z',
//         price: 21800,
//       },
//       {
//         date: '01/03',
//         travel_no: 'OSA05VZ260103Z',
//         price: 25800,
//       },
//       {
//         date: '01/06',
//         travel_no: 'OSA05VZ260106Z',
//         price: 26800,
//       },
//       {
//         date: '01/10',
//         travel_no: 'OSA05VZ260110Z',
//         price: 27800,
//       },
//       {
//         date: '01/13',
//         travel_no: 'OSA05VZ260113Z',
//         price: 26800,
//       },
//       {
//         date: '01/17',
//         travel_no: 'OSA05VZ260117Z',
//         price: 27800,
//       },
//     ],
//     schedule: [
//       {
//         day: '1',
//         date: '12 14 2025',
//         title: '錦市場→住宿飯店',
//         route: [
//           '桃園國際機場關西空港',
//           '世界文化遺產：清水寺',
//           '音羽之瀧',
//           '又稱二寧坂',
//           '錦市場',
//         ],
//         hotel: {
//           status: '1',
//           data: [
//             {
//               name: 'CHISUN PREMIUM 京都九條飯店(附設大浴場)',
//               url: 'https://www.solarehotels.com/hotel/kyoto/cp-kk/',
//             },
//             {
//               name: 'LOISIR京都東寺飯店(2023年10月新開幕)(附設大浴場)',
//               url: 'https://www.solarehotels.com/hotel/kyoto/loisir-kyototoji/',
//             },
//             {
//               name: '烏丸京都飯店',
//               url: 'https://www.hotel.kyoto/karasuma/?doing_wp_cron=1668500345.7645380496978759765625',
//             },
//           ],
//         },
//         food: ['XXX', '方便逛街～敬請自理★贈壽司餐盒+茶', '方便逛街～敬請自理'],
//         abstract_1:
//           '台北／關西空港－世界文化遺產：清水寺～清水舞台～音羽之瀧～二、三年阪步道－京都必訪旅遊人氣景點～新京極～享有京都廚房之美譽～錦市場→住宿飯店',
//         abstract_2: [
//           {
//             id: 'VJPNKIX01',
//             name: '桃園國際機場✈關西空港',
//           },
//           {
//             id: 'VJPNKTO23',
//             name: '世界文化遺產：清水寺',
//           },
//           {
//             id: 'VJPNKTO25',
//             name: '日本十大名泉之首~音羽之瀧',
//           },
//           {
//             id: 'VJPNKTO24',
//             name: '二、三年坂步道～又稱二寧坂',
//           },
//           {
//             id: 'VJPNKTO42',
//             name: '京都必訪旅遊人氣景點～新京極～享有京都廚房之美譽～錦市場',
//           },
//         ],
//       },
//       {
//         day: '2',
//         date: '12 15 2025',
//         title: '黑門市場－自由夜訪道頓崛、心齋橋、御堂筋大道或梅田地下街',
//         route: [
//           '糺之森',
//           '下鴨神社',
//           '大阪城公園',
//           '免稅店',
//           '黑門市場',
//           '自由夜訪道頓崛、心齋橋、御堂筋大道或梅田地下街',
//         ],
//         hotel: {
//           status: '1',
//           data: [
//             {
//               name: 'Shinsaibashi Grand Hotel - Osaka心齋橋格蘭多飯店',
//               url: 'https://grand-hotel.co.jp/shinsaibashi/',
//             },
//             {
//               name: '大阪新今宮知鄉標準酒店',
//               url: 'https://www.solarehotels.com/hotel/osaka/cs-os/',
//             },
//             {
//               name: '大阪逸之彩飯店(附設大浴場)',
//               url: 'http://hinode-h.com/tc/',
//             },
//           ],
//         },
//         food: [
//           '飯店內享用',
//           '和風涮涮鍋吃到飽★黑毛和牛、豚、雞吃到飽+軟性飲料暢飲￥3000',
//           '方便逛街，敬請自理',
//         ],
//         abstract_1:
//           '京都唯一原生林~漫步糺之森－世界文化遺產:下鴨神社－日本三大名城～大阪城公園(不上天守閣)～大阪城公園－免稅店－大阪人廚房~黑門市場－自由夜訪道頓崛、心齋橋、御堂筋大道或梅田地下街',
//         abstract_2: [
//           {
//             id: 'VJPNKTO96',
//             name: '糺之森【京都唯一原生林】',
//           },
//           {
//             id: 'AJPNKTO04',
//             name: '世界文化遺產～下鴨神社',
//           },
//           {
//             id: 'VJPNOSA06',
//             name: '大阪城公園(不上天守閣)',
//           },
//           {
//             id: 'VJPNOSA19',
//             name: '免稅店',
//           },
//           {
//             id: 'AJPNOSA42',
//             name: '黑門市場',
//           },
//           {
//             id: 'VJPNOSA08',
//             name: '自由夜訪道頓崛、心齋橋、御堂筋大道或梅田地下街',
//           },
//         ],
//       },
//       {
//         day: '3',
//         date: '12 16 2025',
//         title: '無限感動與興奮，讓您歡樂無限!',
//         route: ['日本環球影城'],
//         hotel: {
//           status: '1',
//           data: [
//             {
//               name: 'Shinsaibashi Grand Hotel - Osaka心齋橋格蘭多飯店',
//               url: 'https://grand-hotel.co.jp/shinsaibashi/',
//             },
//             {
//               name: 'WBF難波元町飯店',
//               url: 'https://www.hotelwbf.com/namba-motomachi/',
//             },
//             {
//               name: '2023新開幕★大阪心齋橋捷絲旅',
//               url: 'https://www.justsleephotels.com/osakaShinsaibashi/tw',
//             },
//           ],
//         },
//         food: ['飯店內享用', '方便遊玩，敬請自理', '方便遊玩，敬請自理'],
//         abstract_1: '全日暢遊～日本環球影城～無限感動與興奮，讓您歡樂無限!',
//         abstract_2: [
//           {
//             id: 'VJPNOSA11',
//             name: '日本環球影城(電車前往)',
//           },
//         ],
//       },
//       {
//         day: '4',
//         date: '12 17 2025',
//         title: '全日自由活動，自由自費前往百貨公司商店街．逛街購物',
//         route: ['全日自由活動，自由自費前往百貨公司商店街．逛街購物'],
//         hotel: {
//           status: '1',
//           data: [
//             {
//               name: 'Shinsaibashi Grand Hotel - Osaka心齋橋格蘭多飯店',
//               url: 'https://grand-hotel.co.jp/shinsaibashi/',
//             },
//             {
//               name: 'WBF難波元町飯店',
//               url: 'https://www.hotelwbf.com/namba-motomachi/',
//             },
//             {
//               name: '2023新開幕★大阪心齋橋捷絲旅',
//               url: 'https://www.justsleephotels.com/osakaShinsaibashi/tw',
//             },
//           ],
//         },
//         food: ['飯店內享用', '方便逛街敬請自理', '方便逛街敬請自理'],
//         abstract_1: '全日自由活動，自由自費前往百貨公司商店街．逛街購物',
//         abstract_2: [
//           {
//             id: 'VJPNOSA04',
//             name: '全日自由活動，自由自費前往百貨公司商店街．逛街購物',
//           },
//         ],
//       },
//       {
//         day: '5',
//         date: '12 18 2025',
//         title: '台北',
//         route: [
//           '如時間許可，自由自費前往百貨公司商店街．逛街購物',
//           '關西空港．機場商店街／桃園國際機場',
//         ],
//         hotel: {
//           status: '1',
//           data: [
//             {
//               name: '溫暖的家',
//               url: '',
//             },
//           ],
//         },
//         food: ['飯店內享用', 'XXX', '溫暖的家'],
//         abstract_1:
//           '如時間許可，自由自費前往百貨公司商店街．逛街購物－關西海上空港．機場商店街－台北',
//         abstract_2: [
//           {
//             id: 'VJPNOSA18',
//             name: '如時間許可，自由自費前往百貨公司商店街．逛街購物',
//           },
//           {
//             id: 'VJPNOSA17',
//             name: '✈關西空港．機場商店街／桃園國際機場',
//           },
//         ],
//       },
//     ],
//     tags: [],
//   },
//   {
//     name: '【特選捷克波蘭１０日】維利奇卡鹽礦、布拉格城堡區、遊船、華沙、克拉克夫、OUTLET',
//     id: '26605',
//     img: 'https://hsihung.ittms.com.tw/intranet/travel_list/images/26605.jpg',
//     city: '歐洲 捷克',
//     slogan: '東歐',
//     day: '10',
//     price: 64800,
//     travel: [
//       {
//         date: '01/13',
//         travel_no: 'CZV10CA260113W',
//         price: 64800,
//       },
//       {
//         date: '01/27',
//         travel_no: 'CZV10CA260127W',
//         price: 64800,
//       },
//       {
//         date: '02/24',
//         travel_no: 'CZV10CA260224W',
//         price: 64800,
//       },
//       {
//         date: '03/17',
//         travel_no: 'CZV10CA260317W',
//         price: 64800,
//       },
//       {
//         date: '03/24',
//         travel_no: 'CZV10CA260324W',
//         price: 64800,
//       },
//     ],
//     schedule: [
//       {
//         day: '1',
//         date: '01 13 2026',
//         title: '桃園／北京',
//         route: [],
//         hotel: {
//           status: '1',
//           data: [
//             {
//               name: '機上',
//               url: 'http://www.taiwan.net.tw/',
//             },
//           ],
//         },
//         food: ['XX', 'XX', 'XX'],
//         abstract_1: '桃園／北京',
//         abstract_2: [],
//       },
//       {
//         day: '2',
//         date: '01 14 2026',
//         title: '克拉科夫Krakow',
//         route: ['華沙舊城區 Warsaw Old Town'],
//         hotel: {
//           status: '1',
//           data: [
//             {
//               name: 'NOVOTEL KRAKOW CITY WEST',
//               url: 'https://www.accorhotels.com/gb/hotel-3407-novotel-krakow-city-west/index.shtml',
//             },
//             {
//               name: 'GARDEN SQUARE HOTEL KRAKÓW',
//               url: 'http://gardensquarehotel.pl/',
//             },
//           ],
//         },
//         food: ['機上', '中式六菜一湯', '西式三道式'],
//         abstract_1:
//           '北京／華沙Warsaw【波蘭科學院、哥白尼雕像、華沙大學、城堡廣場、聖約翰教堂、舊城廣場】－299KM－克拉科夫Krakow',
//         abstract_2: [
//           {
//             id: 'VPOLWAW07',
//             name: '華沙舊城區 Warsaw Old Town',
//           },
//         ],
//       },
//       {
//         day: '3',
//         date: '01 15 2026',
//         title: '布爾諾',
//         route: ['克拉克夫 Krakow'],
//         hotel: {
//           status: '1',
//           data: [
//             {
//               name: 'OREA CONGRESS HOTEL BRNO',
//               url: 'https://www.orea.cz/hotel-congress-brno',
//             },
//             {
//               name: 'COURTYARD BY MARRIOTT BRNO',
//               url: 'https://www.marriott.com/hotels/travel/brqcy-courtyard-brno/?scid=bb1a189a-fec3-4d19-a255-54ba596febe2',
//             },
//             {
//               name: 'HOTEL VISTA',
//               url: 'https://www.vista-hotel.cz/',
//             },
//           ],
//         },
//         food: ['飯店內享用', '西式三道式', '捷克風味餐'],
//         abstract_1:
//           '克拉克夫【克拉克夫舊城區、市政廳鐘樓、紡織會堂、中央市集廣場、聖瑪莉大教堂教堂、瓦維爾城堡】－331MK－布爾諾',
//         abstract_2: [
//           {
//             id: 'VPOLKRA14',
//             name: '克拉克夫 Krakow',
//           },
//         ],
//       },
//       {
//         day: '4',
//         date: '01 16 2026',
//         title: '布拉格Prague',
//         route: ['布爾諾Brno', '庫納霍拉+聖芭芭拉教堂'],
//         hotel: {
//           status: '1',
//           data: [
//             {
//               name: 'HOTEL NH PRAGUE CITY',
//               url: 'http://www.nh-hotels.com/hotel/nh-prague-city',
//             },
//             {
//               name: 'HOLIDAY INN PRAGUE',
//               url: 'https://www.ihg.com/holidayinn/hotels/us/en/prague/prgnp/hoteldetail?cm_mmc=GoogleMaps-_-HI-_-CZ-_-PRGNP',
//             },
//             {
//               name: 'HOTEL ROYAL PRAGUE',
//               url: 'http://www.hotelroyalprague.com/',
//             },
//           ],
//         },
//         food: ['飯店內享用', '中式六菜一湯', '捷克烤鴨餐'],
//         abstract_1:
//           '布爾諾【舊城區、噴泉、舊市政廳、馬散里哥瓦大街、自由廣場】－154KM－庫特納霍拉Kutna Hora【聖巴巴拉教堂】－84KM－布拉格Prague',
//         abstract_2: [
//           {
//             id: 'VCZKBRO03',
//             name: '布爾諾Brno',
//           },
//           {
//             id: 'VCZKKUT01',
//             name: '庫納霍拉+聖芭芭拉教堂',
//           },
//         ],
//       },
//       {
//         day: '5',
//         date: '01 17 2026',
//         title: '伏爾塔瓦河遊船',
//         route: [
//           '布拉格舊城Prague Old Town Square',
//           '布拉格天文鐘Prague astronomical clock',
//           '查理大橋Charles Bridge',
//         ],
//         hotel: {
//           status: '1',
//           data: [
//             {
//               name: 'HOTEL NH PRAGUE CITY',
//               url: 'http://www.nh-hotels.com/hotel/nh-prague-city',
//             },
//             {
//               name: 'HOLIDAY INN PRAGUE',
//               url: 'https://www.ihg.com/holidayinn/hotels/us/en/prague/prgnp/hoteldetail?cm_mmc=GoogleMaps-_-HI-_-CZ-_-PRGNP',
//             },
//             {
//               name: 'HOTEL ROYAL PRAGUE',
//               url: 'http://www.hotelroyalprague.com/',
//             },
//           ],
//         },
//         food: ['飯店內享用', '伏爾塔瓦河遊船自助百匯', '敬請自理'],
//         abstract_1:
//           '布拉格舊城區【查理大橋、天文鐘、火藥塔、猶太區】－伏爾塔瓦河遊船',
//         abstract_2: [
//           {
//             id: 'VEURPRG03',
//             name: '布拉格舊城Prague Old Town Square(UNESCO世界文化遺產)',
//           },
//           {
//             id: 'VEURPRG14',
//             name: '布拉格天文鐘Prague astronomical clock',
//           },
//           {
//             id: 'VEURPRG16',
//             name: '查理大橋Charles Bridge',
//           },
//         ],
//       },
//       {
//         day: '6',
//         date: '01 18 2026',
//         title: 'Fashion Arena Prague Outlet',
//         route: [
//           '布拉格城堡Prague Castle',
//           '布拉格舊皇宮 Old Royal Palace',
//           '聖維特大教堂 St. Vitus Cathedral',
//           '黃金小巷',
//           'FASHION ARENA PRAGUE OUTLET',
//         ],
//         hotel: {
//           status: '1',
//           data: [
//             {
//               name: 'HOTEL NH PRAGUE CITY',
//               url: 'http://www.nh-hotels.com/hotel/nh-prague-city',
//             },
//             {
//               name: 'HOLIDAY INN PRAGUE',
//               url: 'https://www.ihg.com/holidayinn/hotels/us/en/prague/prgnp/hoteldetail?cm_mmc=GoogleMaps-_-HI-_-CZ-_-PRGNP',
//             },
//             {
//               name: 'HOTEL ROYAL PRAGUE',
//               url: 'http://www.hotelroyalprague.com/',
//             },
//           ],
//         },
//         food: ['飯店內享用', '中式六菜一湯', '敬請自理'],
//         abstract_1:
//           '布拉格城堡區【黃金巷、布拉格城堡、城堡廣場、聖維特大教堂】－ Fashion Arena Prague Outlet',
//         abstract_2: [
//           {
//             id: 'VEURPRG15',
//             name: '布拉格城堡Prague Castle(UNESCO世界文化遺產)',
//           },
//           {
//             id: 'VCZKPRG12',
//             name: '布拉格舊皇宮 Old Royal Palace',
//           },
//           {
//             id: 'VCZKPRG11',
//             name: '聖維特大教堂 St. Vitus Cathedral',
//           },
//           {
//             id: 'VCZKPRG13',
//             name: '黃金小巷',
//           },
//           {
//             id: 'VCZKPRG07',
//             name: 'FASHION ARENA PRAGUE OUTLET',
//           },
//         ],
//       },
//       {
//         day: '7',
//         date: '01 19 2026',
//         title: '卡托維兹Katowice',
//         route: ['歐洛慕奇 Olomouc'],
//         hotel: {
//           status: '1',
//           data: [
//             {
//               name: 'NOVOTEL KATOWICE CENTRUM',
//               url: 'https://all.accor.com/lien_externe.svlt?goto=fiche_hotel&code_hotel=3377&merchantid=seo-maps-PL-3377&sourceid=aw-cen&utm',
//             },
//           ],
//         },
//         food: ['飯店內享用', '中式六菜一湯', '西式三道式'],
//         abstract_1:
//           '布拉格－236KM－歐洛慕奇Olomouc【霍爾尼廣場、聖三一紀念柱、Triton噴泉、凱薩噴泉、海力克噴泉】－181KM－卡托維兹Katowice',
//         abstract_2: [
//           {
//             id: 'VCZKOLO02',
//             name: '歐洛慕奇 Olomouc',
//           },
//         ],
//       },
//       {
//         day: '8',
//         date: '01 20 2026',
//         title: '華沙',
//         route: ['維利奇卡鹽礦WIELICZKA'],
//         hotel: {
//           status: '1',
//           data: [
//             {
//               name: 'HOTEL MERCURE WARSZAWA CENTRUM',
//               url: '',
//             },
//             {
//               name: 'POLONIA PALACE HOTEL',
//               url: 'http://www.poloniapalace.com/',
//             },
//             {
//               name: 'NOVOTEL WARSZAWA CENTRUM',
//               url: 'https://www.accorhotels.com/zh/hotel-3383-%E5%8D%8E%E6%B2%99%E4%B8%AD%E5%BF%83%E8%AF%BA%E5%AF%8C%E7%89%B9%E9%85%92%E5%BA',
//             },
//           ],
//         },
//         food: ['飯店內享用', '中式六菜一湯', '西式三道式'],
//         abstract_1: '卡托維茲－92KM－維利奇卡鹽礦－331KM－華沙',
//         abstract_2: [
//           {
//             id: 'VPOLKRA02',
//             name: '維利奇卡鹽礦WIELICZKA',
//           },
//         ],
//       },
//       {
//         day: '9',
//         date: '01 21 2026',
//         title: '華沙機場／北京',
//         route: ['金色梯田 Złote Tarasy'],
//         hotel: {
//           status: '1',
//           data: [
//             {
//               name: '機上',
//               url: 'http://www.taiwan.net.tw/',
//             },
//           ],
//         },
//         food: ['飯店內享用', 'XX', '機上'],
//         abstract_1: '華沙【金色梯田】－華沙機場／北京',
//         abstract_2: [
//           {
//             id: 'VPOLWAR10',
//             name: '金色梯田 Złote Tarasy',
//           },
//         ],
//       },
//       {
//         day: '10',
//         date: '01 22 2026',
//         title: '北京／桃園',
//         route: [],
//         hotel: {
//           status: '1',
//           data: [
//             {
//               name: '溫暖的家',
//               url: '',
//             },
//           ],
//         },
//         food: ['機上', 'XX', 'XX'],
//         abstract_1: '北京／桃園',
//         abstract_2: [],
//       },
//     ],
//     tags: [],
//   },
// ];

let fullScheduleData: QueryListNew;

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get('/bigquery')
  @ApiOperation({ summary: '查詢 BigQuery 資料' })
  get() {
    return '開發中...';
  }

  @Post('/addSchedule')
  @ApiOperation({ summary: '✅ QueryList 嵌入 Schedule' })
  async addScheduleToQueryList(
    @Body() data: QueryListNew,
  ): Promise<QuerylistDto[]> {
    // data = testData; // 測試的時候先用這個資料
    fullScheduleData = await this.scheduleService.addScheduleToQueryList(data);
    return fullScheduleData.data;
  }

  @Post('splitData')
  @ApiOperation({
    summary: '✅ QueryList（with Schedule）分割成 View、Hotel、Food、Schedule',
  })
  splitData() {
    return this.scheduleService.splitData(fullScheduleData.data);
  }

  @Post('/bigquery')
  @ApiOperation({ summary: '✅ 上傳資料到 BigQuery' })
  @ApiBody({
    description: `請貼上旅遊資料 JSON：`,
    examples: {
      example1: {
        summary: '測試用行程資料',
        description: '四國相撲５日遊完整資料範例',
        value: {
          data: [
            {
              name: '測試用行程-五天四夜-日本松山-2025-12-10',
              id: '5534',
              img: 'https://hsihung.ittms.com.tw/intranet/travel_list/images/5534.jpg',
              city: '日本 松山',
              slogan: '',
              day: '5',
              price: 45900,
              travel: [
                {
                  date: '12/10',
                  travel_no: 'TAK05CI251210A',
                  price: 45900,
                },
              ],
              schedule: [
                {
                  day: '1',
                  date: '12 10 2025',
                  title: '四國香川縣溫泉',
                  route: ['桃園國際機場高松空港'],
                  hotel: {
                    status: '1',
                    data: [
                      {
                        name: '雷歐瑪REOMA森之湯溫泉SPA飯店',
                        url: 'http://www.ooedoonsen.jp/reomanomori/',
                      },
                      {
                        name: '新樺川觀光飯店',
                        url: 'http://www.shinkabakawa.com/',
                      },
                      {
                        name: '高松麗嘉飯店ZEST',
                        url: 'http://www.rihga-takamatsu.co.jp/',
                      },
                    ],
                  },
                  food: ['溫暖的家', '機上套餐', '飯店內迎賓會席料理'],
                  abstract_1: '台北／高松空港－夜宿～四國香川縣溫泉',
                  abstract_2: [{ id: 'VJPNKGW11', name: '高松空港' }],
                },
              ],
              tags: [],
            },
          ],
        },
      },
    },
  })
  async merge(@Body() body: { data: QuerylistDto[] }) {
    console.log('Received data for BigQuery merge:', body);
    if (!body?.data || body.data.length === 0) {
      console.log('⚠️ 沒有傳入飯店資料，使用測試資料');
      return this.scheduleService.merge([]); // 手動測試時使用假資料
    }

    console.log('✅ 使用真實資料上傳到 BigQuery');
    return this.scheduleService.merge(body.data);
  }
}
