import React from 'react';
import { INGREDIENT_LABELS } from '../game/constants';

const Scene = ({ state, handlers }) => {
  return (
    <div className="scene">
      <div className="neon">OH BAR</div>
      <div className="window">
        <div className="bar-patron"></div>
        <div className="bar-patron"></div>
        <div className="bar-patron"></div>
      </div>
      <div className="counter"></div>
      <div className={`mint-pot ${state.mintUnlocked ? 'unlocked' : ''}`} title="민트 화분 (30일차 이벤트)"></div>
    </div>
  );
};

export default Scene;
