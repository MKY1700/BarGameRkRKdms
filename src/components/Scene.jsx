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

      

      <div className="counter"></div>
      <div className={`mint-pot ${state.mintUnlocked ? 'unlocked' : ''}`} title="민트 화분 (30일차 이벤트)"></div>
    </div>
  );
};

export default Scene;
