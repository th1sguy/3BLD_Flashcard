import { useEffect, useMemo, useRef, useState } from 'react';
import { PieceCard } from '../components/PieceCard';
import { ALL_STICKERS } from '../data/layout';
import { getPartners } from '../data/pieceGeometry';
import type { AppConfig } from '../state/config';
import type { AnswerRecord } from '../state/history';
import type { StickerPos } from '../types';
import './FlashcardPage.css';

export interface FlashcardPageProps {
  config: AppConfig;
  onAnswer: (record: AnswerRecord) => void;
}

type Phase = 'asking' | 'feedback';

function pickSticker(pool: StickerPos[], avoidId?: string): StickerPos {
  if (pool.length === 1) return pool[0];
  let candidate: StickerPos;
  do {
    candidate = pool[Math.floor(Math.random() * pool.length)];
  } while (candidate.id === avoidId);
  return candidate;
}

export function FlashcardPage({ config, onAnswer }: FlashcardPageProps) {
  const [includeCorners, setIncludeCorners] = useState(true);
  const [includeEdges, setIncludeEdges] = useState(true);
  const [current, setCurrent] = useState<StickerPos | undefined>(undefined);
  const [phase, setPhase] = useState<Phase>('asking');
  const [answer, setAnswer] = useState('');
  const [wasCorrect, setWasCorrect] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [times, setTimes] = useState<number[]>([]);
  const [lastElapsedMs, setLastElapsedMs] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const askStartRef = useRef(0);

  const pool = useMemo(
    () =>
      ALL_STICKERS.filter(
        (s) => (s.type === 'corner' && includeCorners) || (s.type === 'edge' && includeEdges),
      ),
    [includeCorners, includeEdges],
  );

  function startNewSession() {
    setScore({ correct: 0, total: 0 });
    setTimes([]);
    setLastElapsedMs(null);
    setCurrent(pool.length > 0 ? pickSticker(pool) : undefined);
    setPhase('asking');
    setAnswer('');
    askStartRef.current = performance.now();
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(startNewSession, [includeCorners, includeEdges]);

  useEffect(() => {
    if (phase === 'asking') inputRef.current?.focus();
    else nextButtonRef.current?.focus();
  }, [phase, current]);

  function correctLetterFor(sticker: StickerPos): string {
    const scheme = sticker.type === 'corner' ? config.cornerLetters : config.edgeLetters;
    return scheme[sticker.id] ?? '';
  }

  function isBuffer(sticker: StickerPos): boolean {
    return (
      sticker.id === config.buffer.cornerStickerId || sticker.id === config.buffer.edgeStickerId
    );
  }

  function handleSubmit(value: string) {
    if (!current || phase !== 'asking') return;
    const elapsedMs = performance.now() - askStartRef.current;
    const isSpaceAnswer = value === ' ';
    const correct = isSpaceAnswer
      ? isBuffer(current)
      : value.toUpperCase() === correctLetterFor(current).toUpperCase();
    setAnswer(isSpaceAnswer ? 'SPC' : value.toUpperCase());
    setWasCorrect(correct);
    setScore((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
    setTimes((t) => [...t, elapsedMs]);
    setLastElapsedMs(elapsedMs);
    setPhase('feedback');
    onAnswer({
      stickerId: current.id,
      type: current.type,
      correct,
      elapsedMs,
      isBuffer: isBuffer(current),
      timestamp: Date.now(),
    });
  }

  function handleNext() {
    setCurrent(pickSticker(pool, current?.id));
    setPhase('asking');
    setAnswer('');
    askStartRef.current = performance.now();
  }

  function toggleCorners(checked: boolean) {
    if (!checked && !includeEdges) return;
    setIncludeCorners(checked);
  }

  function toggleEdges(checked: boolean) {
    if (!checked && !includeCorners) return;
    setIncludeEdges(checked);
  }

  return (
    <div className="flashcard-page">
      <div className="filters">
        <label>
          <input
            type="checkbox"
            checked={includeCorners}
            onChange={(e) => toggleCorners(e.target.checked)}
          />
          Corners
        </label>
        <label>
          <input
            type="checkbox"
            checked={includeEdges}
            onChange={(e) => toggleEdges(e.target.checked)}
          />
          Edges
        </label>
        <button type="button" onClick={startNewSession}>
          Reset session
        </button>
      </div>

      <p className="score">
        Score: {score.correct} / {score.total}
        {times.length > 0 && (
          <> · Avg: {(times.reduce((a, b) => a + b, 0) / times.length / 1000).toFixed(2)}s</>
        )}
      </p>

      {current ? (
        <>
          <PieceCard
            stickerId={current.id}
            mainColor={config.colorScheme[current.face]}
            partners={getPartners(current).map((p) => ({
              direction: p.direction,
              color: config.colorScheme[p.face],
            }))}
          />

          <div className="answer-form">
            <input
              ref={inputRef}
              value={answer}
              maxLength={1}
              disabled={phase === 'feedback'}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '') {
                  setAnswer(value);
                  return;
                }
                if (value === ' ' || /^[a-zA-Z]$/.test(value)) {
                  handleSubmit(value);
                  return;
                }
                setAnswer('');
              }}
              autoFocus
            />
          </div>

          {phase === 'feedback' && (
            <div className={`feedback ${wasCorrect ? 'feedback--correct' : 'feedback--wrong'}`}>
              <p>
                {wasCorrect ? 'Correct!' : `Incorrect — it was ${correctLetterFor(current)}`}
                {lastElapsedMs !== null && ` (${(lastElapsedMs / 1000).toFixed(2)}s)`}
                {isBuffer(current) && <span className="buffer-note"> (this was your buffer)</span>}
              </p>
              <button type="button" ref={nextButtonRef} onClick={handleNext}>
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <p>Select at least one piece type to start.</p>
      )}
    </div>
  );
}
