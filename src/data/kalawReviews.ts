import type { PlaceReview } from '../types/kalaw.ts';
import type { Language } from '../i18n/translations.ts';

export const INITIAL_REVIEWS: PlaceReview[] = [
  {
    id: 'rev-1',
    placeId: 'dest-1',
    placeKind: 'destination',
    placeName: 'Thein Taung Monastery Ridge',
    goal: 'sunrise',
    authorName: 'Hnin Ei Mon',
    authorOrigin: 'Yangon · Dawn Walker',
    visitedSeason: 'November 2026',
    rating: 5,
    headline: 'A silent sea of valley mist beneath the brick stupas',
    story:
      'Arrived at 05:50 just as the bells rang from the teak prayer hall. Beneath the pine silhouettes, layers of fog filled the eastern basin while warm amber sunlight slowly broke over the hills.',
    goalTip:
      'Walk the stone stairway behind the main hall 15 minutes before sunrise for an unobstructed view without crowds, and bring a light wool layer.',
    helpfulCount: 28,
    createdAt: '2026-11-10T07:15:00Z',
  },
  {
    id: 'rev-2',
    placeId: 'dest-2',
    placeKind: 'destination',
    placeName: 'Myin Ma Hti Pine Corridor',
    goal: 'trekking',
    authorName: 'Kyaw Zin Htet',
    authorOrigin: 'Mandalay · Trail Runner',
    visitedSeason: 'October 2026',
    rating: 5,
    headline: 'Effortless red-earth ridge trails shaded by towering pines',
    story:
      'We set out after breakfast to test our pace before attempting the full Inle trek. The path winds gently past avocado orchards and opens onto sweeping limestone ridges.',
    goalTip:
      'Follow the eastern fork past the second ginger farm to loop back via the cave sanctuary—ideal 4-hour warm-up hike with minimal steep climbing.',
    helpfulCount: 19,
    createdAt: '2026-10-28T13:40:00Z',
  },
  {
    id: 'rev-3',
    placeId: 'dest-3',
    placeKind: 'destination',
    placeName: 'Kalaw Heritage Railway Quarter',
    goal: 'heritage',
    authorName: 'Clara Lindqvist',
    authorOrigin: 'Stockholm · Architectural Historian',
    visitedSeason: 'November 2026',
    rating: 5,
    headline: 'Century-old stone masonry paired with vibrant market mornings',
    story:
      'Spending a slow morning sketching along Station Road felt like stepping back a hundred years. The old masonry facade, eucalyptus trees, and morning tea baskets create an unforgettable atmosphere.',
    goalTip:
      'Check whether your visit falls on the 5-day rotating market morning and arrive at Station Road by 07:30 before produce stalls wrap up.',
    helpfulCount: 24,
    createdAt: '2026-11-04T09:05:00Z',
  },
  {
    id: 'rev-4',
    placeId: 'dest-5',
    placeKind: 'destination',
    placeName: 'Ywa Pu Tea Terraces & Crest',
    goal: 'photography',
    authorName: 'Min Khant',
    authorOrigin: 'Yangon · Landscape Photographer',
    visitedSeason: 'November 2026',
    rating: 5,
    headline: 'Molten bronze sunset light over terraced tea spurs',
    story:
      'Hardly another traveler was on the western ridge when we arrived at four in the afternoon. Local tea growers invited us to try pan-fired green tea while clouds pooled across three ridges below.',
    goalTip:
      'Aim to reach the upper crest by 16:15 on a scooter or 4x4; bring a 50mm–85mm lens to compress the layered blue ridges at golden hour.',
    helpfulCount: 31,
    createdAt: '2026-11-08T17:30:00Z',
  },
  {
    id: 'rev-5',
    placeId: 'dest-4',
    placeKind: 'destination',
    placeName: 'Hnee Paya Bamboo Sanctuary',
    goal: 'calmRest',
    authorName: 'Su Myat Noe',
    authorOrigin: 'Taunggyi · Slow Traveler',
    visitedSeason: 'October 2026',
    rating: 4.9,
    headline: 'Quiet contemplation along Myin Ka’s shady village lane',
    story:
      'Cycling two kilometers south from the clock tower brought us to this serene sanctuary. The 500-year-old woven bamboo lacquer Buddha has a gentle warmth rarely seen elsewhere.',
    goalTip:
      'Pair this stop with a slow bicycle ride into Myin Ka hamlet for afternoon sesame biscuits and mountain green tea under the courtyard trees.',
    helpfulCount: 15,
    createdAt: '2026-10-19T15:20:00Z',
  },
  {
    id: 'rev-6',
    placeId: 'dest-6',
    placeKind: 'destination',
    placeName: 'Palaung Highland Forest Reserve',
    goal: 'culinary',
    authorName: 'Saw Daniel',
    authorOrigin: 'Pathein · Culinary Explorer',
    visitedSeason: 'November 2026',
    rating: 5,
    headline: 'Wild herbs, wood-fired village lunch, and highland tea leaves',
    story:
      'Beyond the silver-oak birdwatching trails, sharing a wood-fired lunch with fermented tea leaves and mountain greens in a Palaung hamlet was the highlight of our entire trip.',
    goalTip:
      'Request a guided morning walk that finishes at a village kitchen before noon so you can taste fresh pan-roasted tea leaves right off the hearth.',
    helpfulCount: 22,
    createdAt: '2026-11-12T12:10:00Z',
  },
];

