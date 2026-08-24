import { useEffect, useState } from 'react';
import type { PieceType } from '../types';

export interface AnswerRecord {
  stickerId: string;
  type: PieceType;
  correct: boolean;
  elapsedMs: number;
  isBuffer: boolean;
  timestamp: number;
}

const STORAGE_KEY = 'bld-flashcard-history';
const MAX_RECORDS = 5000;

function loadHistory(): AnswerRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as AnswerRecord[]) : [];
  } catch {
    return [];
  }
}

export function useAnswerHistory() {
  const [history, setHistory] = useState<AnswerRecord[]>(loadHistory);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  function appendRecord(record: AnswerRecord) {
    setHistory((h) => [...h, record].slice(-MAX_RECORDS));
  }

  function clearHistory() {
    setHistory([]);
  }

  return { history, appendRecord, clearHistory };
}
