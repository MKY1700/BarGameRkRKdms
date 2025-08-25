import React, { useEffect, useRef, useState } from 'react';

const LANES = ['D', 'F', 'J', 'K'];
const BPM = 110;
const NOTE_FALL_DURATION = 1400; // ms

const RhythmOverlay = ({ state, handlers }) => {
  const [scores, setScores] = useState({ good: 0, bad: 0 });
  const [progress, setProgress] = useState(0);
  const laneRefs = {
    D: useRef(null),
    F: useRef(null),
    J: useRef(null),
    K: useRef(null),
  };
  const gameRunning = useRef(true);

  useEffect(() => {
    gameRunning.current = true;
    const sequence = state.rhythmState.seq;
    let noteIndex = 0;

    const spawnNote = (key) => {
      const laneEl = laneRefs[key].current;
      if (!laneEl) return;

      const noteEl = document.createElement('div');
      noteEl.className = 'note';
      laneEl.appendChild(noteEl);

      const start = performance.now();
      const tick = () => {
        const elapsed = performance.now() - start;
        const p = Math.min(1, elapsed / NOTE_FALL_DURATION);
        noteEl.style.top = (p * (180 - 16)) + 'px';

        if (p < 1 && gameRunning.current) {
          requestAnimationFrame(tick);
        } else if (gameRunning.current) {
          // A note reached the bottom without being hit. It's a miss.
          if (noteEl.parentElement) {
            setScores(s => ({ ...s, bad: s.bad + 1 }));
            noteEl.remove();
          }
        }
      };
      requestAnimationFrame(tick);
    };

    const beatMs = Math.round(60000 / BPM);
    const spawnTimer = setInterval(() => {
      if (noteIndex < sequence.length) {
        spawnNote(sequence[noteIndex]);
        noteIndex++;
        setProgress(Math.min(100, (noteIndex / sequence.length) * 100));
      } else {
        clearInterval(spawnTimer);
        setTimeout(() => {
          if (gameRunning.current) handlers.endRhythm(scores.good, scores.bad);
        }, NOTE_FALL_DURATION);
      }
    }, beatMs);

    const onKey = (e) => {
      const key = e.key.toUpperCase();
      if (!LANES.includes(key)) return;

      const laneEl = laneRefs[key].current;
      const notes = Array.from(laneEl.querySelectorAll('.note'));
      let hit = false;
      notes.forEach(n => {
        const top = parseFloat(n.style.top || '0');
        if (Math.abs(top - 150) < 20 && !hit) {
          hit = true;
          n.remove();
        }
      });

      setScores(s => hit ? { ...s, good: s.good + 1 } : { ...s, bad: s.bad + 1 });
    };

    window.addEventListener('keydown', onKey);

    return () => {
      gameRunning.current = false;
      window.removeEventListener('keydown', onKey);
      clearInterval(spawnTimer);
    };
  }, [state.rhythmState.seq, handlers]);

  const handleCancel = () => {
    gameRunning.current = false;
    handlers.cancelRhythm();
  };

  return (
    <div className="overlay active">
      <div className="rhythm">
        <h2>셰이킹 리듬게임 (D / F / J / K)</h2>
        <div className="tiny muted">정확도에 따라 칵테일 품질이 달라집니다.</div>
        <div className="progress" style={{ margin: '.5rem 0 .75rem' }}>
          <div style={{ width: `${progress}%` }}></div>
        </div>
        <div className="lanes">
          {LANES.map(key => (
            <div key={key} className="lane" ref={laneRefs[key]}>
              <div className="hitline"></div>
            </div>
          ))}
        </div>
        <div className="row" style={{ marginTop: '.5rem', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>성공: <b>{scores.good}</b> / 실패: <b>{scores.bad}</b></div>
          <div className="key">키: D • F • J • K</div>
          <button className="btn" onClick={handleCancel}>취소</button>
        </div>
      </div>
    </div>
  );
};

export default RhythmOverlay;
