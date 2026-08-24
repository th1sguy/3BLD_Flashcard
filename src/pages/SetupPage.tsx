import { useState } from 'react';
import { CubeNet } from '../components/CubeNet';
import { COLOR_SCHEME_PRESETS } from '../data/colorSchemes';
import { ALL_STICKERS } from '../data/layout';
import type { AppConfig } from '../state/config';
import type { Face, StickerPos } from '../types';
import './SetupPage.css';

const FACES: Face[] = ['U', 'L', 'F', 'R', 'B', 'D'];

type InteractionMode = 'edit-letters' | 'corner-buffer' | 'edge-buffer';

export interface SetupPageProps {
  config: AppConfig;
  onChange: (updater: (config: AppConfig) => AppConfig) => void;
}

export function SetupPage({ config, onChange }: SetupPageProps) {
  const [mode, setMode] = useState<InteractionMode>('edit-letters');
  const [selectedStickerId, setSelectedStickerId] = useState<string | undefined>(undefined);
  const [letterDraft, setLetterDraft] = useState('');

  const matchingPreset = COLOR_SCHEME_PRESETS.find((p) =>
    FACES.every((f) => p.scheme[f] === config.colorScheme[f]),
  );
  const presetValue = matchingPreset?.id ?? 'custom';

  function handlePresetChange(id: string) {
    if (id === 'custom') return;
    const preset = COLOR_SCHEME_PRESETS.find((p) => p.id === id);
    if (!preset) return;
    onChange((c) => ({ ...c, colorScheme: preset.scheme }));
  }

  function handleFaceColorChange(face: Face, color: string) {
    onChange((c) => ({ ...c, colorScheme: { ...c.colorScheme, [face]: color } }));
  }

  const letterScheme = { ...config.cornerLetters, ...config.edgeLetters };

  function handleStickerClick(sticker: StickerPos) {
    if (mode === 'corner-buffer') {
      if (sticker.type !== 'corner') return;
      onChange((c) => ({ ...c, buffer: { ...c.buffer, cornerStickerId: sticker.id } }));
      return;
    }
    if (mode === 'edge-buffer') {
      if (sticker.type !== 'edge') return;
      onChange((c) => ({ ...c, buffer: { ...c.buffer, edgeStickerId: sticker.id } }));
      return;
    }
    setSelectedStickerId(sticker.id);
    setLetterDraft(letterScheme[sticker.id] ?? '');
  }

  function saveLetterDraft() {
    if (!selectedStickerId) return;
    const letter = letterDraft.trim().toUpperCase().slice(0, 1);
    if (!letter) return;
    const isCorner = selectedStickerId.startsWith('corner-');
    onChange((c) =>
      isCorner
        ? { ...c, cornerLetters: { ...c.cornerLetters, [selectedStickerId]: letter } }
        : { ...c, edgeLetters: { ...c.edgeLetters, [selectedStickerId]: letter } },
    );
  }

  const selectedSticker = ALL_STICKERS.find((s) => s.id === selectedStickerId);

  return (
    <div className="setup-page">
      <section>
        <h2>Color scheme</h2>
        <label>
          Preset:{' '}
          <select value={presetValue} onChange={(e) => handlePresetChange(e.target.value)}>
            {COLOR_SCHEME_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
            <option value="custom">Custom</option>
          </select>
        </label>
        <div className="face-color-grid">
          {FACES.map((face) => (
            <label key={face} className="face-color-swatch">
              {face}
              <input
                type="color"
                value={config.colorScheme[face]}
                onChange={(e) => handleFaceColorChange(face, e.target.value)}
              />
            </label>
          ))}
        </div>
      </section>

      <section>
        <h2>Letters &amp; buffers</h2>
        <div className="mode-toggle">
          <button
            type="button"
            className={mode === 'edit-letters' ? 'active' : ''}
            onClick={() => setMode('edit-letters')}
          >
            Edit letters
          </button>
          <button
            type="button"
            className={mode === 'corner-buffer' ? 'active' : ''}
            onClick={() => setMode('corner-buffer')}
          >
            Set corner buffer
          </button>
          <button
            type="button"
            className={mode === 'edge-buffer' ? 'active' : ''}
            onClick={() => setMode('edge-buffer')}
          >
            Set edge buffer
          </button>
        </div>

        <CubeNet
          colorScheme={config.colorScheme}
          letterScheme={letterScheme}
          highlightedId={selectedStickerId}
          bufferIds={[config.buffer.cornerStickerId, config.buffer.edgeStickerId]}
          onStickerClick={handleStickerClick}
        />

        {mode === 'edit-letters' &&
          (selectedSticker ? (
            <div className="letter-editor">
              <span>
                Editing {selectedSticker.type} sticker on {selectedSticker.face} face:
              </span>
              <input
                value={letterDraft}
                maxLength={1}
                onChange={(e) => setLetterDraft(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && saveLetterDraft()}
                autoFocus
              />
              <button type="button" onClick={saveLetterDraft}>
                Save
              </button>
            </div>
          ) : (
            <p className="hint">Click a sticker on the net to rename its letter.</p>
          ))}
        {mode !== 'edit-letters' && (
          <p className="hint">
            Click a {mode === 'corner-buffer' ? 'corner' : 'edge'} sticker on the net to set it as
            the buffer (marked with a dot).
          </p>
        )}
      </section>
    </div>
  );
}
