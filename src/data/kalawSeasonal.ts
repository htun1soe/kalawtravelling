export interface SeasonalEventItem {
  id: string;
  seasonWindow: string;
  title: string;
  category: 'Festival' | 'Nature & Climate' | 'Harvest';
  highlight: string;
  insiderTip: string;
}

export interface KalawTrendItem {
  id: string;
  tag: string;
  title: string;
  summary: string;
  suggestedPlaceId?: string;
}

export const KALAW_SEASONAL_EVENTS_EN: SeasonalEventItem[] = [
  {
    id: 'season-tazaungdaing',
    seasonWindow: 'November (Full Moon)',
    title: 'Tazaungdaing Hot-Air Balloons & Hilltop Flame Processions',
    category: 'Festival',
    highlight:
      'Candles trace Kalaw’s pine ridges while hand-crafted paper fire-balloons rise above the railway basin and neighboring Shan towns.',
    insiderTip:
      'Watch evening lantern launches from Thein Taung Ridge or arrive early near the Myoma square before dusk mist settles.',
  },
  {
    id: 'season-cherry',
    seasonWindow: 'December – February',
    title: 'Winter Mist, Frost Mornings & Wild Himalayan Cherry Blossoms',
    category: 'Nature & Climate',
    highlight:
      'Crisp 8–18°C highland mornings blanket valleys in silver fog while pink Prunus cerasoides blooms line Station Road and pine ridges.',
    insiderTip:
      'Pack a warm wool sweater for dawn viewpoints at 05:45; midday sun stays gentle for all-day trekking.',
  },
  {
    id: 'season-thingyan',
    seasonWindow: 'Mid-April',
    title: 'Highland Thingyan & Golden Padauk Blossoms',
    category: 'Festival',
    highlight:
      'A gentler, community-focused Burmese New Year celebration beneath shaded banyan trees mixed with quiet monastery merit-making.',
    insiderTip:
      'Ideal escape from lowland heat—book heritage lodges 3–4 weeks early as Yangon families retreat to the hills.',
  },
  {
    id: 'season-harvest',
    seasonWindow: 'August – November',
    title: 'Shan Avocado, Persimmon & Highland Green Tea Harvest',
    category: 'Harvest',
    highlight:
      'Orchards around Myin Ma Hti and Ywa Pu crest overflow with creamy avocados, wild honey, ginger, and wood-fired green tea.',
    insiderTip:
      'Time your stay to overlap the 5-day rotating market morning to taste warm tofu nway alongside fresh-picked orchard fruit.',
  },
];

