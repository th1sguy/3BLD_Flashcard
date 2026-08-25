import { useState } from 'react';
import './App.css';
import { FlashcardPage } from './pages/FlashcardPage';
import { GuidePage } from './pages/GuidePage';
import { SetupPage } from './pages/SetupPage';
import { StatsPage } from './pages/StatsPage';
import { useAppConfig } from './state/config';
import { useAnswerHistory } from './state/history';

type Mode = 'setup' | 'flashcards' | 'stats' | 'guide';

function App() {
  const [mode, setMode] = useState<Mode>('setup');
  const [config, setConfig] = useAppConfig();
  const { history, appendRecord, clearHistory } = useAnswerHistory();

  return (
    <div className="app">
      <h1>BLD Flashcard</h1>

      <nav className="mode-nav">
        <button
          type="button"
          className={mode === 'setup' ? 'active' : ''}
          onClick={() => setMode('setup')}
        >
          Setup
        </button>
        <button
          type="button"
          className={mode === 'flashcards' ? 'active' : ''}
          onClick={() => setMode('flashcards')}
        >
          Flashcards
        </button>
        <button
          type="button"
          className={mode === 'stats' ? 'active' : ''}
          onClick={() => setMode('stats')}
        >
          Stats
        </button>
        <button
          type="button"
          className={mode === 'guide' ? 'active' : ''}
          onClick={() => setMode('guide')}
        >
          Guide
        </button>
      </nav>

      {mode === 'setup' && <SetupPage config={config} onChange={setConfig} />}
      {mode === 'flashcards' && <FlashcardPage config={config} onAnswer={appendRecord} />}
      {mode === 'stats' && (
        <StatsPage config={config} history={history} onClear={clearHistory} />
      )}
      {mode === 'guide' && <GuidePage />}
    </div>
  );
}

export default App;
