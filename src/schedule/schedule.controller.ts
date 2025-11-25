import { Controller, Get, Post, Body, Delete } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
// import { ScheduleDto } from 'src/common/dto/schedule.dto';
import { ApiOperation } from '@nestjs/swagger';
import { QuerylistDto } from 'src/common/dto/querylist.dto';

const testData = [
  {
    name: '【特別企劃‧四國相撲５日】雷歐瑪森之湯、小豆島觀景纜車、大步危遊船、道後溫泉散策',
    id: '5534',
    price: '45900',
    img: 'https://hsihung.ittms.com.tw/intranet/travel_list/images/5534.jpg',
    city: '日本 松山',
    slogan: '',
    day: '5',
    travel: [{ date: '12/10', travel_no: 'TAK05CI251210A', price: '45900' }],
  },
  {
    name: '【特惠輕旅大阪５日】日本環球影城、京都清水寺、大阪城公園、下鴨神社、錦市場、黑毛和牛',
    id: '27449',
    price: '21800',
    img: 'https://hsihung.ittms.com.tw/intranet/travel_list/images/27449.jpg',
    city: '日本 京都',
    slogan: '',
    day: '5',
    travel: [
      { date: '12/14', travel_no: 'OSA05VZ251214Z', price: '21800' },
      { date: '01/03', travel_no: 'OSA05VZ260103Z', price: '25800' },
      { date: '01/06', travel_no: 'OSA05VZ260106Z', price: '26800' },
      { date: '01/10', travel_no: 'OSA05VZ260110Z', price: '27800' },
      { date: '01/13', travel_no: 'OSA05VZ260113Z', price: '26800' },
      { date: '01/17', travel_no: 'OSA05VZ260117Z', price: '27800' },
    ],
  },
  {
    name: '【特選捷克波蘭１０日】維利奇卡鹽礦、布拉格城堡區、遊船、華沙、克拉克夫、OUTLET',
    id: '26605',
    price: '64800',
    img: 'https://hsihung.ittms.com.tw/intranet/travel_list/images/26605.jpg',
    city: '歐洲 捷克',
    slogan: '東歐',
    day: '10',
    travel: [
      { date: '01/13', travel_no: 'CZV10CA260113W', price: '64800' },
      { date: '01/27', travel_no: 'CZV10CA260127W', price: '64800' },
      { date: '02/24', travel_no: 'CZV10CA260224W', price: '64800' },
      { date: '03/17', travel_no: 'CZV10CA260317W', price: '64800' },
      { date: '03/24', travel_no: 'CZV10CA260324W', price: '64800' },
    ],
  },
];

