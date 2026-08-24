import { ALL_STICKERS } from '../data/layout';
import { FACE_NET_ORIGIN } from '../data/layout';
import type { ColorScheme, LetterScheme, StickerPos } from '../types';
import './CubeNet.css';

export interface CubeNetProps {
  colorScheme: ColorScheme;
  letterScheme?: LetterScheme;
  /** Sticker id -> content shown instead of the letter (e.g. "?" while quizzing). */
  overrideLabel?: Record<string, string>;
  highlightedId?: string;
  bufferIds?: string[];
  /** Sticker id -> background color, overriding the color-scheme fill (e.g. a stats heatmap). */
  colorOverrides?: Record<string, string>;
  /** Overrides the 6 decorative face-center fills, e.g. to neutralize them behind a heatmap. */
  centerColor?: string;
  onStickerClick?: (sticker: StickerPos) => void;
}

const CELL_SIZE = 44;
const GAP = 2;
const FACE_SIZE = CELL_SIZE * 3 + GAP * 2;

export function CubeNet({
  colorScheme,
  letterScheme,
  overrideLabel,
  highlightedId,
  bufferIds,
  colorOverrides,
  centerColor,
  onStickerClick,
}: CubeNetProps) {
  const netWidth = FACE_SIZE * 4 + GAP * 3;
  const netHeight = FACE_SIZE * 3 + GAP * 2;

  return (
    <div className="cube-net" style={{ width: netWidth, height: netHeight }}>
      {ALL_STICKERS.map((sticker) => {
        const origin = FACE_NET_ORIGIN[sticker.face];
        const left = origin.col * (FACE_SIZE + GAP) + sticker.col * (CELL_SIZE + GAP);
        const top = origin.row * (FACE_SIZE + GAP) + sticker.row * (CELL_SIZE + GAP);
        const label = overrideLabel?.[sticker.id] ?? letterScheme?.[sticker.id] ?? '';
        const isHighlighted = sticker.id === highlightedId;
        const isBuffer = bufferIds?.includes(sticker.id) ?? false;

        return (
          <button
            key={sticker.id}
            type="button"
            data-sticker-id={sticker.id}
            className={`cube-sticker cube-sticker--${sticker.type}${isHighlighted ? ' cube-sticker--highlighted' : ''}${isBuffer ? ' cube-sticker--buffer' : ''}`}
            style={{
              left,
              top,
              width: CELL_SIZE,
              height: CELL_SIZE,
              backgroundColor: colorOverrides?.[sticker.id] ?? colorScheme[sticker.face],
            }}
            onClick={() => onStickerClick?.(sticker)}
            disabled={!onStickerClick}
          >
            {label}
          </button>
        );
      })}
      {(['U', 'L', 'F', 'R', 'B', 'D'] as const).map((face) => {
        const origin = FACE_NET_ORIGIN[face];
        return (
          <div
            key={face}
            className="cube-net__center"
            style={{
              left: origin.col * (FACE_SIZE + GAP) + (CELL_SIZE + GAP),
              top: origin.row * (FACE_SIZE + GAP) + (CELL_SIZE + GAP),
              width: CELL_SIZE,
              height: CELL_SIZE,
              backgroundColor: centerColor ?? colorScheme[face],
            }}
          />
        );
      })}
    </div>
  );
}
