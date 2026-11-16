import type {
  Destination,
  Experience,
  JournalArticle,
  PropertyListing,
  Rental,
  Restaurant,
  Stay,
} from '../types/kalaw';
import type { Language } from './translations';

const DEST_MY: Record<string, Partial<Destination>> = {
  'dest-1': {
    name: 'သိမ်တောင် ဘုန်းကြီးကျောင်း',
    location: 'မြောက်ဘက်တောင်ကြော',
    bestTime: 'နံနက် ၀၅:၄၅ – ၀၇:၃၀',
    duration: '၁.၅ နာရီ',
    shortDescription: 'ရှေးဟောင်းအုတ်စေတီများနှင့် နံနက်ခင်းမြူနှင်းမြင်ကွင်း ရှုခင်းသာ။',
  },
  'dest-2': {
    name: 'မြင်းမထိ ထင်းရှူးတောလမ်း',
    location: 'အရှေ့တောင်တောင်တန်း',
    bestTime: 'အောက်တိုဘာ – မတ်လ',
    duration: '၄ နာရီ',
    shortDescription: 'ထင်းရှူးတောအောက်မှ ဓနုနှင့် ပအိုဝ်းရွာများသို့ မြေနီခြေလျင်လမ်း။',
  },
  'dest-3': {
    name: 'ကလော ဘူတာရပ်ကွက်',
    location: 'ဘူတာလမ်း၊ မြို့လယ်',
    bestTime: 'နံနက်ခင်း ဈေးချိန်',
    duration: '၂ နာရီ',
    shortDescription: '၁၉၁၄ တည် ကျောက်တုံးဘူတာရုံ၊ ကိုလိုနီအိမ်များနှင့် ငါးရက်တစ်ဈေး။',
  },
  'dest-4': {
    name: 'နှီးဘုရား ဝါးယက်ရုပ်ပွားတော်',
    location: 'မြင်းကရွာလမ်း',
    bestTime: 'ညနေခင်း',
    duration: '၁ နာရီ',
    shortDescription: 'နှစ် ၅၀၀ ကျော်သက်တမ်းရှိ ရှေးဟောင်းဝါးယက်ဗုဒ္ဓရုပ်ပွားတော်။',
  },
  'dest-5': {
    name: 'ရွာပု လက်ဖက်တောင်ကြော',
    location: 'အနောက်ဘက် ၉ ကီလိုမီတာ',
    bestTime: 'ညနေ ၁၆:၀၀ – ၁၈:၀၀',
    duration: '၃ နာရီ',
    shortDescription: 'တောင်ကြားမြူနှင်းများကို ကြည့်ရှုနိုင်သော ဒေသခံလက်ဖက်စိုက်ခင်း။',
  },
  'dest-6': {
    name: 'ပလောင် တောင်ပေါ်သစ်တော',
    location: 'မြောက်ဘက် ရေဝေရေလဲ',
    bestTime: 'နိုဝင်ဘာ – ဖေဖော်ဝါရီ',
    duration: 'တစ်နေကုန်',
    shortDescription: 'ဝက်သစ်ချနှင့် ထင်းရှူးတောအုပ်ကြားမှ တောင်ပေါ်ရိုးရာကျေးရွာများ။',
  },
};

