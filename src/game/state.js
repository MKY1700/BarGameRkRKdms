export const initialState = {
  day: 1,
  money: 500000, // 시작 금액 ₩500,000
  inventory: {
    vodka: 0,
    gin: 0,
    jack: 0,
    amaretto: 0,
    vermouth: 0,
    cola: 50, // 콜라 50잔 지급
    olive: 0, // 가니쉬는 수량 단위
    ice: Infinity, // 얼음 무제한
    traditional: 0, // 전통주 — 손님 혜택으로 3잔 고정 획득
    mint: 0, // 30일차 이벤트 후 획득 가능
  },
  mixingSlots: Array(5).fill(null), // 최대 5칸
  technique: 'building',
  orders: [],
  mintUnlocked: false,
  helpedOnce: false,
  toast: null,
  rhythmState: null, // null or { seq, ... }
};
