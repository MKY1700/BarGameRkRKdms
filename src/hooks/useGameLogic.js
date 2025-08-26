import { useState, useEffect, useCallback, useMemo } from 'react';
import { initialState } from '../game/state';
import { RECIPES, drinkPrices, shopPrices } from '../game/constants';

const fmt = n => '₩' + n.toLocaleString('ko-KR');

export function useGameLogic() {
  const [state, setState] = useState(initialState);

  const showToast = useCallback((message) => {
    setState(s => ({ ...s, toast: message }));
    setTimeout(() => setState(s => ({ ...s, toast: null })), 1800);
  }, []);

  // Order countdown & initial spawn
  useEffect(() => {
    const timer = setInterval(() => {
      setState(s => ({
        ...s,
        orders: s.orders.map(o => o.ttl > 0 ? { ...o, ttl: o.ttl - 1 } : o).filter(o => o.ttl > 0)
      }));
    }, 1000);
    
    // Initial orders
    spawnOrder();
    spawnOrder();

    return () => clearInterval(timer);
  }, []);

  const cleanBar = useCallback(() => {
    setState(s => ({ ...s, money: s.money + 1000 }));
    showToast('매장 청소 완료 +₩1,000');
  }, [showToast]);

  const endDay = useCallback(() => {
    setState(s => {
      if (s.day === 30) {
        showToast('30일 달성! 새로운 시작! (자금 유지)');
        return {
          ...initialState,
          money: s.money,
          mintUnlocked: s.mintUnlocked,
          helpedOnce: s.helpedOnce,
          day: 1,
        };
      }

      if (s.day === 29 && !s.helpedOnce) {
        const ok = confirm('30일차 특별 손님이 도움을 요청합니다. 돕겠습니까? (한 번만 발생)');
        if (ok) {
          showToast('고객을 도왔습니다! 민트 화분을 얻었습니다. (민트 +3)');
          return { 
            ...s,
            day: s.day + 1,
            helpedOnce: true, 
            mintUnlocked: true, 
            inventory: { ...s.inventory, mint: s.inventory.mint + 3 }
          };
        }
      }
      return { ...s, day: s.day + 1 };
    });
  }, [showToast]);

  const addToMix = useCallback((key) => {
    setState(s => {
      const idx = s.mixingSlots.findIndex(x => !x);
      if (idx === -1) {
        showToast('믹싱 슬롯이 가득 찼습니다.');
        return s;
      }
      if (s.inventory[key] !== Infinity) {
        if (s.inventory[key] <= 0) {
          showToast('재고가 부족합니다.');
          return s;
        }
        const newInventory = { ...s.inventory, [key]: s.inventory[key] - 1 };
        const newSlots = [...s.mixingSlots];
        newSlots[idx] = key;
        return { ...s, inventory: newInventory, mixingSlots: newSlots };
      }
      const newSlots = [...s.mixingSlots];
      newSlots[idx] = key;
      return { ...s, mixingSlots: newSlots };
    });
  }, [showToast]);

  const clearMix = useCallback(() => {
    setState(s => {
      const returnedInventory = { ...s.inventory };
      s.mixingSlots.forEach(k => {
        if (k && k !== 'ice' && returnedInventory[k] !== Infinity) {
          returnedInventory[k]++;
        }
      });
      return { ...s, inventory: returnedInventory, mixingSlots: Array(5).fill(null) };
    });
  }, []);

  const removeFromMix = useCallback((index) => {
    setState(s => {
      const newSlots = [...s.mixingSlots];
      const ingredient = newSlots[index];

      if (!ingredient) {
        return s; // Slot is already empty
      }

      const newInventory = { ...s.inventory };
      // Return the ingredient to inventory if it's not infinite
      if (newInventory[ingredient] !== Infinity) {
        newInventory[ingredient]++;
      }

      newSlots[index] = null;

      return { ...s, mixingSlots: newSlots, inventory: newInventory };
    });
  }, []);
  
  const setTechnique = useCallback((technique) => {
    setState(s => ({ ...s, technique }));
  }, []);

  const finalizeMix = useCallback((skillScore, s, isRhythmGame = false) => {
    const mix = s.mixingSlots.filter(Boolean);
    const keyCounts = arr => arr.slice().sort().join('|');
    const mixKey = keyCounts(mix);

    const match = Object.entries(RECIPES).find(([_, r]) => keyCounts(r.ing) === mixKey);
    if (!match) {
      showToast('알 수 없는 레시피입니다. (재료를 확인)');
      return s;
    }

    const [code, recipe] = match;
    let quality = skillScore;
    // 리듬 게임의 경우, 기술 보너스/페널티를 적용하지 않음
    if (!isRhythmGame) {
      if (s.technique === recipe.method) quality += 0.2; else quality -= 0.1;
    }
    quality = Math.max(0, Math.min(1, quality));

    let payout = drinkPrices[code] || 0;
    const orderIdx = s.orders.findIndex(o => o.recipeKey === code);

    let newOrders = [...s.orders];
    if (orderIdx > -1) {
      const o = newOrders[orderIdx];
      const timeFactor = Math.max(0.5, o.ttl / 60);
      payout = Math.round(payout * (0.8 + 0.4 * timeFactor) * (0.8 + 0.4 * quality));
      newOrders.splice(orderIdx, 1);
    } else {
      payout = Math.round(payout * (0.7 + 0.5 * quality));
    }

    showToast(`${recipe.name} 완성! 품질 ${(quality * 100 | 0)}% • +${fmt(payout)}`);
    return {
      ...s,
      money: s.money + payout,
      orders: newOrders,
      mixingSlots: Array(5).fill(null),
      rhythmState: null,
    };
  }, [showToast]);

  const startMix = useCallback(() => {
    setState(s => {
      if (s.technique === 'shaking') {
        const seq = Array.from({ length: 12 }, () => ['D', 'F', 'J', 'K'][Math.floor(Math.random() * 4)]);
        return { ...s, rhythmState: { seq } };
      }
      return finalizeMix(0.7, s, false);
    });
  }, [finalizeMix]);
  
  const endRhythm = useCallback((good, bad) => {
    setState(s => {
      const score = Math.max(0, Math.min(1, (good - bad * 0.5) / (s.rhythmState?.seq.length || 12)));
      return finalizeMix(score, s, true);
    });
  }, [finalizeMix]);

  const cancelRhythm = useCallback(() => {
    showToast('셰이킹이 취소되었습니다.');
    setState(s => ({ ...s, rhythmState: null }));
  }, [showToast]);

  const spawnOrder = useCallback(() => {
    setState(s => {
        if (s.orders.length >= 4) {
            showToast('더 이상 주문을 받을 수 없습니다. (최대 4개)');
            return s;
        }
        const keys = Object.keys(RECIPES);
        const pick = keys[Math.floor(Math.random() * keys.length)];
        const id = 'ORD-' + Math.random().toString(36).slice(2, 8);
        const order = { id, recipeKey: pick, name: RECIPES[pick].name, ttl: 60, mood: 1.0 };
        return { ...s, orders: [...s.orders, order] };
    });
  }, [showToast]);

  const tryServe = useCallback(() => {
    showToast('레시피를 만들어 제공하세요. (제조 시작 후 자동 인식)');
  }, [showToast]);

  const buy = useCallback((item, quantity) => {
    setState(s => {
      let price;
      if (item === 'olive') {
          price = shopPrices.olive10;
      } else {
          price = shopPrices[item]?.[quantity];
      }

      if (price === undefined) {
          showToast('품목을 구매할 수 없습니다.');
          return s;
      }

      if (s.money < price) {
          showToast('자본이 부족합니다.');
          return s;
      }
      
      const newInventory = { ...s.inventory };
      if (item === 'olive') {
          newInventory.olive += 10;
      } else {
          newInventory[item] += quantity;
      }
      showToast(`${item} ${quantity}개 구매 완료!`);
      return {
          ...s,
          money: s.money - price,
          inventory: newInventory,
      };
    });
  }, [showToast]);

  const handlers = useMemo(() => ({
    cleanBar,
    endDay,
    addToMix,
    clearMix,
    removeFromMix,
    setTechnique,
    startMix,
    endRhythm,
    cancelRhythm,
    spawnOrder,
    tryServe,
    buy,
  }), [
    cleanBar, endDay, addToMix, clearMix, removeFromMix, setTechnique, startMix, 
    endRhythm, cancelRhythm, spawnOrder, tryServe, buy
  ]);

  return { state, handlers };
}