const STAY_MY: Record<string, Partial<Stay>> = {
  'stay-1': {
    name: 'ကလော ထင်းရှူး ရှေးဟောင်းတည်းခိုအိမ်',
    location: 'အထက်ထင်းရှူးတောင်ကြော',
    shortDescription: 'ပန်းခြံနှင့် ထင်းရှူးဝရန်တာပါ ၁၉၂၈ ခုနှစ် ကျွန်းသစ်တည်းခိုအိမ်။',
  },
  'stay-2': {
    name: 'မြူတောင်ကြော ကျောက်အိမ်တော်',
    location: 'အနောက်ဘက်တောင်စွန်း',
    shortDescription: 'လက်ဖက်တောင်ကြားကို မြင်တွေ့ရသော ကျွန်းသစ်နှင့် ကျောက်တုံးအိမ်။',
  },
  'stay-3': {
    name: 'ဘူတာလမ်း ဥယျာဉ်တည်းခိုခန်း',
    location: 'ဘူတာလမ်းရပ်ကွက်',
    shortDescription: 'နံနက်ခင်းဈေးနှင့် ဘူတာအနီးရှိ နွေးထွေးသော မိသားစုတည်းခိုခန်း။',
  },
  'stay-4': {
    name: 'ရွာပု ဆီဒါတောအုပ် အိမ်ငယ်များ',
    location: 'ရွာပုတောင်ကြား',
    shortDescription: 'ဆီဒါပင်များကြား တိုင်းရင်းဆေးရေနွေးငွေ့ ဝန်ဆောင်မှုပါ အပန်းဖြေစခန်း။',
  },
  'stay-5': {
    name: 'ဒေါ်မြ၏ လက်ဖက်ရွာ Homestay',
    location: 'မြင်းကကျေးရွာ',
    shortDescription: 'ဓနုမိသားစု၏ နွေးထွေးသော ဧည့်ဝတ်ကျေပွန်မှုနှင့် ရိုးရာကျေးလက်အိမ်။',
  },
};

const EXP_MY: Record<string, Partial<Experience>> = {
  'exp-1': {
    title: 'ကလော – အင်းလေး ၃ ရက်တာ တောင်တက်ခရီး',
    location: 'ကလော – အင်းလေးလမ်း',
    duration: '၃ ရက် / ၂ ည',
    shortDescription: 'ထင်းရှူးတောင်ကြောများနှင့် ဓနု၊ ပအိုဝ်းကျေးရွာများကို ဖြတ်သန်းမည့်ခရီး။',
  },
  'exp-2': {
    title: 'နံနက်မြူနှင်း ဓာတ်ပုံလမ်းလျှောက်ခရီး',
    location: 'သိမ်တောင်နှင့် မြို့ဟောင်း',
    duration: '၃.၅ နာရီ',
    shortDescription: 'မြူနှင်းကြား ရှမ်းစေတီများနှင့် နံနက်ဈေးမြင်ကွင်း ဓာတ်ပုံခရီးစဉ်။',
  },
  'exp-3': {
    title: 'ရှမ်းတောင်ပေါ် ဟင်းချက်သင်တန်း',
    location: 'မြို့မဈေးနှင့် မီးဖိုချောင်',
    duration: '၄ နာရီ',
    shortDescription: 'နံနက်ဈေးဝယ်ထွက်ပြီး ရှမ်းခေါက်ဆွဲနှင့် တို့ဟူးနွေး ကိုယ်တိုင်ချက်ပြုတ်ပါ။',
  },
  'exp-4': {
    title: 'ပလောင် လက်ဖက်ခူးနှင့် ရက်ကန်း',
    location: 'မြောက်ဘက်တောင်တန်း',
    duration: '၆ နာရီ',
    shortDescription: 'တောင်သူများနှင့်အတူ လက်ဖက်လှော်နည်းနှင့် ရိုးရာရက်ကန်း လေ့လာပါ။',
  },
};

