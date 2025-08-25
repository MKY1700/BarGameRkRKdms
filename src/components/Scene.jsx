import React from 'react';
import { INGREDIENT_LABELS } from '../game/constants';

const Scene = ({ state, handlers }) => {
  // Street animation effect
  React.useEffect(() => {
    const street = document.getElementById('street');
    if (!street) return;

    const spawnPerson = () => {
      const p = document.createElement('div');
      p.className = 'person';
      const startX = Math.random() < .5 ? -40 : street.clientWidth + 40;
      const endX = startX < 0 ? street.clientWidth + 40 : -40;
      p.style.left = startX + 'px';
      street.appendChild(p);
      const duration = 12000 + Math.random() * 8000;
      const start = performance.now();
      
      let frameId;
      function tick(t) {
        const prog = Math.min(1, (t - start) / duration);
        const x = startX + (endX - startX) * prog;
        p.style.transform = `translateX(${x - startX}px)`;
        if (prog < 1) {
          frameId = requestAnimationFrame(tick);
        } else {
          p.remove();
        }
      }
      frameId = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(frameId);
    };

    const intervalId = setInterval(spawnPerson, 2200);
    return () => clearInterval(intervalId);
  }, []);

  const availableIngredients = [
    ['vodka','보드카'], ['gin','드라이 진'], ['jack','잭다니엘'],
    ['amaretto','아마레또'], ['vermouth','드라이 베르무트'], ['cola','콜라'],
    ['olive','그린 올리브'], ['ice','얼음'], ['traditional','전통주'],
    ...(state.mintUnlocked ? [['mint','민트']] : []),
  ];

  return (
    <div className="scene">
      <div className="neon">조주 BAR • Inside → Outside View</div>
      <div className="window">
        <div className="street" id="street"></div>
      </div>

      <div className="controls">
        <div className="panel">
          <h3>재료 선택 (최대 5칸 믹싱 슬롯)</h3>
          <div className="row tiny muted">기본 증류주/위스키/리큐르/주스/가니쉬/얼음 제공 — 레시피에 맞게 선택하세요.</div>
          <div className="ingredients">
            {availableIngredients.map(([key, label]) => {
              const qty = state.inventory[key] === Infinity ? '∞' : (state.inventory[key] || 0);
              const disabled = state.inventory[key] !== Infinity && state.inventory[key] <= 0;
              return (
                <button key={key} className="ing" disabled={disabled} onClick={() => handlers.addToMix(key)}>
                  {label}<small>{qty}</small>
                </button>
              );
            })}
          </div>
          <div className="row">
            <div className="mix-slots">
              {state.mixingSlots.map((slot, i) => (
                <div key={i} className="slot">
                  {slot ? INGREDIENT_LABELS[slot] : '+ 재료'}
                </div>
              ))}
            </div>
          </div>
          <div className="row">
            <select className="btn" value={state.technique} onChange={(e) => handlers.setTechnique(e.target.value)}>
              <option value="building">빌딩</option>
              <option value="stirring">스터링</option>
              <option value="shaking">셰이킹</option>
              <option value="floating">플로팅</option>
              <option value="blending">블랜딩</option>
              <option value="throwing">쓰로잉</option>
            </select>
            <button className="btn btn-primary" onClick={handlers.startMix}>제조 시작</button>
            <button className="btn" onClick={handlers.clearMix}>슬롯 비우기</button>
          </div>
          <div className="row tiny">
            <span className="muted">지원 레시피: 갓 파더, 드라이 마티니, 잭콕 • 기법 일치 시 품질 상승</span>
          </div>
        </div>
        <div className="panel">
          <h3>레시피</h3>
          <div className="row tiny">
            <div className="tag">갓 파더 — 보드카 + 아마레또 + 얼음 <span className="muted">(권장: 빌딩)</span></div>
          </div>
          <div className="row tiny">
            <div className="tag">드라이 마티니 — 드라이 진 + 드라이 베르무트 + 그린 올리브 <span className="muted">(권장: 스터링)</span></div>
          </div>
          <div className="row tiny">
            <div className="tag">잭콕 — 잭다니엘 + 콜라 + 얼음 <span className="muted">(권장: 빌딩)</span></div>
          </div>
          <div className="sep"></div>
          <div className="row tiny">
            <b>판매가 (임시/조정 가능):</b>
            <span className="tag">갓 파더 ₩12,000</span>
            <span className="tag">드라이 마티니 ₩13,000</span>
            <span className="tag">잭콕 ₩10,000</span>
          </div>
          <div className="row tiny muted">※ 위 판매가는 개발용 임시 값입니다. 필요 시 상단 스크립트에서 조정하세요.</div>
        </div>
      </div>

      <div className="counter"></div>
      <div className={`mint-pot ${state.mintUnlocked ? 'unlocked' : ''}`} title="민트 화분 (30일차 이벤트)"></div>
    </div>
  );
};

export default Scene;
