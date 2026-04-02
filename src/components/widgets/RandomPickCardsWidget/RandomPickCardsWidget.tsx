import { useMemo, useState } from 'react';
import styles from './RandomPickCardsWidget.module.css';

interface RandomPickCardsWidgetProps {
  items: string[];
  label?: string;
  emoji?: string;
}

function shuffle<T>(arr: T[], seed: number): T[] {
  // seed is used only to bust the useMemo cache on reset
  void seed;
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function RandomPickCardsWidget({
  items,
  label = 'Выбери карту',
  emoji = '🃏',
}: RandomPickCardsWidgetProps) {
  // Increment to force a re-shuffle
  const [shuffleSeed, setShuffleSeed] = useState(0);

  // Shuffle whenever seed changes
  const shuffled = useMemo(() => shuffle(items, shuffleSeed), [items, shuffleSeed]);

  // Set of indices that have been flipped
  const [flipped, setFlipped] = useState<Set<number>>(new Set());
  // Which card is currently "open" (showing its content in the modal)
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const handleCardClick = (idx: number) => {
    if (flipped.has(idx)) return; // already opened — can't pick again
    setFlipped((prev) => new Set(prev).add(idx));
    setOpenIdx(idx);
  };

  const handleClose = () => {
    setOpenIdx(null);
  };

  const handleReset = () => {
    setFlipped(new Set());
    setOpenIdx(null);
    setShuffleSeed((s) => s + 1); // triggers re-shuffle
  };

  const allFlipped = flipped.size === shuffled.length;

  return (
    <div className={styles.wrapper}>
      <p className={styles.label}>{label}</p>

      {/* Table with cards */}
      <div className={styles.table}>
        <div
          className={styles.cardsGrid}
          style={{ '--card-count': shuffled.length } as React.CSSProperties}
        >
          {shuffled.map((_, idx) => {
            const isFlipped = flipped.has(idx);
            return (
              <button
                key={idx}
                className={`${styles.card} ${isFlipped ? styles.cardFlipped : ''}`}
                onClick={() => handleCardClick(idx)}
                disabled={isFlipped}
                aria-label={isFlipped ? 'Карта уже открыта' : 'Открыть карту'}
              >
                <div className={styles.cardInner}>
                  {/* Back face */}
                  <div className={styles.cardBack}>
                    <span className={styles.cardBackEmoji}>{emoji}</span>
                  </div>
                  {/* Front face (shown after flip) */}
                  <div className={styles.cardFront}>
                    <span className={styles.cardFrontEmoji}>✓</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {allFlipped && (
        <div className={styles.allDoneRow}>
          <span className={styles.allDoneText}>Все карты открыты</span>
          <button
            className={styles.resetButton}
            onClick={handleReset}
            aria-label="Перемешать заново"
          >
            ↺ Перемешать
          </button>
        </div>
      )}

      {/* Modal overlay — shows the card content */}
      {openIdx !== null && (
        <div className={styles.overlay} onClick={handleClose}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalEmoji}>{emoji}</div>
            <p className={styles.modalText}>{shuffled[openIdx]}</p>
            <button className={styles.modalClose} onClick={handleClose}>
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
