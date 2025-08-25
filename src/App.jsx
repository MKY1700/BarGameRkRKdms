import React from 'react';
import Hud from './components/Hud';
import Scene from './components/Scene';
import RightPanel from './components/RightPanel';
import RhythmOverlay from './components/RhythmOverlay';
import Toast from './components/Toast';
import { useGameLogic } from './hooks/useGameLogic';
import BottomPanel from './components/BottomPanel';

function App() {
  const game = useGameLogic();

  return (
    <>
      <Hud state={game.state} handlers={game.handlers} />
      <div className="main-content">
        <Scene state={game.state} handlers={game.handlers} />
        <RightPanel state={game.state} handlers={game.handlers} />
        <BottomPanel state={game.state} handlers={game.handlers} />
      </div>
      {game.state.rhythmState && (
        <RhythmOverlay state={game.state} handlers={game.handlers} />
      )}
      {game.state.toast && <Toast message={game.state.toast} />}
    </>
  );
}

export default App;
