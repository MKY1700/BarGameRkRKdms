import React from 'react';

const RightPanel = ({ state, handlers }) => {
  return (
    <div className="right-panel">
      <div>
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>주문 대기열</h3>
          <button className="btn" onClick={handlers.spawnOrder}>손님 생성</button>
        </div>
      </div>
      <div className="orders">
        {state.orders.map(o => (
          <div key={o.id} className="order">
            <b>{o.name}</b> <span className="muted tiny">(#{o.id.substring(0, 6)})</span><br />
            <span className="tiny muted">남은 시간: {o.ttl}s</span>
            <br />
            <button className="btn" onClick={() => handlers.tryServe(o.id)}>제공</button>
          </div>
        ))}
      </div>

      <div className="shop">
        <h3>매입 상점</h3>
        <div className="tiny muted">증류주: 5잔 ₩10,000 / 15잔 ₩25,000<br />리큐르·주스: 5잔 ₩5,000 / 15잔 ₩15,000<br />가니쉬(10개): ₩3,000<br />전통주: 손님 혜택으로만 획득 (3잔 고정)</div>
        <div className="row" style={{ marginTop: '.5rem', flexWrap: 'wrap', gap: '.35rem' }}>
          <button className="btn" onClick={() => handlers.buy('vodka', 5)}>보드카 ×5</button>
          <button className="btn" onClick={() => handlers.buy('vodka', 15)}>보드카 ×15</button>
          <button className="btn" onClick={() => handlers.buy('gin', 5)}>드라이 진 ×5</button>
          <button className="btn" onClick={() => handlers.buy('gin', 15)}>드라이 진 ×15</button>
          <button className="btn" onClick={() => handlers.buy('jack', 5)}>잭다니엘 ×5</button>
          <button className="btn" onClick={() => handlers.buy('jack', 15)}>잭다니엘 ×15</button>
          <button className="btn" onClick={() => handlers.buy('amaretto', 5)}>아마레또 ×5</button>
          <button className="btn" onClick={() => handlers.buy('amaretto', 15)}>아마레또 ×15</button>
          <button className="btn" onClick={() => handlers.buy('vermouth', 5)}>드라이 베르무트 ×5</button>
          <button className="btn" onClick={() => handlers.buy('vermouth', 15)}>드라이 베르무트 ×15</button>
          <button className="btn" onClick={() => handlers.buy('cola', 5)}>콜라 ×5</button>
          <button className="btn" onClick={() => handlers.buy('cola', 15)}>콜라 ×15</button>
          <button className="btn" onClick={() => handlers.buy('olive', 10)}>그린 올리브 ×10</button>
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