export const KALAW_SEASONAL_EVENTS_MY: SeasonalEventItem[] = [
  {
    id: 'season-tazaungdaing',
    seasonWindow: 'နိုဝင်ဘာလ (တန်ဆောင်မုန်းလပြည့်)',
    title: 'တန်ဆောင်တိုင် မီးပုံးပျံနှင့် တောင်ပေါ်ဆီမီးထွန်းပွဲတော်',
    category: 'Festival',
    highlight:
      'ကလောမြို့ ထင်းရှူးတောင်ကြောများပေါ်တွင် ဆီမီးရောင်များ ထွန်းညှိပူဇော်ကြပြီး ညဦးပိုင်း၌ လက်လုပ်မီးပုံးပျံများ လွှတ်တင်လေ့ရှိပါသည်။',
    insiderTip:
      'သိမ်တောင်ကုန်း သို့မဟုတ် မြို့မရင်ပြင်အနီးသို့ နေမဝင်မီ ကြိုတင်ရောက်ရှိပါက နှင်းမြူများကြားမှ မီးပုံးပျံမြင်ကွင်းကို အကောင်းဆုံး ကြည့်ရှုနိုင်ပါသည်။',
  },
  {
    id: 'season-cherry',
    seasonWindow: 'ဒီဇင်ဘာ – ဖေဖော်ဝါရီ',
    title: 'ဆောင်းရာသီ နှင်းမြူပင်လယ်နှင့် တောင်ပေါ်ချယ်ရီပန်းပွင့်ချိန်',
    category: 'Nature & Climate',
    highlight:
      'အပူချိန် ၈–၁၈ ဒီဂရီစင်တီဂရိတ်ခန့် ချမ်းအေးသည့် နံနက်ခင်းများတွင် ဘူတာလမ်းနှင့် တောင်ကြောများတစ်လျှောက် ပန်းရောင်ချယ်ရီပန်းများ ဝေဆာပွင့်ဖူးပါသည်။',
    insiderTip:
      'နံနက် ၀၅:၄၅ နေထွက်ချိန် ကြည့်ရှုရန် အနွေးထည်ထူထူ ယူဆောင်ပါ။ နေ့လယ်ပိုင်းတွင်မူ နေရောင်နွေးနွေးဖြင့် တောင်တက်ရန် အလွန်သင့်တော်ပါသည်။',
  },
  {
    id: 'season-thingyan',
    seasonWindow: 'ဧပြီလလယ်',
    title: 'ကလော တောင်ပေါ်သင်္ကြန်နှင့် ပိတောက်ပွင့်ချိန်',
    category: 'Festival',
    highlight:
      'မြေပြန့်အပူဒဏ်မှ ရှောင်တိမ်းကာ သစ်ပင်ရိပ်အောက်၌ အေးချမ်းစွာ ရေကစားခြင်းနှင့် ဘုန်းကြီးကျောင်းများတွင် ကုသိုလ်ကောင်းမှုပြုလုပ်သည့် ရိုးရာသင်္ကြန်ဖြစ်ပါသည်။',
    insiderTip:
      'သင်္ကြန်ကာလတွင် ရန်ကုန်နှင့် မန္တလေးမှ ဧည့်သည်များ လာရောက်လေ့ရှိသဖြင့် တည်းခိုအိမ်များကို ၃–၄ ပတ် ကြိုတင်စုံစမ်းထားသင့်ပါသည်။',
  },
  {
    id: 'season-harvest',
    seasonWindow: 'ဩဂုတ် – နိုဝင်ဘာ',
    title: 'ရှမ်းထောပတ်သီး၊ တည်သီးနှင့် လက်ဖက်စိမ်း ရိတ်သိမ်းချိန်',
    category: 'Harvest',
    highlight:
      'မြင်းမထိနှင့် ရွာပုတောင်ကြောတစ်ဝိုက်ရှိ ဥယျာဉ်ခြံများတွင် ထောပတ်သီး၊ တောပျားရည်၊ ချင်းနှင့် ထင်းမီးလှော် လက်ဖက်စိမ်းများ အထွက်တိုးချိန်ဖြစ်ပါသည်။',
    insiderTip:
      'ငါးရက်တစ်ဈေးနေ့ နံနက်ခင်းနှင့် တိုက်ဆိုင်အောင် သွားရောက်ပါက တို့ဟူးနွေးပူပူနှင့် လတ်ဆတ်သော သစ်သီးဝလံများကို တစ်ပြိုင်နက် မြည်းစမ်းနိုင်ပါမည်။',
  },
];

export const KALAW_TRENDS_EN: KalawTrendItem[] = [
  {
    id: 'trend-ridge-dawn',
    tag: 'Most Searched',
    title: 'Soft Adventure & Sunrise Ridge Coffees',
    summary:
      'Instead of only multi-day treks, travelers now pair dawn cloud-sea viewpoints at Thein Taung and Ywa Pu Crest with artisanal roasted coffee and avocado toast.',
    suggestedPlaceId: 'dest-1',
  },
  {
    id: 'trend-five-day-market',
    tag: 'Cultural Favorite',
    title: 'Five-Day Rotating Market Slow Walks',
    summary:
      'Visitors time stays to follow Pa-O, Danu, Taungyo, and Palaung traders bringing handwoven baskets, fermented tea, and mountain blooms into central Kalaw.',
    suggestedPlaceId: 'dest-3',
  },
  {
    id: 'trend-heritage-villas',
    tag: 'Stay & Design Trend',
    title: 'Restored Timber Villas & Slow Architectural Retreats',
    summary:
      'Digital workers and couples seek fireplace-warmed cedar cottages and century-old stone estates for week-long highland resets.',
    suggestedPlaceId: 'dest-4',
  },
  {
    id: 'trend-inle-trek',
    tag: 'Iconic Route',
    title: 'Kalaw to Inle Limestone Trail',
    summary:
      'Still Myanmar’s signature overland walk—red-earth ridges, bamboo villages, and wood-fired village kitchens ending overlooking Inle Lake.',
    suggestedPlaceId: 'dest-2',
  },
];

