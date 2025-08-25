// 임시 판매가 (개발용 임시 값)
export const drinkPrices = {
  GOD_FATHER: 12000,
  DRY_MARTINI: 13000,
  JACK_COKE: 10000,
};

// 레시피 정의 (사용자 지정 레시피 준수)
export const RECIPES = {
  GOD_FATHER: { name: '갓 파더', ing: ['vodka','amaretto','ice'], method: 'building' },
  DRY_MARTINI: { name: '드라이 마티니', ing: ['gin','vermouth','olive'], method: 'stirring' },
  JACK_COKE: { name: '잭콕', ing: ['jack','cola','ice'], method: 'building' },
};

// 상점 가격표
export const shopPrices = {
  // 증류주/위스키 (5잔 10000, 15잔 25000)
  vodka: {5:10000, 15:25000},
  gin: {5:10000, 15:25000},
  jack: {5:10000, 15:25000},
  // 리큐르/주스/베르무트 (5잔 5000, 15잔 15000)
  amaretto: {5:5000, 15:15000},
  vermouth: {5:5000, 15:15000},
  cola: {5:5000, 15:15000},
  // 가니쉬(올리브): 10개 3000
  olive10: 3000,
};

export const INGREDIENT_LABELS = {
  vodka:'보드카', gin:'드라이 진', jack:'잭다니엘', amaretto:'아마레또', vermouth:'드라이 베르무트', cola:'콜라', olive:'그린 올리브', ice:'얼음', traditional:'전통주', mint:'민트'
};