const REVIEWS_MY: Record<string, Partial<PlaceReview>> = {
  'rev-1': {
    placeName: 'သိမ်တောင် ဘုန်းကြီးကျောင်း',
    authorOrigin: 'ရန်ကုန် · နံနက်ခင်းလမ်းလျှောက်သူ',
    visitedSeason: 'နိုဝင်ဘာ ၂၀၂၆',
    headline: 'အုတ်စေတီများအောက်မှ တိတ်ဆိတ်ငြိမ်းချမ်းသော မြူနှင်းပင်လယ်',
    story:
      'နံနက် ၀၅:၅၀ တွင် ရောက်ရှိခဲ့ပြီး ကျွန်းသစ်တရားဆောင်မှ ကြေးစည်သံနှင့်အတူ ထင်းရှူးပင်များကြား မြူနှင်းလွှာများ ဝဲတက်လာပုံမှာ မမေ့နိုင်စရာ မြင်ကွင်းဖြစ်ခဲ့ပါသည်။',
    goalTip:
      'နေမထွက်မီ ၁၅ မိနစ်အလိုတွင် ပင်မတရားဆောင်နောက်ဘက် ကျောက်လှေကားထစ်အတိုင်း တက်သွားပါက လူရှင်းပြီး မြင်ကွင်းကျယ်အကောင်းဆုံးနေရာကို ရရှိပါမည်။ အနွေးထည်ပါးလေး ယူဆောင်ပါ။',
  },
  'rev-2': {
    placeName: 'မြင်းမထိ ထင်းရှူးတောလမ်း',
    authorOrigin: 'မန္တလေး · တောင်တက်ဝါသနာရှင်',
    visitedSeason: 'အောက်တိုဘာ ၂၀၂၆',
    headline: 'ထင်းရှူးပင်ရိပ်အောက်မှ သက်တောင့်သက်သာ မြေနီခြေလျင်လမ်း',
    story:
      'အင်းလေး ၃ ရက်တောင်တက်ခရီး မစတင်မီ စမ်းသပ်လမ်းလျှောက်ရန် နံနက်စာစားပြီး ထွက်လာခဲ့ပါသည်။ ထောပတ်ခြံများနှင့် ထုံးကျောက်တောင်ကြောများကို ဖြတ်သန်းရသည်မှာ အလွန်သာယာပါသည်။',
    goalTip:
      'ဒုတိယ ချင်းစိုက်ခင်းကို ကျော်ပြီး အရှေ့ဘက်လမ်းခွဲအတိုင်း လျှောက်ပါက ၄ နာရီဝန်းကျင် မြင်းမထိဂူဘက်မှ ပတ်ပြန်နိုင်သော ပြေပြစ်သည့် လမ်းကြောင်းကောင်း ဖြစ်ပါသည်။',
  },
  'rev-3': {
    placeName: 'ကလော ဘူတာရပ်ကွက်',
    authorOrigin: 'စတော့ဟုမ်း · ဗိသုကာသုတေသီ',
    visitedSeason: 'နိုဝင်ဘာ ၂၀၂၆',
    headline: 'ရာစုနှစ်ကျော် ကျောက်တုံးဗိသုကာနှင့် နံနက်ခင်း ဈေးနေ့အလှ',
    story:
      'ဘူတာလမ်းတစ်လျှောက် ပန်းချီဆွဲရင်း လမ်းလျှောက်ခဲ့ရသည်မှာ လွန်ခဲ့သောနှစ် ၁၀၀ ခန့်သို့ ပြန်ရောက်သွားသကဲ့သို့ ခံစားရပါသည်။ ကျောက်တုံးဘူတာရုံနှင့် ယူကလစ်ပင်ရိပ်များမှာ ငြိမ်းချမ်းလှပါသည်။',
    goalTip:
      'သင်ရောက်မည့်နေ့သည် ငါးရက်တစ်ဈေးနေ့နှင့် တိုက်ဆိုင်ခြင်း ရှိ၊ မရှိ ကြိုစစ်ပြီး နံနက် ၀၇:၃၀ မတိုင်မီ ဘူတာလမ်းနှင့် ဈေးဘက်သို့ ရောက်အောင် သွားပါ။',
  },
  'rev-4': {
    placeName: 'ရွာပု လက်ဖက်တောင်ကြော',
    authorOrigin: 'ရန်ကုန် · ရှုခင်းဓာတ်ပုံဆရာ',
    visitedSeason: 'နိုဝင်ဘာ ၂၀၂၆',
    headline: 'လက်ဖက်တောင်စောင်းများပေါ် ကျရောက်သော ရွှေအိုရောင် နေဝင်ဆည်းဆာ',
    story:
      'ညနေ ၄ နာရီတွင် ရောက်သွားချိန်၌ တောင်ကြောပေါ်တွင် အခြားခရီးသွား မရှိသလောက် တိတ်ဆိတ်နေပါသည်။ ဒေသခံလက်ဖက်တောင်သူများက လတ်ဆတ်သော လက်ဖက်စိမ်းရေနွေးကြမ်းဖြင့် ဧည့်ခံကြပါသည်။',
    goalTip:
      'ဆိုင်ကယ် သို့မဟုတ် 4x4 ကားဖြင့် ညနေ ၁၆:၁၅ အမီ တောင်ကြောထိပ်သို့ တက်ပါ။ နေဝင်ချိန် တောင်တန်းအလွှာများ ရိုက်ကူးရန် 50mm–85mm မှန်ဘီလူး ယူဆောင်သွားသင့်ပါသည်။',
  },
  'rev-5': {
    placeName: 'နှီးဘုရား ဝါးယက်ရုပ်ပွားတော်',
    authorOrigin: 'တောင်ကြီး · အေးချမ်းခရီးသွား',
    visitedSeason: 'အောက်တိုဘာ ၂၀၂၆',
    headline: 'မြင်းကရွာလမ်းသွယ်တစ်လျှောက် တိတ်ဆိတ်အေးချမ်းမှု',
    story:
      'နာရီစင်မှ စက်ဘီးဖြင့် တောင်ဘက် ၂ ကီလိုမီတာခန့် စီးသွားရာ နှစ် ၅၀၀ ကျော်သက်တမ်းရှိ ဝါးယက်ဗုဒ္ဓရုပ်ပွားတော်ကြီးကို ဖူးမြော်ခွင့်ရခဲ့ပါသည်။ စိတ်အေးချမ်းသာမှု အပြည့်အဝ ရရှိစေပါသည်။',
    goalTip:
      'နှီးဘုရား ဖူးမြော်ပြီးနောက် မြင်းကကျေးရွာထဲသို့ စက်ဘီးဖြင့် ဆက်ဝင်၍ ခြံရိပ်အောက်တွင် ရှမ်းနှမ်းမုန့်နှင့် လက်ဖက်စိမ်း သုံးဆောင်ရင်း အနားယူပါ။',
  },
  'rev-6': {
    placeName: 'ပလောင် တောင်ပေါ်သစ်တော',
    authorOrigin: 'ပုသိမ် · ရိုးရာအစားအစာ လေ့လာသူ',
    visitedSeason: 'နိုဝင်ဘာ ၂၀၂၆',
    headline: 'သစ်တောတွင်း ထင်းမီးချက် ရွာထမင်းဝိုင်းနှင့် တောင်ပေါ်လက်ဖက်ရနံ့',
    story:
      'ဝက်သစ်ချသစ်တောလမ်းအတိုင်း ငှက်မျိုးစိတ်များ လေ့လာပြီးနောက် ပလောင်ကျေးရွာတွင် လက်ဖက်စိမ်းလှော်နှင့် တောဟင်းရွက်စုံ ရိုးရာနေ့လယ်စာ သုံးဆောင်ခဲ့ရသည်မှာ ခရီးစဉ်တစ်ခုလုံး၏ အကောင်းဆုံးအမှတ်တရ ဖြစ်ပါသည်။',
    goalTip:
      'မွန်းတည့်ချိန်မတိုင်မီ ကျေးရွာမီးဖိုဆောင်သို့ ရောက်ရှိမည့် နံနက်ခင်းလမ်းညွှန်ခရီးစဉ်ကို ရွေးချယ်ပါက မီးဖိုပေါ်မှ ချခါစ လတ်ဆတ်သော လက်ဖက်လှော်ကို မြည်းစမ်းနိုင်ပါမည်။',
  },
};

export function localizeReview(review: PlaceReview, lang: Language): PlaceReview {
  if (lang === 'en' || !REVIEWS_MY[review.id]) return review;
  return { ...review, ...REVIEWS_MY[review.id] };
}
