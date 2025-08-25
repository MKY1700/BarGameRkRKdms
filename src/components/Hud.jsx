import React from 'react';

const fmt = n => '₩' + n.toLocaleString('ko-KR');

const Hud = ({ state, handlers }) => {
  return (
    <div className="hud">
      <div className="left">
        <span className="tag">자본: <span className="money">{fmt(state.money)}</span></span>
        <span className="tag">일차: <b>{state.day}</b>/30</span>
        <span className="tag">콜라 재고: <b>{state.inventory.cola}</b>잔</span>
        <span className="tag">가니쉬(올리브): <b>{state.inventory.olive}</b>개</span>
        <span className="tag">민트: <b>{state.inventory.mint}</b>잎</span>
      </div>
      <div className="center">BAR TYCOON — Rhythm + Puzzle</div>
      <div className="right">
        <button className="btn" onClick={handlers.cleanBar}>매장 청소 (+₩1,000)</button>
        <button className="btn" onClick={handlers.endDay}>영업 종료</button>
      </div>
    </div>
  );
};

export default Hud;
