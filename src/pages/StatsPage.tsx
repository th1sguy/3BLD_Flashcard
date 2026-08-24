import { useMemo, useState } from 'react';
import { CubeNet } from '../components/CubeNet';
import { ALL_STICKERS } from '../data/layout';
import type { AppConfig } from '../state/config';
import type { AnswerRecord } from '../state/history';
import './StatsPage.css';

export interface StatsPageProps {
  config: AppConfig;
  history: AnswerRecord[];
  onClear: () => void;
}

type HeatMode = 'accuracy' | 'speed';

interface StickerStats {
  attempts: number;
  correct: number;
  totalMs: number;
}

function heatColor(ratio: number): string {
  const hue = Math.max(0, Math.min(1, ratio)) * 120;
  return `hsl(${hue}, 70%, 55%)`;
}

export function StatsPage({ config, history, onClear }: StatsPageProps) {
  const [heatMode, setHeatMode] = useState<HeatMode>('accuracy');

  const perSticker = useMemo(() => {
    const map = new Map<string, StickerStats>();
    for (const r of history) {
      const entry = map.get(r.stickerId) ?? { attempts: 0, correct: 0, totalMs: 0 };
      entry.attempts += 1;
      entry.correct += r.correct ? 1 : 0;
      entry.totalMs += r.elapsedMs;
      map.set(r.stickerId, entry);
    }
    return map;
  }, [history]);

  const totalAttempts = history.length;
  const totalCorrect = history.filter((r) => r.correct).length;
  const overallAccuracy = totalAttempts > 0 ? (totalCorrect / totalAttempts) * 100 : 0;
  const overallAvgMs =
    totalAttempts > 0 ? history.reduce((a, r) => a + r.elapsedMs, 0) / totalAttempts : 0;

  const colorOverrides = useMemo(() => {
    const speedAverages = [...perSticker.values()].map((e) => e.totalMs / e.attempts);
    const minMs = speedAverages.length ? Math.min(...speedAverages) : 0;
    const maxMs = speedAverages.length ? Math.max(...speedAverages) : 1;
    const range = maxMs - minMs || 1;

    const overrides: Record<string, string> = {};
    for (const sticker of ALL_STICKERS) {
      const entry = perSticker.get(sticker.id);
      if (!entry) {
        overrides[sticker.id] = '#e5e7eb';
        continue;
      }
      if (heatMode === 'accuracy') {
        overrides[sticker.id] = heatColor(entry.correct / entry.attempts);
      } else {
        const avg = entry.totalMs / entry.attempts;
        overrides[sticker.id] = heatColor(1 - (avg - minMs) / range);
      }
    }
    return overrides;
  }, [perSticker, heatMode]);

  const letterScheme = { ...config.cornerLetters, ...config.edgeLetters };

  const weakest = [...perSticker.entries()]
    .filter(([, e]) => e.attempts >= 3)
    .map(([id, e]) => ({
      id,
      letter: letterScheme[id] ?? '',
      type: id.startsWith('corner') ? 'Corner' : 'Edge',
      accuracy: (e.correct / e.attempts) * 100,
      avgMs: e.totalMs / e.attempts,
      attempts: e.attempts,
    }))
    .sort((a, b) => a.accuracy - b.accuracy || b.avgMs - a.avgMs)
    .slice(0, 8);

  function handleClear() {
    if (window.confirm('Clear all flashcard history? This cannot be undone.')) {
      onClear();
    }
  }

  return (
    <div className="stats-page">
      <div className="stats-summary">
        <div className="stat-card">
          <span className="stat-value">{totalAttempts}</span>
          <span className="stat-label">Attempts</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{totalAttempts ? overallAccuracy.toFixed(0) : '–'}%</span>
          <span className="stat-label">Accuracy</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">
            {totalAttempts ? (overallAvgMs / 1000).toFixed(2) : '–'}s
          </span>
          <span className="stat-label">Avg time</span>
        </div>
      </div>

      <div className="mode-toggle">
        <button
          type="button"
          className={heatMode === 'accuracy' ? 'active' : ''}
          onClick={() => setHeatMode('accuracy')}
        >
          Accuracy heatmap
        </button>
        <button
          type="button"
          className={heatMode === 'speed' ? 'active' : ''}
          onClick={() => setHeatMode('speed')}
        >
          Speed heatmap
        </button>
      </div>

      <CubeNet
        colorScheme={config.colorScheme}
        letterScheme={letterScheme}
        colorOverrides={colorOverrides}
        centerColor="#e5e7eb"
      />

      <h3>Needs work</h3>
      {weakest.length === 0 ? (
        <p className="hint">Answer at least 3 flashcards for a sticker to see it ranked here.</p>
      ) : (
        <table className="weak-table">
          <thead>
            <tr>
              <th>Letter</th>
              <th>Type</th>
              <th>Accuracy</th>
              <th>Avg time</th>
              <th>Attempts</th>
            </tr>
          </thead>
          <tbody>
            {weakest.map((w) => (
              <tr key={w.id}>
                <td>{w.letter}</td>
                <td>{w.type}</td>
                <td>{w.accuracy.toFixed(0)}%</td>
                <td>{(w.avgMs / 1000).toFixed(2)}s</td>
                <td>{w.attempts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button type="button" className="clear-button" onClick={handleClear}>
        Clear history
      </button>
    </div>
  );
}