export const KALAW_TRENDS_MY: KalawTrendItem[] = [
  {
    id: 'trend-ridge-dawn',
    tag: 'လူကြိုက်အများဆုံး',
    title: 'တောင်ကြော နေထွက်မြင်ကွင်းနှင့် မနက်ခင်းကော်ဖီ',
    summary:
      'ရက်ရှည်တောင်တက်ခရီးစဉ်အပြင် သိမ်တောင်နှင့် ရွာပုတောင်ကြောပေါ်မှ တိမ်ပင်လယ်ကြည့်ရှုပြီး ထောပတ်သီးမုန့်နှင့် ဒေသထွက်ကော်ဖီသောက်သုံးခြင်းမှာ ယခုနှစ် ခရီးသွားအများစု နှစ်သက်သည့် ပုံစံဖြစ်ပါသည်။',
    suggestedPlaceId: 'dest-1',
  },
  {
    id: 'trend-five-day-market',
    tag: 'ယဉ်ကျေးမှု ရေပန်းစားမှု',
    title: 'ငါးရက်တစ်ဈေးနှင့် နံနက်ခင်း ရွာလည်လမ်းလျှောက်ခြင်း',
    summary:
      'ပအိုဝ်း၊ ဓနု၊ တောင်ရိုးနှင့် ပလောင်တိုင်းရင်းသားများ၏ ရိုးရာခြင်းတောင်းများ၊ လက်ဖက်စိုနှင့် တောပန်းများ ရောင်းချသည့် ငါးရက်တစ်ဈေးနေ့ကို အမီလာရောက်လေ့ရှိကြပါသည်။',
    suggestedPlaceId: 'dest-3',
  },
  {
    id: 'trend-heritage-villas',
    tag: 'တည်းခိုနေထိုင်မှု ပုံစံသစ်',
    title: 'ရှေးဟောင်းသစ်သားဗီလာများနှင့် အေးချမ်းစွာ အနားယူခြင်း',
    summary:
      'မီးလင်းဖိုပါဝင်သည့် ထင်းရှူးသားအိမ်လေးများနှင့် ရှေးဟောင်းကျောက်အိမ်ကြီးများတွင် ရက်သတ္တပတ်ကြာ အေးအေးဆေးဆေး အလုပ်လုပ်ရင်း အနားယူသည့် ခရီးသွားပုံစံ ခေတ်စားလာပါသည်။',
    suggestedPlaceId: 'dest-4',
  },
  {
    id: 'trend-inle-trek',
    tag: 'ထင်ရှားသော လမ်းကြောင်း',
    title: 'ကလော – အင်းလေး ထုံးကျောက်တောင်တက်လမ်း',
    summary:
      'မြန်မာနိုင်ငံ၏ နာမည်ကျော် ကုန်းတွင်းခြေလျင်ခရီးစဉ်အဖြစ် မြေနီလမ်းများ၊ ဝါးတောရွာများနှင့် ရွာထမင်းဝိုင်းများကို ဖြတ်သန်းကာ အင်းလေးကန်သို့ ဆင်းသက်ကြဆဲ ဖြစ်ပါသည်။',
    suggestedPlaceId: 'dest-2',
  },
];