const REST_MY: Record<string, Partial<Restaurant>> = {
  'rest-1': {
    name: 'ရှမ်းမီးဖို လက်ဖက်ရည်ဆိုင်',
    cuisine: 'ရှမ်းတောင်ပေါ်စာ',
    openingHours: '၀၆:၃၀ – ၁၅:၀၀',
    shortDescription: 'နနွင်းဆီချက် ရှမ်းခေါက်ဆွဲပူပူ၊ တို့ဟူးနွေးနှင့် တောင်ပေါ်လက်ဖက်စိမ်း။',
  },
  'rest-2': {
    name: 'ထင်းရှူးဝရန်တာ စားသောက်ဆိုင်',
    cuisine: 'ဒေသထွက် Farm-to-Table',
    openingHours: '၁၂:၀၀ – ၂၁:၃၀',
    shortDescription: 'ထင်းရှူးပင်များအောက် ကလောဒေသထွက် သဘာဝဟင်းလျာ စားသောက်ဆိုင်။',
  },
  'rest-3': {
    name: 'ဘူတာလမ်း ကော်ဖီနှင့် မုန့်ဖုတ်ဆိုင်',
    cuisine: 'တောင်ပေါ်ကော်ဖီ',
    openingHours: '၀၇:၀၀ – ၁၈:၀၀',
    shortDescription: 'ရွာငံ Arabica ကော်ဖီစစ်စစ်နှင့် လတ်ဆတ်သော Sourdough ပေါင်မုန့်။',
  },
  'rest-4': {
    name: 'ဧဝရတ် ဂေါ်ရခါး စားသောက်ဆိုင်',
    cuisine: 'နီပေါနှင့် ဂေါ်ရခါးစာ',
    openingHours: '၁၁:၀၀ – ၂၀:၃၀',
    shortDescription: 'မြေအိုးပဲဟင်း၊ မိုမိုဖက်ထုပ်ပေါင်းနှင့် ဂျင်းလက်ဖက်ရည်ပူပူ။',
  },
};

const RENTAL_MY: Record<string, Partial<Rental>> = {
  'rent-1': {
    name: '250cc တောင်တက် Trail ဆိုင်ကယ်',
    shortDescription: 'ပင်းတယနှင့် တောင်ကြောလမ်းများအတွက် Dual-Sport ဆိုင်ကယ်။',
  },
  'rent-2': {
    name: '125cc မြို့တွင်း စကူတာ',
    shortDescription: 'နှီးဘုရား၊ ရှုခင်းသာနှင့် ကော်ဖီဆိုင်များသို့ သွားရန် Auto စကူတာ။',
  },
  'rent-3': {
    name: '4x4 SUV ကား + ဒရိုင်ဘာ',
    shortDescription: 'ကလော၊ ဟဲဟိုး၊ ပင်းတယနှင့် အင်းလေးအတွက် ဒရိုင်ဘာပါ 4x4 ကား။',
  },
  'rent-4': {
    name: 'ဟဲဟိုးလေဆိပ် – အင်းလေး အကြိုအပို့',
    shortDescription: 'ဟဲဟိုးလေဆိပ်မှ ကလောတည်းခိုခန်းအရောက် မိနစ် ၅၀ သီးသန့်ပို့ဆောင်မှု။',
  },
};

const PROP_MY: Record<string, Partial<PropertyListing>> = {
  'prop-1': {
    title: 'ထင်းရှူးတောင်ကြော ကျွန်းသစ်နေအိမ်',
    location: 'ရပ်ကွက် (၃)၊ အထက်ထင်းရှူး',
    shortDescription: 'တောင်ကြားမြင်ကွင်း ဝရန်တာနှင့် ကျောက်တုံးဥယျာဉ်ပါ ဗိသုကာနေအိမ်။',
  },
  'prop-2': {
    title: 'ကိုလိုနီဝရန်တာ ဘန်ဂလို',
    location: 'ချာ့ချ်ဟေးလ်လမ်း',
    shortDescription: 'ပရိဘောဂအစုံပါ ရေရှည်ငှားရမ်းနိုင်သော ၁၉၃၀ ခုနှစ် ရှေးဟောင်းအိမ်။',
  },
  'prop-3': {
    title: 'ရွာပု တောင်ကြောမြေ (၁.၈၅ ဧက)',
    location: 'အနောက်ဘက် ၄.၅ ကီလိုမီတာ',
    shortDescription: '၂၇၀ ဒီဂရီ ရှုခင်းမြင်ရပြီး Eco-Lodge ဆောက်ရန်သင့်တော်သော မြေကွက်။',
  },
  'prop-4': {
    title: 'ဘူတာရပ်ကွက် ထောင့်ကွက် ဟိုတယ်နေရာ',
    location: 'ဘူတာလမ်း၊ မြို့လယ်',
    shortDescription: 'စားသောက်ခန်းနှင့် အိပ်ခန်း ၆ ခန်းပါ နှစ်ထပ်အုတ်တိုက် ထောင့်ကွက်။',
  },
};