const insertData: QuerylistDto[] = [
  {
    name: '【特別企劃‧四國相撲５日】雷歐瑪森之湯、小豆島觀景纜車、大步危遊船、道後溫泉散策',
    id: '5534',
    price: '45900',
    img: 'https://hsihung.ittms.com.tw/intranet/travel_list/images/5534.jpg',
    city: '日本 松山',
    slogan: '',
    day: '5',
    travel: [
      {
        date: '12/10',
        travel_no: 'TAK05CI251210A',
        price: '45900',
      },
    ],
    schedule: [
      {
        free: '1',
        day: '1',
        date: '12 10 2025',
        memo_1: '',
        memo_2: '',
        memo_3:
          '▲飛機搭乘時間：約兩小時三十分。<br><br>▲時差：日本與台灣的時差為+1小時(GMT+9)。台灣時間中午12點，為日本時間下午1點。日本無夏令時間',
        breakfast: '溫暖的家',
        lunch: '機上套餐',
        dinner: '飯店內迎賓會席料理或飯店自助餐',
        abstract_1: '台北／高松空港－夜宿～四國香川縣溫泉',
        abstract_2: [
          {
            id: 'VJPNKGW11',
            name: '桃園國際機場✈高松空港',
          },
        ],
        view: [
          {
            id: 'VJPNKGW11',
            name: '桃園國際機場✈高松空港',
            images:
              'https://hsihung.ittms.com.tw/intranet/view/images/VJPNKGW11.jpg',
            memo_1: '',
            memo_2:
              '今天集合於桃園中正機場的團體櫃台，由專人辦理登機手續後，搭乘豪華客機飛往日本四國－〔香川縣〕高松空港。',
            memo_3: '',
          },
        ],
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
      },
      {
        free: '1',
        day: '2',
        date: '12 11 2025',
        memo_1: '',
        memo_2: '▲大步危遊船時間：約30分鐘。',
        memo_3: '',
        breakfast: '飯店內享用',
        lunch: '大步危川魚鄉村料理￥2200',
        dinner: '飯店內迎賓會席料理或飯店自助餐',
        abstract_1:
          '大步危‧小步危～仙境溪谷遊船趣－秘境祖谷溪‧葛藤橋(日本三大奇橋之一)－愛媛必買伴手禮～今治毛巾總店－道後溫泉街散策～神隱少女油屋、少爺音樂鐘－愛媛縣',
        abstract_2: [
          {
            id: 'VJPNTKS01',
            name: '仙境奇峽－大步危．小步危 / 遊船趣',
          },
          {
            id: 'VJPNTKS02',
            name: '日本三大奇橋－祖谷溪．葛藤橋',
          },
          {
            id: 'VJPNEHI37',
            name: '今治毛巾總店',
          },
          {
            id: 'VJPNEHI04',
            name: '神隱少女湯婆婆的湯屋、少爺機關鬧鐘',
          },
          {
            id: 'VJPNEHI05',
            name: '日本最古老名湯－道後溫泉♨',
          },
        ],
        view: [
          {
            id: 'VJPNTKS01',
            name: '仙境奇峽－大步危．小步危 / 遊船趣',
            images:
              'https://hsihung.ittms.com.tw/intranet/view/images/VJPNTKS01.jpg',
            memo_1: '',
            memo_2:
              '大步危，小步危的意思是指山腹間危險地帶，搭乘大步危遊覽船由大步峽出發順流而下，遊覽船之上可以欣賞大步危的奇山怪石，還可以鑒賞日本國的天然紀念物「含礫片岩」，可見識到蝙蝠岩，獅子岩等特殊奇景，沿途溪谷岩壁交錯。大步危一年四季風景各異，春天可以觀賞「扁枝越桔」，夏天花草繁多，秋天賞紅葉，冬天大雪紛飛。',
            memo_3:
              '如遇遊船停駛或其他不可抗力因素無法搭乘時，現場退費JPY1000，造成不便敬請見諒!',
          },
          {
            id: 'VJPNTKS02',
            name: '日本三大奇橋－祖谷溪．葛藤橋',
            images:
              'https://hsihung.ittms.com.tw/intranet/view/images/VJPNTKS02.jpg',
            memo_1: '',
            memo_2:
              '據說是平安時代末期戰敗的平家為了躲避源家的追擊，帶著安德天皇一路逃到此地避難，到了祖谷溪谷的時候為了渡河需要蓋橋，但因為怕追兵也隨著蓋好的橋過河，於是選擇了用藤蔓及木枝，當危急的時候可以馬上斷橋求生。葛藤橋與山口縣的錦帶橋、山梨縣猿橋並稱日本三大奇橋。',
            memo_3:
              '祖谷葛藤橋如遇吊橋整修(進行三年一次的葛藤橋維護作業)或其他不可抗力因素無法行走時，現場退費￥500，造成不便敬請見諒!',
          },
          {
            id: 'VJPNEHI37',
            name: '今治毛巾總店',
            images:
              'https://www.hsihung.com.tw/intranet/view/images/VJPNEHI37.jpg',
            memo_1: '',
            memo_2:
              '結合「今治毛巾工廠」的概念，今治毛巾總店經過改裝後，於2017年重新開幕。在附設的體驗設施「今治毛巾LAB」裡，能透過有趣的體驗進一步了解今治毛巾，像是藉由「5秒必沉原則」實驗見識今治毛巾卓越的吸水性，或是實際踩踏經過復原的舊式毛巾專用織布機。旅客可在專業人員的協助下挑選喜好的毛巾。店內亦附設有可歇息的咖啡廳，提供悠閒舒適的空間，讓所有顧客都能滿足而歸。',
            memo_3: '',
          },
          {
            id: 'VJPNEHI04',
            name: '神隱少女湯婆婆的湯屋、少爺機關鬧鐘',
            images:
              'https://hsihung.ittms.com.tw/intranet/view/images/VJPNEHI04.jpg',
            memo_1: '',
            memo_2:
              '說到松山就一定要參觀道後溫泉本館，除了是日本名湯外，更是宮崎駿動晝片「神隱少女」油湯場景，歡迎大家來尋找湯婆婆與千尋的蹤跡，而在溫泉街旁的「少爺音樂鐘」從早上八點到晚上十點每到整點，播放輕快的旋律，隨著音樂的響起，夏目漱石在其著作《少爺》裏的人物如少爺、瑪丹那、紅衫等20個機關人偶會依序出現，配合悅耳旋律精采演出，是遊客最喜愛拍照留念的地點。',
            memo_3: '※外觀拍照不入內。',
          },
          {
            id: 'VJPNEHI05',
            name: '日本最古老名湯－道後溫泉♨',
            images:
              'https://hsihung.ittms.com.tw/intranet/view/images/VJPNEHI05.jpg',
            memo_1: '',
            memo_2:
              '宮崎駿卡通《神隱少女》裡的溫泉旅館原型，就是四國愛媛縣的道後溫泉，道後溫泉擁有三千年的歷史，與兵庫縣有馬溫泉、和歌山縣白溫泉並列為「日本三古名湯」。獲得米其林指定三顆星，為日本國家指定文化遺產。道後溫泉泉質分類屬於單純溫泉，有助於改善神經痛、風濕、胃腸病、皮膚病、痛風、貧血。',
            memo_3: '外觀拍照不入內。',
          },
        ],
        hotel: {
          status: '1',
          data: [
            {
              name: '今治溫泉 汐之丸',
              url: 'http://www.hotel-ajour.jp/',
            },
            {
              name: '奧道後 壹湯之守',
              url: 'https://www.okudogo.co.jp/',
            },
            {
              name: '大江戶溫泉物語 道後',
              url: 'http://dogo-saichoraku.jp/',
            },
            {
              name: '道後溫泉　茶玻',
              url: 'http://www.chaharu.com/',
            },
            {
              name: '道後王子飯店',
              url: 'http://www.dogoprince.co.jp/',
            },
          ],
        },
      },
      {
        free: '1',
        day: '3',
        date: '12 12 2025',
        memo_1: '',
        memo_2: '▲小豆島渡輪搭乘時間：約60分鐘。',
        memo_3: '',
        breakfast: '飯店內享用',
        lunch: '日式定食￥2200',
        dinner: '飯店內迎賓會席料理或飯店自助餐',
        abstract_1:
          '日本三大平山城堡～松山城公園～(搭乘空中纜車、不上天守閣）－港口搭渡輪（瀨戶內海、島影相映美景）－小豆島觀光：小豆島醬油之鄉～京寶亭－橄欖公園～白色風車－寒霞溪～日本三大絕美溪谷之一(搭乘單程觀景纜車)～郵輪港口搭船－夜宿小豆島溫泉飯店',
        abstract_2: [
          {
            id: 'VJPNEHI03',
            name: '松山城公園(含空中纜車、不上天守閣)',
          },
          {
            id: 'VJPNKGW09',
            name: '小豆島遊船觀光',
          },
          {
            id: 'VJPNKGW49',
            name: '小豆島醬之鄉～京寶亭',
          },
          {
            id: 'VJPNKGW03',
            name: '亞洲愛情海－小豆島橄欖公園',
          },
          {
            id: 'VJPNKOH15',
            name: '寒霞溪～日本三大絕美溪谷之一(搭乘單程觀景纜車)',
          },
        ],
        view: [
          {
            id: 'VJPNEHI03',
            name: '松山城公園(含空中纜車、不上天守閣)',
            images:
              'https://hsihung.ittms.com.tw/intranet/view/images/VJPNEHI03.jpg',
            memo_1:
              '遊覽時間約60分鐘(因需考量當地氣候、交通狀況等因素，實際遊覽時間會以當地導遊安排為準。)',
            memo_2:
              '巨石矗立、莊嚴雄偉、規模之大，為大天守閣與小天守閣連立式的日本三大平山城之一，建築巍峨，讓人遙想此地的光榮時代，處處瀰漫著古代侯國的風範。<br/>【松山城公園】建於1627年，與姬路城、和歌山城共列為日本三大連立式平山城。特徵是除了大天守閤外還有數個小天守閤相連，看起來更為壯觀。天守閤的最上層是觀景眺望的最佳場所，伊予平野、石鎚山、瀨戶內海等美景盡入眼簾。',
            memo_3: '',
          },
          {
            id: 'VJPNKGW09',
            name: '小豆島遊船觀光',
            images: '//hsihung.ittms.com.tw/intranet/view/images/VJPNKGW09.jpg',
            memo_1: '',
            memo_2:
              '在港口搭乘渡輪前往小豆島，沿途可欣賞瀨戶內海與海上島嶼的自然美景，11月時島嶼會被紅葉染成紅色，與藍天碧海相呼應，感受秋季特有的海上風光。',
            memo_3: '',
          },
          {
            id: 'VJPNKGW49',
            name: '小豆島醬之鄉～京寶亭',
            images:
              'https://www.hsihung.com.tw/intranet/view/images/VJPNKGW49.jpg',
            memo_1: '',
            memo_2:
              '在氣候宜人的瀨戶內海滋潤下,小豆島以豐富的物產為人所知,其中有著超過四百年歷史的小豆島手工醬油,更是日本四大醬油產地其中之一,創業於1985年的京寶亭,以提供風味醇厚的醬油著名,除了可以到此了解醬油工藝的製作外,還可選購各式醬油相關商品。',
            memo_3: '如遇京寶亭公休，則改為小豆島佃煮之鄉一德庵，敬請見諒！',
          },
          {
            id: 'VJPNKGW03',
            name: '亞洲愛情海－小豆島橄欖公園',
            images:
              'https://hsihung.ittms.com.tw/intranet/view/images/VJPNKGW03.jpg',
            memo_1: '',
            memo_2:
              '小豆島有「瀨戶內海的珍珠」的美稱，1908年從美國引進橄欖樹在小豆島上種植，是全日本最早種植橄欖樹的地方，橄欖樹性喜溫暖乾燥的氣候，而小豆島剛好符合這樣的自然條件，歷經百年栽培小豆島就成為真正的橄欖之島。橄欖公園內可以讓遊客體驗橄欖種植歷史、品嘗橄欖油美食，還有「魔女宅急便」真人電影版的攝影地點。',
            memo_3: '',
          },
          {
            id: 'VJPNKOH15',
            name: '寒霞溪～日本三大絕美溪谷之一(搭乘單程觀景纜車)',
            images: '//hsihung.ittms.com.tw/intranet/view/images/VJPNKOH15.jpg',
            memo_1: '',
            memo_2:
              '日本三大溪谷之一的寒霞溪，此地50多種植物，藍色的天空，讓您體驗日本之美，另外特別安排搭乘纜車，讓你在中漫步於自然美景中。寒霞溪由於自然景緻秀麗絕美，被列為日本三大美麗溪谷之一，島中部的寒霞溪是著名勝地，與九州耶馬溪、關東妙義山並列為日本三大賞景溪谷，搭乘纜車再走登山步道即到達山頂，天氣晴朗時，腳下瀨戶內海景觀一覽無遺。',
            memo_3:
              '如遇纜車停駛，現場退費JPY800，改搭乘巴士上山，造成不便敬請見諒。',
          },
        ],
        hotel: {
          status: '1',
          data: [
            {
              name: '小豆島OLIVEAN',
              url: 'http://olivean.com/',
            },
          ],
        },
      },
      {
        free: '1',
        day: '4',
        date: '12 13 2025',
        memo_1: '',
        memo_2: '▲小豆島渡輪搭乘時間：約60分鐘。',
        memo_3: '',
        breakfast: '飯店內享用',
        lunch: '日式御膳風味￥2500',
        dinner: '飯店內迎賓會席料理或飯店自助餐',
        abstract_1:
          '天使的散步道（天使之路）－港口搭渡輪（瀨戶內海、島影相映美景）－《日本相撲聖域：體驗日本國民體育的力量～相撲比賽》',
        abstract_2: [
          {
            id: 'VJPNKGW67',
            name: '戀人聖地～小豆島天使之路',
          },
          {
            id: 'VJPNKGW42',
            name: '相撲巡迴表演大賽',
          },
        ],
        view: [
          {
            id: 'VJPNKGW67',
            name: '戀人聖地～小豆島天使之路',
            images:
              'https://www.hsihung.com.tw/intranet/view/images/VJPNKGW67.jpg',
            memo_1: '',
            memo_2:
              '小豆島天使之路是備受情侶歡迎的景點。與心愛之人攜手走過小豆島的天使之路，可以一生相伴，天長地久。延綿500米的沙洲，只有在一天兩次的退潮期間才會出現。沙洲出現後，形成了一條連接各個小島的黃金通道。據說手牽手走過天使之路登上與島的戀人，都會擁有美滿甜蜜的愛情。',
            memo_3:
              '※小豆島天使之路因潮汐問題故無法保證觀看,造成不便敬請見諒。',
          },
          {
            id: 'VJPNKGW42',
            name: '相撲巡迴表演大賽',
            images:
              'https://hsihung.ittms.com.tw/intranet/view/images/VJPNKGW42.jpg',
            memo_1: '',
            memo_2:
              '2025年香川大相撲比賽開催決定！<br/><br/>一年一度令人期待的「香川大相撲比賽」將於2025年12月13日（星期六），隆重登場！<br/>這場比賽匯聚來自全國的頂尖力士，在傳統與熱情交織的土俵上激烈對決，展現日本國技的獨特魅力。現場不僅能感受到力士們的震撼氣勢，還有豐富的相撲周邊商品，適合全家大小一同參與。保證有票，不必再為搶票煩惱，快來親眼見證力士在土俵上的激烈對決吧！',
            memo_3:
              '※12/13(六)相撲大賽觀戰時間預訂表如下:<br>11:30表演賽、演奏、太鼓表演<br>13:00「十兩」、「幕內」選手入場儀式、「弓取式」表演<br>15:00表演結束<br>',
          },
        ],
        hotel: {
          status: '1',
          data: [
            {
              name: 'Dormy Inn高松中央公園前天然溫泉',
              url: 'https://dormy-hotels.com/dormyinn/hotels/takamatsuchuo/?utm_source=google&utm_medium=gbp&utm_campaign=gbpurl',
            },
            {
              name: 'SECOND STAGE櫻花莊溫泉飯店',
              url: 'http://hotel-secondstage.com/',
            },
            {
              name: 'Hyper Resort Villa鹽江',
              url: 'http://www.hyper-inn.net/asp/newscat.asp?nc_id=76',
            },
            {
              name: '高松JR CLEMENT(前:高松全日空)',
              url: 'http://www.jrclement.co.jp/',
            },
          ],
        },
      },
      {
        free: '1',
        day: '5',
        date: '12 14 2025',
        memo_1: '',
        memo_2: '',
        memo_3: '▲飛機搭乘時間：約兩小時三十分。',
        breakfast: '飯店內享用',
        lunch: '香川名物：讚岐烏龍麵風味定食￥2200',
        dinner: '機上套餐',
        abstract_1: '海之守護神～金刀比羅宮－免稅店－綾川AEON－高松空港／台北',
        abstract_2: [
          {
            id: 'VJPNKGW02',
            name: '海之守護神～金刀比羅宮',
          },
          {
            id: 'VJPNKGW40',
            name: '免稅店',
          },
          {
            id: 'VJPNKGW07',
            name: '香川AEON',
          },
          {
            id: 'VJPNKGW12',
            name: '高松空港✈台北',
          },
        ],
        view: [
          {
            id: 'VJPNKGW02',
            name: '海之守護神～金刀比羅宮',
            images:
              'https://hsihung.ittms.com.tw/intranet/view/images/VJPNKGW02.jpg',
            memo_1: '',
            memo_2:
              '因供奉著被稱為「金羅」的海上守護神而聞名，是健康、除災避禍、帶來好運的神明，因此自古以來一直香火興盛，位於象頭山山腰上的金刀比羅宮，參拜道路極長，到象頭山山腰的正宮為785級石階，站在正宮前可一覽贊岐平原，在寶物館內收藏著11面觀音等寶物，另外在學藝參考館，展出由信徒們捐獻和奉納的各種工藝美術品。',
            memo_3:
              '金刀比羅宮參拜道路極長，從表參道至襄神社共有1368階（往返約需數小時）依團體進行為主，此景點停留時間約１小時，故建議可依個人腳力來決定到達的地點(要預估回程時間)，若不想參拜的旅客建議也可於下方表參道二旁的商店街逛街、休息等侯。',
          },
          {
            id: 'VJPNKGW40',
            name: '免稅店',
            images:
              'https://hsihung.ittms.com.tw/intranet/view/images/VJPNKGW40.jpg',
            memo_1: '',
            memo_2: '在此有專人親切服務介紹商品，可慢慢挑選禮品饋贈親友。',
            memo_3: '',
          },
          {
            id: 'VJPNKGW07',
            name: '香川AEON',
            images:
              'https://hsihung.ittms.com.tw/intranet/view/images/VJPNKGW07.jpg',
            memo_1: '',
            memo_2:
              'AEON在日本各地擁有超過350家分店的大型超市。寬敞的店內有食品、服飾、彩妝、醫藥用品等各式各樣的商品，四季分明的日本特有的季節商品也應有盡有。今日視行程安排AEONMALL或AEON超市購物。',
            memo_3: '',
          },
          {
            id: 'VJPNKGW12',
            name: '高松空港✈台北',
            images:
              'https://hsihung.ittms.com.tw/intranet/view/images/VJPNKGW12.jpg',
            memo_1: '',
            memo_2:
              '之後前往機場搭機返國，本次旅程終告結束，在此感謝您的選擇參加，並且期待擱再相會，敬祝您旅途愉快，萬事如意，謝謝！',
            memo_3: '',
          },
        ],
        hotel: {
          status: '1',
          data: [
            {
              name: '溫暖的家',
              url: '',
            },
          ],
        },
      },
    ],
  },
  {
    name: '【特惠輕旅大阪５日】日本環球影城、京都清水寺、大阪城公園、下鴨神社、錦市場、黑毛和牛',
    id: '27449',
    price: '21800',
    img: 'https://hsihung.ittms.com.tw/intranet/travel_list/images/27449.jpg',
    city: '日本 京都',
    slogan: '',
    day: '5',
    travel: [
      {
        date: '12/14',
        travel_no: 'OSA05VZ251214Z',
        price: '21800',
      },
      {
        date: '01/03',
        travel_no: 'OSA05VZ260103Z',
        price: '25800',
      },
      {
        date: '01/06',
        travel_no: 'OSA05VZ260106Z',
        price: '26800',
      },
      {
        date: '01/10',
        travel_no: 'OSA05VZ260110Z',
        price: '27800',
      },
      {
        date: '01/13',
        travel_no: 'OSA05VZ260113Z',
        price: '26800',
      },
      {
        date: '01/17',
        travel_no: 'OSA05VZ260117Z',
        price: '27800',
      },
    ],
    schedule: [
      {
        free: '1',
        day: '1',
        date: '12 14 2025',
        memo_1: '',
        memo_2: '',
        memo_3:
          '※飛機搭乘時間:約兩小時四十分。<br>※日本時差：日本和台灣的時差為+1小時(GMT+8)。台灣時間中午12點的時候,日本時間為下午1點。日本無夏令時間',
        breakfast: 'XXX',
        lunch: '方便逛街～敬請自理★贈壽司餐盒+茶',
        dinner: '方便逛街～敬請自理',
        abstract_1:
          '台北／關西空港－世界文化遺產：清水寺～清水舞台～音羽之瀧～二、三年阪步道－京都必訪旅遊人氣景點～新京極～享有京都廚房之美譽～錦市場→住宿飯店',
        abstract_2: [
          {
            id: 'VJPNKIX01',
            name: '桃園國際機場✈關西空港',
          },
          {
            id: 'VJPNKTO23',
            name: '世界文化遺產：清水寺',
          },
          {
            id: 'VJPNKTO25',
            name: '日本十大名泉之首~音羽之瀧',
          },
          {
            id: 'VJPNKTO24',
            name: '二、三年坂步道～又稱二寧坂',
          },
          {
            id: 'VJPNKTO42',
            name: '京都必訪旅遊人氣景點～新京極～享有京都廚房之美譽～錦市場',
          },
        ],
        view: [
          {
            id: 'VJPNKIX01',
            name: '桃園國際機場✈關西空港',
            images:
              'https://hsihung.ittms.com.tw/intranet/view/images/VJPNKIX01.jpg',
            memo_1: '',
            memo_2:
              '今天集合於桃園中正機場的團體櫃台，搭乘豪華客機飛往日本大城－〔大阪〕關西空港。',
            memo_3: '',
          },
          {
            id: 'VJPNKTO23',
            name: '世界文化遺產：清水寺',
            images:
              'https://hsihung.ittms.com.tw/intranet/view/images/VJPNKTO23.jpg',
            memo_1: '',
            memo_2:
              '清水寺是京都最古老的寺院，建於西元778年，與金閣寺、二條城並列為「京都三大名勝」由奈良子島寺僧人賢心（後改名延鎮）所創建。歷經應仁之亂等共計9次的戰火燒失,現在的面貌是寛永10年（1633年）由德川家光重建。寺院最大的特色是寬19公尺，進深16公尺的國寶「清水舞台」由139根高數十公尺的大圓木支撐。氣勢宏偉且沒有使用一根釘子,為日本所罕有。清水寺在歷史上，宗教上都占有重要地位，周圍城鎮的自然環境保持良好，從寺內展望京都市街堪稱絕景。',
            memo_3: '',
          },
          {
            id: 'VJPNKTO25',
            name: '日本十大名泉之首~音羽之瀧',
            images:
              'https://hsihung.ittms.com.tw/intranet/view/images/VJPNKTO25.jpg',
            memo_1: '',
            memo_2:
              '【音羽瀧】順著清水寺奧之院往下，到達音羽瀧。音羽瀧有金色水、延命水之稱，被列為日本十大名水之首。<br/>【地主神社】供奉良緣之神「大國主命」的地主神社，良緣祈願聞名全國。想要祈求良緣的人可試試有名的「戀愛占卜石」。神社內還有「幸福鑼」，敲響「幸福鑼」，其響可達愛神之處，以求愛神恩賜良緣。',
            memo_3:
              '地主神社2022年5月開始為期三年整修，無法參拜，造成不便敬請見諒。',
          },
          {
            id: 'VJPNKTO24',
            name: '二、三年坂步道～又稱二寧坂',
            images:
              'https://hsihung.ittms.com.tw/intranet/view/images/VJPNKTO24.jpg',
            memo_1: '',
            memo_2:
              '"二年坂"是從下河原町連接至產寧坂(三年坂)，一條大約長140米的石板小路，二寧坂保留了紅殼格子和虫籠窗式的京都古建築特點，兩側多是江戶時代的木造房子，充滿著優雅閒逸的氣氛，是一條極富有韻味的坡路，已被選定為日本國家重要傳統建造物群保存地區，沿途還有古瓷店、飲食店、藝品店、和紙製品店和紀念品店等，可在這選購充滿京風的紀念品。',
            memo_3: '',
          },
          {
            id: 'VJPNKTO42',
            name: '京都必訪旅遊人氣景點～新京極～享有京都廚房之美譽～錦市場',
            images:
              'https://hsihung.ittms.com.tw/intranet/view/images/VJPNKTO42.jpg',
            memo_1: '',
            memo_2:
              '錦市場已有長達四百年的歷史，有京都廚房之美譽的商店街，聚集了各種生鮮食材與傳統京料理的商店，是京都市民最愛逛的市集之一，約有130間舖，大部份都是創業多年的老店。<br/>在錦市場可以看到京都人具有美感與季節感的生活步調，當季的京野菜及漬物在這裡以自然的型態完全展現，讓漫步其中變成一種享受，這裡的物價比起市價要便宜許多，買一些熟食在旅行途中享用就是最道地的京都滋味!',
            memo_3: '',
          },
        ],
        hotel: {
          status: '1',
          data: [
            {
              name: 'CHISUN PREMIUM 京都九條飯店(附設大浴場)',
              url: 'https://www.solarehotels.com/hotel/kyoto/cp-kk/',
            },
            {
              name: 'LOISIR京都東寺飯店(2023年10月新開幕)(附設大浴場)',
              url: 'https://www.solarehotels.com/hotel/kyoto/loisir-kyototoji/',
            },
            {
              name: '烏丸京都飯店',
              url: 'https://www.hotel.kyoto/karasuma/?doing_wp_cron=1668500345.7645380496978759765625',
            },
          ],
        },
      },
      {
        free: '1',
        day: '2',
        date: '12 15 2025',
        memo_1: '',
        memo_2: '',
        memo_3: '',
        breakfast: '飯店內享用',
        lunch: '和風涮涮鍋吃到飽★黑毛和牛、豚、雞吃到飽+軟性飲料暢飲￥3000',
        dinner: '方便逛街，敬請自理',
        abstract_1:
          '京都唯一原生林~漫步糺之森－世界文化遺產:下鴨神社－日本三大名城～大阪城公園(不上天守閣)～大阪城公園－免稅店－大阪人廚房~黑門市場－自由夜訪道頓崛、心齋橋、御堂筋大道或梅田地下街',
        abstract_2: [
          {
            id: 'VJPNKTO96',
            name: '糺之森【京都唯一原生林】',
          },
          {
            id: 'AJPNKTO04',
            name: '世界文化遺產～下鴨神社',
          },
          {
            id: 'VJPNOSA06',
            name: '大阪城公園(不上天守閣)',
          },
          {
            id: 'VJPNOSA19',
            name: '免稅店',
          },
          {
            id: 'AJPNOSA42',
            name: '黑門市場',
          },
          {
            id: 'VJPNOSA08',
            name: '自由夜訪道頓崛、心齋橋、御堂筋大道或梅田地下街',
          },
        ],
        view: [
          {
            id: 'VJPNKTO96',
            name: '糺之森【京都唯一原生林】',
            images: '//hsihung.ittms.com.tw/intranet/view/images/VJPNKTO96.jpg',
            memo_1: '',
            memo_2:
              '從太古開始的原生林「糺的森林」，像保護神社一樣地生長茂盛著。被高聳樹木圍著的參拜道路，寂靜的區域使參訪者心情更平靜，忘記日常的喧囂，能回復平靜的心。特別是新綠的季節和紅葉季節的美麗景色更令人難以忘懷。在樓門附近，有以二顆樹從中間相連成一體的不可思議之神樹，從二顆相連成一顆，因此也被譽為「緣結的神樹」。',
            memo_3: '',
          },
          {
            id: 'AJPNKTO04',
            name: '世界文化遺產～下鴨神社',
            images: '//hsihung.ittms.com.tw/intranet/view/images/AJPNKTO04.jpg',
            memo_1: '',
            memo_2:
              '下鴨神社是京都最古老的神社之一，正式名稱為「賀茂御祖神社」。這座古代豪族賀茂氏供奉祖先的氏神社，與上賀茂神社共稱為「賀茂社」。現存的本殿（國寶）是於西元1863年所重建，包含祭祀「建角身命」的西殿，和祭祀「玉依媛命」的東殿兩座建築。其他還有53棟社殿被指定為國家重要文化財產，境內也獲指定為歷史遺跡。每年5月15日所舉辦的京都三大祭之一的「葵祭」，就是下鴨與上賀茂兩座神社的祭典，另外1月4日的蹴鞠表演（蹴鞠）也是相當具有京都雅風的活動。',
            memo_3: '',
          },
          {
            id: 'VJPNOSA06',
            name: '大阪城公園(不上天守閣)',
            images:
              'https://hsihung.ittms.com.tw/intranet/view/images/VJPNOSA06.jpg',
            memo_1: '',
            memo_2:
              '大阪城為幕府戰國時代的名將豐臣秀吉所建，歷經無數次戰火，最後直到昭和年間才又重建，大阪城外全長12公里的城牆，總共動用了50萬塊石頭，這些石塊主要產於生駒山、大甲山，從小豆島及瀨戶內海各地遠渡重洋而來，小豆島至今依然殘留當時築城用的石塊，現在大阪城周邊有大阪城公園供民眾休憩。',
            memo_3: '',
          },
          {
            id: 'VJPNOSA19',
            name: '免稅店',
            images:
              'https://hsihung.ittms.com.tw/intranet/view/images/VJPNOSA19.jpg',
            memo_1: '',
            memo_2: '在此有專人親切服務介紹商品，可慢慢挑選禮品饋贈親友。',
            memo_3: '',
          },
          {
            id: 'AJPNOSA42',
            name: '黑門市場',
            images: '//hsihung.ittms.com.tw/intranet/view/images/AJPNOSA42.jpg',
            memo_1: '',
            memo_2:
              '黑門市場被稱之為「大阪廚房」，總長580公尺，各類的生鮮食品店等共180家左右，特別是鮪魚、神戶牛、河豚等高級食材想當熱門。此外，草莓、柑橘類、蘋果等水果種類也十分豐富。不僅美味，購買後當場食用也很安全。在這裡可以感受到大阪活力老百姓的日常生活外，現在也是深受外國觀光客喜愛的景點之一。',
            memo_3: '',
          },
          {
            id: 'VJPNOSA08',
            name: '自由夜訪道頓崛、心齋橋、御堂筋大道或梅田地下街',
            images:
              'https://hsihung.ittms.com.tw/intranet/view/images/VJPNOSA08.jpg',
            memo_1: '',
            memo_2:
              '晚間可自由夜訪大阪最具魅力的商圈，感受城市夜色與美食交織的精彩時光。<br/>漫步於霓虹閃爍的道頓堀極樂商店街，穿著傳統服飾的工作人員與遊客擦肩而過，彷彿置身時空交錯的舞台；<br/>心齋橋以拱廊式心齋橋筋商店街為核心，匯聚日本、亞洲、美洲與歐洲的多元潮流購物店家；別忘了大啖當地特色美食——香氣四溢的章魚燒、經典的蟹道樂螃蟹料理、熱騰騰拉麵與酥脆串炸。<br/>梅田地下街位於大阪交通心臟地帶，連接JR線、阪急線、阪神線與多條地鐵，規模為日本之最。泉水廣場一帶的獨特氛圍與各式商店，讓人宛如漫遊在一座地下小城市。',
            memo_3: '',
          },
        ],
        hotel: {
          status: '1',
          data: [
            {
              name: 'Shinsaibashi Grand Hotel - Osaka心齋橋格蘭多飯店',
              url: 'https://grand-hotel.co.jp/shinsaibashi/',
            },
            {
              name: '大阪新今宮知鄉標準酒店',
              url: 'https://www.solarehotels.com/hotel/osaka/cs-os/',
            },
            {
              name: '大阪逸之彩飯店(附設大浴場)',
              url: 'http://hinode-h.com/tc/',
            },
          ],
        },
      },
      {
        free: '1',
        day: '3',
        date: '12 16 2025',
        memo_1: '',
        memo_2: '',
        memo_3: '',
        breakfast: '飯店內享用',
        lunch: '方便遊玩，敬請自理',
        dinner: '方便遊玩，敬請自理',
        abstract_1: '全日暢遊～日本環球影城～無限感動與興奮，讓您歡樂無限!',
        abstract_2: [
          {
            id: 'VJPNOSA11',
            name: '日本環球影城(電車前往)',
          },
        ],
        view: [
          {
            id: 'VJPNOSA11',
            name: '日本環球影城(電車前往)',
            images:
              'https://hsihung.ittms.com.tw/intranet/view/images/VJPNOSA11.jpg',
            memo_1: '',
            memo_2:
              '到大阪必訪的「日本環球影城」，占地54公頃，是集結多種主題的超大型樂園，除了特別從好萊塢及佛羅里達環球影城中，挑選最受歡迎的刺激娛樂設施外，2021年3月隆重開幕的「超級任天堂世界」為全球第一座以任天堂角色為主軸設計的夢幻樂園。還有2017年開幕充滿可愛黃色小小兵的『小小兵樂園』、以及神奇的『哈利波特魔法世界』，超逼真的場景，讓遊客彷彿置身電影拍攝現場，體驗身歷其境的歡樂旅程！<br/><br/>早餐後由導遊帶領您搭乘電車前往首度美國本土以外的第一座環球影城【日本環球影城】將大阪灣變成目前日本最熱門的遊樂區，<br/>2024年12月11日超級任天堂世界區域內將加入『咚奇剛國度™』，規模升級！<br/>一腳踏入野生綠意茂密蔥鬱的異質空間！在咚奇剛和夥伴們居住的叢林內，充斥著許多狂野的大冒險，包括礦車從「黃金神殿」飛奔而出、痛快地在礦山內奔馳、以及使用全身挑戰的遊玩體驗！<br/>標榜世界最大的主題公園，擁有各式各樣強大的吸引力，重視具代表性的美國文化及風情，以好萊塢引以為傲的熱門電影營造出美國式氣氛，匯集許多影像、音響等尖端技術，是世界首屈一指處處充滿無數驚慄刺激、感動與興奮。特別挑選重現經典電影場景，讓您身歷其境！「侏羅紀公園」前半段先接受長頸龍的歡迎儀式，突然小船一下子會遭到恐龍的攻擊，最後為逃離此地，須通過長25公尺，最高斜度51度的世界最長最急的險降坡，另外有「大白鯊」，從鄉下的漁村開始的小船之旅，卻在湖泊中發現鯊魚的蹤跡…突然食人鯊猛然跳出來!大家倉惶逃入船艙…接著還會被燒起來的油槽包圍住。<br/>還有最受歡迎的「史瑞克4D歷險記」裡，史瑞克和小驢再次挑戰新的冒險歷程！來自好萊塢夢工廠出品的奧斯卡獎動畫作品《史瑞克》，獨特的3-D電影加上新次元的特殊效果，帶您儘情享受冒險世界的奧妙。坐在座椅上，全身心地感受整個電影。快來體驗一下驚險而刺激的4-D魅力！「魔鬼終結者2:3D」，好萊塢特攝技術展現，世界最初的3D探險開始了。面向未來的人類和機器人的戰鬥。超立體影像嚇得人不能不躲閃。銀幕的英雄突然在舞台出現。消滅影像和現實之境界的瞬間將來到。<br/>「水世界」有充滿武打的冒險表演秀。再現水上基地的巨大裝置和壯絕的戰鬥場面，宛如電影一樣。摩托艇和水上摩托急速滑走，驚異的特技鏡頭一個個展現出來。火柱沖天，水噴四濺，聲光效果令人驚歎!為了日本環球影城而增加的新設施：「卡通慶典」、「史奴比冒險舞台」、「史奴比遊樂場」，透過『環球影城動畫魔術』解開電影導演史帝芬．史匹柏電影製作的秘密…等等。日本首創！日本環球影城的新浮游感雲霄飛車」，2007年春天開幕的新浮游感遊樂設施『HollywoodDreamTheRide』盛大開幕。可選擇喜歡的音樂系統，陪伴遊客乘坐雲霄飛車翱翔於空中，體驗飛舞的夢想。集合18個娛樂設施，讓您一次玩個夠；絕對讓您難以忘懷，全園的街道，更是充滿了驚喜和歡樂的娛樂表演，保證令您大呼過癮。<br/>',
            memo_3:
              '核可編號:CR22-2950<br>方便遊玩今日午、晚餐敬請自理。<br>※本日建議穿著輕便服裝，以便遊樂的方便。<br>※住宿大阪市區由導遊帶領搭乘地鐵前往，如住宿環球影城旁飯店則步行前往園區，敬請了解。<br>※遊客須持有「區域入場保證券」、「區域入場號碼券／抽籤券」，才能進入超級任天堂世界™。<br>※依據現場人潮狀況，「區域入場號碼券」可能提早被抽完。另外，遊客也有可能不需「區域入場保證券」、「區域入場號碼券／抽籤券」即可入場。<br><br>※本日如參觀日本環球影城※<br>◆滿2歲～未滿4歲之佔床小孩：每人退費台幣1500元(免票範圍，當日無票券)<br>◆滿2歲～未滿4歲之不佔床小孩：每人退費台幣1000元(免票範圍，當日無票券)<br><br>※本日如不參觀日本環球影城※<br>◆大人與小孩佔床退費NT$1500<br>◆滿2歲~未滿6歲之不佔床小孩：每人退費NT$1000<br>◆未滿2歲嬰兒：免票範圍不退費<br>※詳情費用請詢問業務人員，請知悉。<br><b>※特別報告：日本環球影城持票進入影城後，不可中途離場後再入場(不可重複入場)。<br>※園區內如：夢幻太空之旅、好萊塢夢列車等設施較為刺激，請各位旅客務必衡量自身的身體狀況、健康情形決定是否選擇搭乘。<br>※日本環球影城各項設施及表演節目、遊行或活動等，依天候、季節性及日期會有暫停、休止、保養等情形，詳細依日本環球影城官網公告為主。<br>※日本環球影城之快速通關券須另外自費購買。</b><br>※【特別說明】「超級任天堂世界」、「哈利波特魔法世界」當遇到日本連休或人潮眾多的日期，日本環球影城會視當天人潮流量狀況，實施入場人數管制，當天請參閱超級任天堂世界™、哈利波特魔法世界™入口處的說明，當這種情況發生，則需要貴賓們先去抽取整理卷，才能排隊等候入場，謝謝。<br>詳情請上<a href="https://www.usj.co.jp/tw/attraction/timed-entry-ticket/。">日本環球影城官網</a>查詢<br>※【特別說明】請於出團前14個工作天(不含週末及例假日)告知不前往，退費金額於團體出發前由團費中扣除，發券後一律不可退票，「團體出發後無法退費，亦無法於當地退費」特此告知。<br>※【特別說明】因團體票券須經事前預約，如未於出團前14個工作天提出需求，臨時由「不前往」日本環球影城變更為「前往」之情形，將由導遊於入園當日協助貴賓排隊自費購買FIT個人票券入園，敬請瞭解。<br>※【特別說明】未事先購買「區域入場保證券」或「附區域入場保證券的環球特快入場券」的遊客，請在當天於園區內使用日本環球影城官方APP，取得「區域入場號碼券／抽籤券」。<br>※依據現場人潮狀況，「區域入場號碼券／抽籤券」可能提早被抽完。<br>※依據現場人潮狀況，可能不需「區域入場保證券」、「區域入場號碼券／抽籤券」也可入場。<br>※建議您事先下載日本環球影城官方APP，以便遊玩當天取得「區域入場號碼券／抽籤券」，詳情請參考：<a href="https://www.usj.co.jp/web/zh/tw/enjoy/numbered-ticket">日本環球影城官網</a><br>※特別報告：「日本環球影城」12月31日當日因團體票券之限制，當日可入園時間為08:30~17:00止，特此公告，敬請瞭解。<br>※特別報告：「日本環球影城」1月1日當日因團體票券之限制，當日可入園時間為14:00~20:00止，特此公告，敬請瞭解。',
          },
        ],
        hotel: {
          status: '1',
          data: [
            {
              name: 'Shinsaibashi Grand Hotel - Osaka心齋橋格蘭多飯店',
              url: 'https://grand-hotel.co.jp/shinsaibashi/',
            },
            {
              name: 'WBF難波元町飯店',
              url: 'https://www.hotelwbf.com/namba-motomachi/',
            },
            {
              name: '2023新開幕★大阪心齋橋捷絲旅',
              url: 'https://www.justsleephotels.com/osakaShinsaibashi/tw',
            },
          ],
        },
      },
      {
        free: '1',
        day: '4',
        date: '12 17 2025',
        memo_1: '',
        memo_2: '',
        memo_3: '',
        breakfast: '飯店內享用',
        lunch: '方便逛街敬請自理',
        dinner: '方便逛街敬請自理',
        abstract_1: '全日自由活動，自由自費前往百貨公司商店街．逛街購物',
        abstract_2: [
          {
            id: 'VJPNOSA04',
            name: '全日自由活動，自由自費前往百貨公司商店街．逛街購物',
          },
        ],
        view: [
          {
            id: 'VJPNOSA04',
            name: '全日自由活動，自由自費前往百貨公司商店街．逛街購物',
            images:
              'https://hsihung.ittms.com.tw/intranet/view/images/VJPNOSA04.jpg',
            memo_1: '',
            memo_2:
              '早餐後，整理行裝。可自由自費前往百貨公司、高島屋、阪急、阪神、著名大阪地下商店街等處，自由逛街購物(本日自由活動不派車)。',
            memo_3: '',
          },
        ],
        hotel: {
          status: '1',
          data: [
            {
              name: 'Shinsaibashi Grand Hotel - Osaka心齋橋格蘭多飯店',
              url: 'https://grand-hotel.co.jp/shinsaibashi/',
            },
            {
              name: 'WBF難波元町飯店',
              url: 'https://www.hotelwbf.com/namba-motomachi/',
            },
            {
              name: '2023新開幕★大阪心齋橋捷絲旅',
              url: 'https://www.justsleephotels.com/osakaShinsaibashi/tw',
            },
          ],
        },
      },
      {
        free: '1',
        day: '5',
        date: '12 18 2025',
        memo_1: '',
        memo_2: '',
        memo_3: '※飛機搭乘時間:約兩小時四十分。',
        breakfast: '飯店內享用',
        lunch: 'XXX',
        dinner: '溫暖的家',
        abstract_1:
          '如時間許可，自由自費前往百貨公司商店街．逛街購物－關西海上空港．機場商店街－台北',
        abstract_2: [
          {
            id: 'VJPNOSA18',
            name: '如時間許可，自由自費前往百貨公司商店街．逛街購物',
          },
          {
            id: 'VJPNOSA17',
            name: '✈關西空港．機場商店街／桃園國際機場',
          },
        ],
        view: [
          {
            id: 'VJPNOSA18',
            name: '如時間許可，自由自費前往百貨公司商店街．逛街購物',
            images:
              'https://hsihung.ittms.com.tw/intranet/view/images/VJPNOSA18.jpg',
            memo_1: '',
            memo_2:
              '早餐後，整理行裝。可自由自費前往百貨公司、高島屋、阪急、阪神、著名大阪地下商店街等處，自由逛街購物(本日自由活動不派車)。',
            memo_3: '',
          },
          {
            id: 'VJPNOSA17',
            name: '✈關西空港．機場商店街／桃園國際機場',
            images:
              'https://hsihung.ittms.com.tw/intranet/view/images/VJPNOSA17.jpg',
            memo_1: '',
            memo_2:
              '之後專車前往大阪關西國際機場，機場商店街自由購物，本次旅程終告結束，在此感謝您的選擇參加，並且期待擱再相會，敬祝您旅途愉快，萬事如意，謝謝！',
            memo_3: '',
          },
        ],
        hotel: {
          status: '1',
          data: [
            {
              name: '溫暖的家',
              url: '',
            },
          ],
        },
      },
    ],
  },
  {
    name: '【特選捷克波蘭１０日】維利奇卡鹽礦、布拉格城堡區、遊船、華沙、克拉克夫、OUTLET',
    id: '26605',
    price: '64800',
    img: 'https://hsihung.ittms.com.tw/intranet/travel_list/images/26605.jpg',
    city: '歐洲 捷克',
    slogan: '東歐',
    day: '10',
    travel: [
      {
        date: '01/13',
        travel_no: 'CZV10CA260113W',
        price: '64800',
      },
      {
        date: '01/27',
        travel_no: 'CZV10CA260127W',
        price: '64800',
      },
      {
        date: '02/24',
        travel_no: 'CZV10CA260224W',
        price: '64800',
      },
      {
        date: '03/17',
        travel_no: 'CZV10CA260317W',
        price: '64800',
      },
      {
        date: '03/24',
        travel_no: 'CZV10CA260324W',
        price: '64800',
      },
    ],
    schedule: [
      {
        free: '1',
        day: '1',
        date: '01 13 2026',
        memo_1:
          '今日集合於台北桃園國際機場，專人協辦出境手續後，搭乘豪華客機飛往華沙。班機將於翌日清晨抵達，謹祝您夜晚愉快。',
        memo_2:
          '1建議您在飛機上睡個好眠培養體力。於航程關係須於飛機上過夜請各位旅客務必自行準備可以保暖的外套以備不時之須。<br>2飛機上空間較小建議您穿著舒適寬鬆的衣物以及一雙舒適的鞋子。',
        memo_3: '',
        breakfast: 'XX',
        lunch: 'XX',
        dinner: 'XX',
        abstract_1: '桃園／北京',
        abstract_2: [],
        view: [],
        hotel: {
          status: '1',
          data: [
            {
              name: '機上',
              url: 'http://www.taiwan.net.tw/',
            },
          ],
        },
      },
      {
        free: '1',
        day: '2',
        date: '01 14 2026',
        memo_1: '',
        memo_2:
          '【下車參觀】波蘭科學院、哥白尼雕像、華沙大學、城堡廣場、聖約翰教堂、舊城廣場',
        memo_3: '',
        breakfast: '機上',
        lunch: '中式六菜一湯',
        dinner: '西式三道式',
        abstract_1:
          '北京／華沙Warsaw【波蘭科學院、哥白尼雕像、華沙大學、城堡廣場、聖約翰教堂、舊城廣場】－299KM－克拉科夫Krakow',
        abstract_2: [
          {
            id: 'VPOLWAW07',
            name: '華沙舊城區 Warsaw Old Town',
          },
        ],
        view: [
          {
            id: 'VPOLWAW07',
            name: '華沙舊城區 Warsaw Old Town',
            images:
              'https://www.hsihung.com.tw/intranet/view/images/VPOLWAW07.jpg',
            memo_1: '',
            memo_2:
              '是聯合國教科文組織文化資產名單中的一個勝地。在第二次世界大戰中被摧毀，但是靠著以前留下的照片圖畫，波蘭政府將老城一塊一塊原樣重建。城堡廣場、皇宮、啤酒街ULICAPIWNA則是老城區裡最長的一條老街，老城裡的市場廣場是華沙最受歡迎的廣場，咖啡廳、餐廳、街頭藝人、紀念品店，是人潮最聚集的地區。',
            memo_3: '',
          },
        ],
        hotel: {
          status: '1',
          data: [
            {
              name: 'NOVOTEL KRAKOW CITY WEST',
              url: 'https://www.accorhotels.com/gb/hotel-3407-novotel-krakow-city-west/index.shtml',
            },
            {
              name: 'GARDEN SQUARE HOTEL KRAKÓW',
              url: 'http://gardensquarehotel.pl/',
            },
          ],
        },
      },
      {
        free: '1',
        day: '3',
        date: '01 15 2026',
        memo_1: '',
        memo_2:
          '【下車參觀】克拉克夫舊城區、市政廳鐘樓、紡織會堂、中央市集廣場、瓦維爾城堡、聖瑪莉大教堂教堂',
        memo_3: '',
        breakfast: '飯店內享用',
        lunch: '西式三道式',
        dinner: '捷克風味餐',
        abstract_1:
          '克拉克夫【克拉克夫舊城區、市政廳鐘樓、紡織會堂、中央市集廣場、聖瑪莉大教堂教堂、瓦維爾城堡】－331MK－布爾諾',
        abstract_2: [
          {
            id: 'VPOLKRA14',
            name: '克拉克夫 Krakow',
          },
        ],
        view: [
          {
            id: 'VPOLKRA14',
            name: '克拉克夫 Krakow',
            images:
              'https://www.hsihung.com.tw/intranet/view/images/VPOLKRA14.jpg',
            memo_1: '',
            memo_2:
              '克拉克夫是波蘭重要的旅遊都市，其中舊城區在1978年被列入世界文化遺產。舊城區內最重要的兩個景點為【中央市集廣場】與【瓦維爾城堡】，前者為克拉克夫城市的中心，許多特產與紀念品可在此看到。後者則為以前波蘭王室的宮殿所在地。漫步克拉克夫舊城區【市政廳鐘樓】、【紡織會堂】、【聖瑪莉大教堂教堂】',
            memo_3: '',
          },
        ],
        hotel: {
          status: '1',
          data: [
            {
              name: 'OREA CONGRESS HOTEL BRNO',
              url: 'https://www.orea.cz/hotel-congress-brno',
            },
            {
              name: 'COURTYARD BY MARRIOTT BRNO',
              url: 'https://www.marriott.com/hotels/travel/brqcy-courtyard-brno/?scid=bb1a189a-fec3-4d19-a255-54ba596febe2',
            },
            {
              name: 'HOTEL VISTA',
              url: 'https://www.vista-hotel.cz/',
            },
          ],
        },
      },
      {
        free: '1',
        day: '4',
        date: '01 16 2026',
        memo_1: '',
        memo_2:
          '【下車參觀】舊城區、噴泉、舊市政廳、馬散里哥瓦大街、自由廣場<br>【特別安排】聖巴巴拉教堂',
        memo_3: '',
        breakfast: '飯店內享用',
        lunch: '中式六菜一湯',
        dinner: '捷克烤鴨餐',
        abstract_1:
          '布爾諾【舊城區、噴泉、舊市政廳、馬散里哥瓦大街、自由廣場】－154KM－庫特納霍拉Kutna Hora【聖巴巴拉教堂】－84KM－布拉格Prague',
        abstract_2: [
          {
            id: 'VCZKBRO03',
            name: '布爾諾Brno',
          },
          {
            id: 'VCZKKUT01',
            name: '庫納霍拉+聖芭芭拉教堂',
          },
        ],
        view: [
          {
            id: 'VCZKBRO03',
            name: '布爾諾Brno',
            images:
              'https://www.hsihung.com.tw/intranet/view/images/VCZKBRO03.jpg',
            memo_1: '',
            memo_2:
              '捷克第二大都市，也是最重要的工業城，作為摩拉維亞首府期間，布爾諾留下了許多珍貴文化遺跡，使生物學家孟德爾名留青史的豌豆遺傳實驗，就是在布爾諾郊區的修道院進行，在山丘城堡、教堂和博物館中都可見證風華歷史。',
            memo_3: '',
          },
          {
            id: 'VCZKKUT01',
            name: '庫納霍拉+聖芭芭拉教堂',
            images:
              'https://www.hsihung.com.tw/intranet/view/images/VCZKKUT01.jpg',
            memo_1: '',
            memo_2:
              '聯合國文化遺產古城曾經白銀所帶來的財富與地位所輝映出現今仍存的《中世紀之古城》，此城於1995年被聯合國列入世界遺產，輕緩的步伐融入了十三世紀的古城歲月；悠閒於老城區中，參觀聖芭芭拉教堂，曾為波西米亞王都所在地，悠悠的古風，靜靜的散發著屬於東波西米亞的芬芳。',
            memo_3: '',
          },
        ],
        hotel: {
          status: '1',
          data: [
            {
              name: 'HOTEL NH PRAGUE CITY',
              url: 'http://www.nh-hotels.com/hotel/nh-prague-city',
            },
            {
              name: 'HOLIDAY INN PRAGUE',
              url: 'https://www.ihg.com/holidayinn/hotels/us/en/prague/prgnp/hoteldetail?cm_mmc=GoogleMaps-_-HI-_-CZ-_-PRGNP',
            },
            {
              name: 'HOTEL ROYAL PRAGUE',
              url: 'http://www.hotelroyalprague.com/',
            },
          ],
        },
      },
      {
        free: '1',
        day: '5',
        date: '01 17 2026',
        memo_1: '',
        memo_2:
          '【下車參觀】查理大橋、天文鐘、火藥塔、猶太區<br>【特別安排】伏爾塔瓦河遊船',
        memo_3: '',
        breakfast: '飯店內享用',
        lunch: '伏爾塔瓦河遊船自助百匯',
        dinner: '敬請自理',
        abstract_1:
          '布拉格舊城區【查理大橋、天文鐘、火藥塔、猶太區】－伏爾塔瓦河遊船',
        abstract_2: [
          {
            id: 'VEURPRG03',
            name: '布拉格舊城Prague Old Town Square(UNESCO世界文化遺產)',
          },
          {
            id: 'VEURPRG14',
            name: '布拉格天文鐘Prague astronomical clock',
          },
          {
            id: 'VEURPRG16',
            name: '查理大橋Charles Bridge',
          },
        ],
        view: [
          {
            id: 'VEURPRG03',
            name: '布拉格舊城Prague Old Town Square(UNESCO世界文化遺產)',
            images:
              'https://hsihung.ittms.com.tw/intranet/view/images/VEURPRG03.jpg',
            memo_1: '',
            memo_2:
              '布拉格有百塔之城美譽，捷克共和國首都，也是歷史上波西米亞的首府，地處歐洲大陸的中心，是一座歐洲歷史名城。布拉格到處充滿著尖尖的高塔，哥德式、巴洛克式及文藝復興的風格是東歐最美的城市。',
            memo_3: '',
          },
          {
            id: 'VEURPRG14',
            name: '布拉格天文鐘Prague astronomical clock',
            images:
              'https://hsihung.ittms.com.tw/intranet/view/images/VEURPRG14.jpg',
            memo_1: '',
            memo_2:
              '布拉格天文鐘是全球最古老、最精雕細琢的時鐘之一，高掛於市政廳正面的外牆上，是布拉格最知名的景點之一，除了報時外，還會指出月亮與星辰的位置。整點時，鐘面上的小窗會打開，露出裡頭的十二位門徒。',
            memo_3: '',
          },
          {
            id: 'VEURPRG16',
            name: '查理大橋Charles Bridge',
            images:
              'https://hsihung.ittms.com.tw/intranet/view/images/VEURPRG16.jpg',
            memo_1: '',
            memo_2:
              '查理大橋是布拉格市內，一座跨越伏爾塔瓦河的著名的歷史橋樑。由查理四世始建於1357年，完成於15世紀初。作為跨越伏爾塔瓦河的唯一橋樑，查理大橋是聯接老城與布拉格城堡及鄰近地區最重要的通道。查理大橋兩端有3座橋塔，其中兩座位於布拉格小城一側，一座位於布拉格老城一側。老城橋塔經常被認為是世界上最令人驚訝的世俗哥德式建築之一。',
            memo_3: '',
          },
        ],
        hotel: {
          status: '1',
          data: [
            {
              name: 'HOTEL NH PRAGUE CITY',
              url: 'http://www.nh-hotels.com/hotel/nh-prague-city',
            },
            {
              name: 'HOLIDAY INN PRAGUE',
              url: 'https://www.ihg.com/holidayinn/hotels/us/en/prague/prgnp/hoteldetail?cm_mmc=GoogleMaps-_-HI-_-CZ-_-PRGNP',
            },
            {
              name: 'HOTEL ROYAL PRAGUE',
              url: 'http://www.hotelroyalprague.com/',
            },
          ],
        },
      },
      {
        free: '1',
        day: '6',
        date: '01 18 2026',
        memo_1: '',
        memo_2:
          '【特別安排】黃金巷、舊皇宮、聖維特大教堂<br>【入內參觀】FashionArenaPragueOutlet<br>',
        memo_3: '',
        breakfast: '飯店內享用',
        lunch: '中式六菜一湯',
        dinner: '敬請自理',
        abstract_1:
          '布拉格城堡區【黃金巷、布拉格城堡、城堡廣場、聖維特大教堂】－ Fashion Arena Prague Outlet',
        abstract_2: [
          {
            id: 'VEURPRG15',
            name: '布拉格城堡Prague Castle(UNESCO世界文化遺產)',
          },
          {
            id: 'VCZKPRG12',
            name: '布拉格舊皇宮 Old Royal Palace',
          },
          {
            id: 'VCZKPRG11',
            name: '聖維特大教堂 St. Vitus Cathedral',
          },
          {
            id: 'VCZKPRG13',
            name: '黃金小巷',
          },
          {
            id: 'VCZKPRG07',
            name: 'FASHION ARENA PRAGUE OUTLET',
          },
        ],
        view: [
          {
            id: 'VEURPRG15',
            name: '布拉格城堡Prague Castle(UNESCO世界文化遺產)',
            images:
              'https://hsihung.ittms.com.tw/intranet/view/images/VEURPRG15.jpg',
            memo_1: '',
            memo_2:
              '布拉格城堡建於九世紀，是世界最大的城堡。歷屆波希米亞國王、神聖羅馬帝國皇帝以及捷克總統都在此辦公。這裡還保存著波希米亞王國的王冠。城堡內著名的景點包括，舊皇宮、聖維特大教堂、聖十字小堂、布拉格總教區主教府等等。',
            memo_3: '',
          },
          {
            id: 'VCZKPRG12',
            name: '布拉格舊皇宮 Old Royal Palace',
            images:
              'https://hsihung.ittms.com.tw/intranet/view/images/VCZKPRG12.jpg',
            memo_1: '',
            memo_2:
              '以往波希米亞國王的住所舊皇宮，現今捷克總統選舉皆在此舉行。',
            memo_3: '',
          },
          {
            id: 'VCZKPRG11',
            name: '聖維特大教堂 St. Vitus Cathedral',
            images:
              'https://hsihung.ittms.com.tw/intranet/view/images/VCZKPRG11.jpg',
            memo_1: '',
            memo_2:
              '歷代國王加冕的聖維特大教堂，是布拉格城堡最重要的地標，而教堂內的彩繪玻璃是藝術家慕夏的作品，為這個千年歷史的教堂增添不少現代感。',
            memo_3: '',
          },
          {
            id: 'VCZKPRG13',
            name: '黃金小巷',
            images:
              'https://www.hsihung.com.tw/intranet/view/images/VCZKPRG13.jpg',
            memo_1: '',
            memo_2:
              '小徑中並列著童話般的各色小巧房舍，鋪石的狹窄巷道兩側，色彩繽紛的房舍比鄰而立，門牌22號水藍色的房舍，是昔日作家卡夫卡寫作的場所。當你走過黃金巷時，你會感覺像在童話故事中。它由一長排風景如畫的低矮房屋組成，外牆色彩繽紛，小窗戶和門，並配有許多煙囪。街道本身很窄，鋪有鵝卵石。這裡絕對是布拉格最著名，也是最美麗的地方之一!',
            memo_3: '',
          },
          {
            id: 'VCZKPRG07',
            name: 'FASHION ARENA PRAGUE OUTLET',
            images: '//hsihung.ittms.com.tw/intranet/view/images/VCZKPRG07.jpg',
            memo_1: '',
            memo_2:
              '布拉格FashionArenaOutlet是捷克共和國最大的直銷中心，在一個地方可以方便地選擇時尚品牌，運動商品，鞋類，皮具，箱包和配飾，內衣，珠寶，化妝品，玩具，書籍以及家用產品。您的選擇有多達100家暢銷品牌並保證品質。選擇範圍寬廣，也是由於廠家直銷或由其運營商直接銷售。他們保證所售產品的品質與一般的商店完全一樣。每個商店在收銀台都有服務櫃台及其快速通道；如果您對所購商品不滿意，您可以很容易退換產品。請不要擔心，隨時聯繫商家，他們總是樂意幫助您解決一切需求。',
            memo_3: '',
          },
        ],
        hotel: {
          status: '1',
          data: [
            {
              name: 'HOTEL NH PRAGUE CITY',
              url: 'http://www.nh-hotels.com/hotel/nh-prague-city',
            },
            {
              name: 'HOLIDAY INN PRAGUE',
              url: 'https://www.ihg.com/holidayinn/hotels/us/en/prague/prgnp/hoteldetail?cm_mmc=GoogleMaps-_-HI-_-CZ-_-PRGNP',
            },
            {
              name: 'HOTEL ROYAL PRAGUE',
              url: 'http://www.hotelroyalprague.com/',
            },
          ],
        },
      },
      {
        free: '1',
        day: '7',
        date: '01 19 2026',
        memo_1: '',
        memo_2:
          '【下車參觀】霍爾尼廣場、聖三一紀念柱、Triton噴泉、凱薩噴泉、海力克噴泉',
        memo_3: '',
        breakfast: '飯店內享用',
        lunch: '中式六菜一湯',
        dinner: '西式三道式',
        abstract_1:
          '布拉格－236KM－歐洛慕奇Olomouc【霍爾尼廣場、聖三一紀念柱、Triton噴泉、凱薩噴泉、海力克噴泉】－181KM－卡托維兹Katowice',
        abstract_2: [
          {
            id: 'VCZKOLO02',
            name: '歐洛慕奇 Olomouc',
          },
        ],
        view: [
          {
            id: 'VCZKOLO02',
            name: '歐洛慕奇 Olomouc',
            images:
              'https://www.hsihung.com.tw/intranet/view/images/VCZKOLO02.jpg',
            memo_1: '',
            memo_2:
              '擁有摩拉維亞最美城市美稱的歐羅摩茲Olomouc，為捷克第五大城市，擁有具歷史價值的文化遺產僅次於布拉格。城鎮中心的霍爾尼廣場有一座高35公尺的【聖三位一體紀念柱】，是捷克境內最大的巴洛克式雕像聖柱，耗時38年才完工，由51尊雕像與浮雕組成，2000年時被列為世界文化遺產。廣場旁有著巴洛克式尖塔的【市政廳】，市政廳北面有著一高14公尺的尖拱型凹壁，裡面坐落著歐羅摩茲最著名的機械式【天文鐘】，上頭有工人與農人的雕像，底下有科學家與工人的馬賽克壁畫，頂部有著摩拉維亞的傳統服飾，在在呈現當年捷克受俄共統治時的歷史見證。還有城內唯一的當代建造噴泉【亞利安噴泉】，池中站立著頗富童話味道的雕像，為琴手亞利安被海豚拯救的故事繞著【霍尼爾廣場】，歷史故事歷歷浮現。',
            memo_3: '',
          },
        ],
        hotel: {
          status: '1',
          data: [
            {
              name: 'NOVOTEL KATOWICE CENTRUM',
              url: 'https://all.accor.com/lien_externe.svlt?goto=fiche_hotel&code_hotel=3377&merchantid=seo-maps-PL-3377&sourceid=aw-cen&utm',
            },
          ],
        },
      },
      {
        free: '1',
        day: '8',
        date: '01 20 2026',
        memo_1: '',
        memo_2: '【特別安排】維利奇卡鹽礦',
        memo_3: '',
        breakfast: '飯店內享用',
        lunch: '中式六菜一湯',
        dinner: '西式三道式',
        abstract_1: '卡托維茲－92KM－維利奇卡鹽礦－331KM－華沙',
        abstract_2: [
          {
            id: 'VPOLKRA02',
            name: '維利奇卡鹽礦WIELICZKA',
          },
        ],
        view: [
          {
            id: 'VPOLKRA02',
            name: '維利奇卡鹽礦WIELICZKA',
            images:
              'https://hsihung.ittms.com.tw/intranet/view/images/VPOLKRA02.jpg',
            memo_1: '',
            memo_2:
              '維利奇卡鹽礦於1978年被聯合國教科文組織登錄為世界遺產，他於中世紀就開始開採，已經有超過600年以上的歷史。沿著木造的樓梯迴旋往下探訪這不可思議的世界。地底下分成9層，最淺的一層約在地下60公尺處，最深的在327公尺處，隧道總長度超過280公里。最著名的聖金加禮拜堂，這個地下巨大的禮拜堂建於1896年，整個教堂無論是浮雕、雕像或是巨大的水晶吊燈全都是由鹽製成的',
            memo_3: '',
          },
        ],
        hotel: {
          status: '1',
          data: [
            {
              name: 'HOTEL MERCURE WARSZAWA CENTRUM',
              url: '',
            },
            {
              name: 'POLONIA PALACE HOTEL',
              url: 'http://www.poloniapalace.com/',
            },
            {
              name: 'NOVOTEL WARSZAWA CENTRUM',
              url: 'https://www.accorhotels.com/zh/hotel-3383-%E5%8D%8E%E6%B2%99%E4%B8%AD%E5%BF%83%E8%AF%BA%E5%AF%8C%E7%89%B9%E9%85%92%E5%BA',
            },
          ],
        },
      },
      {
        free: '1',
        day: '9',
        date: '01 21 2026',
        memo_1:
          '早餐後，把滿滿的回憶與浪漫全部打包裝入行李，當然還包括一路採購的紀念品，帶著依依不捨的心情前往機場，搭機飛返回桃園國際機場。',
        memo_2: '',
        memo_3: '',
        breakfast: '飯店內享用',
        lunch: 'XX',
        dinner: '機上',
        abstract_1: '華沙【金色梯田】－華沙機場／北京',
        abstract_2: [
          {
            id: 'VPOLWAR10',
            name: '金色梯田 Złote Tarasy',
          },
        ],
        view: [
          {
            id: 'VPOLWAR10',
            name: '金色梯田 Złote Tarasy',
            images:
              'https://www.hsihung.com.tw/intranet/view/images/VPOLWAR10.jpg',
            memo_1: '',
            memo_2:
              '是位於波蘭華沙的一座多功能建築，於2007年開幕，位於中央車站後側，是結合了商店、餐廳、飯店、電影院、停車場等多重功能的休閒與購物中心，由國際知名的設計公司TheJerdePartnership執行設計。金色梯田建築總面積達205,000平方米。它包括200家商店和餐廳、一家酒店、一個多廳電影院。正面的大型波浪狀玻璃屋頂是該建築的一大特色，設計用於避免積雪及過濾陽光，其特殊的造型讓金色梯田得到「泡泡商場」的暱稱',
            memo_3: '',
          },
        ],
        hotel: {
          status: '1',
          data: [
            {
              name: '機上',
              url: 'http://www.taiwan.net.tw/',
            },
          ],
        },
      },
      {
        free: '1',
        day: '10',
        date: '01 22 2026',
        memo_1:
          '今日抵達家園，互道珍重再見，結束此次難忘的捷克波蘭10日之旅，下次再見。',
        memo_2: '',
        memo_3: '',
        breakfast: '機上',
        lunch: 'XX',
        dinner: 'XX',
        abstract_1: '北京／桃園',
        abstract_2: [],
        view: [],
        hotel: {
          status: '1',
          data: [
            {
              name: '溫暖的家',
              url: '',
            },
          ],
        },
      },
    ],
  },
];

let fullScheduleData: QuerylistDto[] = [];

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get('/bigquery')
  @ApiOperation({ summary: '從 BigQuery 取得 schedule' })
  findOne() {
    return this.scheduleService.findAll();
  }

  @Post()
  @ApiOperation({
    summary:
      'POST query_list，每個 list 打 API 取得 schedule，嵌入 query_list 並且回傳',
  })
  async addScheduleToQueryList(@Body() data: QuerylistDto[]) {
    data = testData; // 測試的時候先用這個資料
    fullScheduleData = await this.scheduleService.addScheduleToQueryList(data);
    return fullScheduleData;
  }

  @Post('splitData')
  @ApiOperation({
    summary:
      'POST query_list_with_schedule，回傳 view, hotel, food, schedule_cleared',
  })
  splitData() {
    return this.scheduleService.splitData(fullScheduleData);
  }

  // TODO 1. /schedule GET query_list
  // TODO 2. /schedule POST query_list，每個 list 打 API 取得 schedule，嵌入 query_list 並且回傳
  // TODO 3. /schedule POST query_list_with_schedule，回傳 view, hotel, food, schedule_cleared
}
