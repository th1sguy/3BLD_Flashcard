import type { Direction } from '../types';
import './PieceCard.css';

export interface PieceCardProps {
  mainColor: string;
  partners: { direction: Direction; color: string }[];
  stickerId?: string;
}

const MAIN_SIZE = 160;
const STRIP = 34;

export function PieceCard({ mainColor, partners, stickerId }: PieceCardProps) {
  const byDirection = (d: Direction) => partners.find((p) => p.direction === d);
  const top = byDirection('up');
  const right = byDirection('right');
  const bottom = byDirection('down');
  const left = byDirection('left');

  return (
    <div
      className="piece-card"
      data-sticker-id={stickerId}
      style={{
        gridTemplateColumns: `${STRIP}px ${MAIN_SIZE}px ${STRIP}px`,
        gridTemplateRows: `${STRIP}px ${MAIN_SIZE}px ${STRIP}px`,
      }}
    >
      {top && <div className="piece-strip piece-strip--top" style={{ background: top.color }} />}
      {right && (
        <div className="piece-strip piece-strip--right" style={{ background: right.color }} />
      )}
      {bottom && (
        <div className="piece-strip piece-strip--bottom" style={{ background: bottom.color }} />
      )}
      {left && (
        <div className="piece-strip piece-strip--left" style={{ background: left.color }} />
      )}
      <div className="piece-main" style={{ background: mainColor }} />
    </div>
  );
}