const ARTICLE_MY: Record<string, Partial<JournalArticle>> = {
  'art-1': {
    title: 'ကလော ခရီးသွားလမ်းညွှန် — မြူနှင်းထက်မှ နံနက်ခင်း',
    subtitle: 'ထင်းရှူးတောနှင့် ငါးရက်တစ်ဈေးကြား ၃ ရက်တာ ခရီးစဉ်။',
    excerpt: '၁,၃၂၀ မီတာအမြင့်ရှိ ကလောမြို့၏ နံနက်မြူနှင်းနှင့် ထင်းရှူးတောလမ်းများ။',
  },
  'art-2': {
    title: 'ကလော၏ အလှဆုံးနေရာ ၆ ခု',
    subtitle: 'ရှုခင်းသာများ၊ ဝါးယက်ဘုရားနှင့် သစ်တောလမ်းသွယ်များ။',
    excerpt: 'နှီးဘုရားမှ သိမ်တောင်ကျောင်းတော်အထိ ကလော၏ တိတ်ဆိတ်သောအလှ။',
  },
  'art-3': {
    title: 'ကလောတွင် မဖြစ်မနေစားသင့်သော အစားအစာများ',
    subtitle: 'ရှမ်းခေါက်ဆွဲ၊ တို့ဟူးနွေးနှင့် တောင်ပေါ်ကော်ဖီဆိုင်များ။',
    excerpt: 'တိုင်းရင်းသားယဉ်ကျေးမှုများ ဆုံစည်းရာ ကလောမြို့၏ ရိုးရာအစားအစာများ။',
  },
  'art-4': {
    title: 'ကလောသို့ လည်ပတ်ရန် အကောင်းဆုံးရာသီ',
    subtitle: 'ဆောင်းတွင်းနေရောင်ခြည်မှ မိုးရာသီ တောင်ကြားမြူခိုးများအထိ။',
    excerpt: 'နိုဝင်ဘာမှ ဖေဖော်ဝါရီအထိ တောင်တက်ရန် အကောင်းဆုံးအချိန်။',
  },
};

export function localizeDestination(item: Destination, lang: Language): Destination {
  if (lang === 'en' || !DEST_MY[item.id]) return item;
  return { ...item, ...DEST_MY[item.id] };
}

export function localizeStay(item: Stay, lang: Language): Stay {
  if (lang === 'en' || !STAY_MY[item.id]) return item;
  return { ...item, ...STAY_MY[item.id] };
}

export function localizeExperience(item: Experience, lang: Language): Experience {
  if (lang === 'en' || !EXP_MY[item.id]) return item;
  return { ...item, ...EXP_MY[item.id] };
}

export function localizeRestaurant(item: Restaurant, lang: Language): Restaurant {
  if (lang === 'en' || !REST_MY[item.id]) return item;
  return { ...item, ...REST_MY[item.id] };
}

export function localizeRental(item: Rental, lang: Language): Rental {
  if (lang === 'en' || !RENTAL_MY[item.id]) return item;
  return { ...item, ...RENTAL_MY[item.id] };
}

export function localizeProperty(item: PropertyListing, lang: Language): PropertyListing {
  if (lang === 'en' || !PROP_MY[item.id]) return item;
  return { ...item, ...PROP_MY[item.id] };
}

export function localizeArticle(item: JournalArticle, lang: Language): JournalArticle {
  if (lang === 'en' || !ARTICLE_MY[item.id]) return item;
  return { ...item, ...ARTICLE_MY[item.id] };
}
