import { useEffect, useState } from 'react';
import { DEFAULT_COLOR_SCHEME } from '../data/colorSchemes';
import { CORNER_STICKERS, EDGE_STICKERS } from '../data/layout';
import { DEFAULT_CORNER_SCHEME, DEFAULT_EDGE_SCHEME } from '../data/speffz';
import type { BufferConfig, ColorScheme, LetterScheme } from '../types';

export interface AppConfig {
  colorScheme: ColorScheme;
  cornerLetters: LetterScheme;
  edgeLetters: LetterScheme;
  buffer: BufferConfig;
}

const STORAGE_KEY = 'bld-flashcard-config';

function defaultConfig(): AppConfig {
  return {
    colorScheme: DEFAULT_COLOR_SCHEME,
    cornerLetters: DEFAULT_CORNER_SCHEME,
    edgeLetters: DEFAULT_EDGE_SCHEME,
    buffer: {
      cornerStickerId: CORNER_STICKERS[0].id,
      edgeStickerId: EDGE_STICKERS[0].id,
    },
  };
}

function loadConfig(): AppConfig {
  const defaults = defaultConfig();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw) as Partial<AppConfig>;
    return {
      colorScheme: { ...defaults.colorScheme, ...parsed.colorScheme },
      cornerLetters: { ...defaults.cornerLetters, ...parsed.cornerLetters },
      edgeLetters: { ...defaults.edgeLetters, ...parsed.edgeLetters },
      buffer: { ...defaults.buffer, ...parsed.buffer },
    };
  } catch {
    return defaults;
  }
}

export function useAppConfig() {
  const [config, setConfig] = useState<AppConfig>(loadConfig);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [config]);

  return [config, setConfig] as const;
}
