import { useMemo, useState } from 'react';
import styles from './MafiaWidget.module.css';

// ── Role definitions ──────────────────────────────────────────────────────────

const SPECIAL_ROLES = [
  'Мафия — ночью подсматриваешь карты 1 соперника',
  'Проститутка — ночью забираешь фишку у любого игрока',
  'Шериф — ночью узнаёшь, кто из игроков мафия',
];
const PEACEFUL_ROLE = 'Мирный — просто терпишь';

/**
 * Всегда 3 спецроли (мафия + проститутка + шериф) + мирные до playerCount.
 * Если игроков меньше 3 — берём только нужное кол-во спецролей.
 */
function buildRoles(playerCount: number): string[] {
  const specials = SPECIAL_ROLES.slice(0, Math.min(playerCount, SPECIAL_ROLES.length));
  const peacefulCount = Math.max(0, playerCount - specials.length);
  const peaceful = Array(peacefulCount).fill(PEACEFUL_ROLE);
  return [...specials, ...peaceful];
}

// ── Shuffle ───────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[], seed: number): T[] {
  void seed;
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function MafiaWidget() {
  const [playerCount, setPlayerCount] = useState<number>(4);
  const [countSet, setCountSet] = useState(false);

  const [shuffleSeed, setShuffleSeed] = useState(0);
  const [flipped, setFlipped] = useState<Set<number>>(new Set());
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const roles = useMemo(() => buildRoles(playerCount), [playerCount]);
  const shuffled = useMemo(() => shuffle(roles, shuffleSeed), [roles, shuffleSeed]);

  const handleSelectCount = (n: number) => {
    setPlayerCount(n);
  };

  const handleConfirm = () => {
    setFlipped(new Set());
    setOpenIdx(null);
    setShuffleSeed((s) => s + 1);
    setCountSet(true);
  };

  const handleCardClick = (idx: number) => {
    if (flipped.has(idx)) return;
    setFlipped((prev) => new Set(prev).add(idx));
    setOpenIdx(idx);
  };

  const handleClose = () => setOpenIdx(null);

  const handleReset = () => {
    setFlipped(new Set());
    setOpenIdx(null);
    setShuffleSeed((s) => s + 1);
    setCountSet(false);
  };

  const allFlipped = countSet && flipped.size === shuffled.length;

  // ── Player count selector ──
  if (!countSet) {
    return (
      <div className={styles.wrapper}>
        <p className={styles.label}>Сколько игроков?</p>
        <div className={styles.playerCountRow}>
          {[3, 4, 5, 6, 7, 8].map((n) => (
            <button
              key={n}
              className={`${styles.countBtn} ${playerCount === n ? styles.countBtnActive : ''}`}
              onClick={() => handleSelectCount(n)}
            >
              {n}
            </button>
          ))}
        </div>
        <button className={styles.confirmButton} onClick={handleConfirm}>
          Раздать роли
        </button>
      </div>
    );
  }

  // ── Cards screen ──
  return (
    <div className={styles.wrapper}>
      <p className={styles.label}>Роль игрока</p>

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
                  <div className={styles.cardBack}>
                    <span className={styles.cardBackEmoji}>🃏</span>
                  </div>
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
          <span className={styles.allDoneText}>Все роли розданы</span>
          <button className={styles.resetButton} onClick={handleReset} aria-label="Начать заново">
            ↺ Заново
          </button>
        </div>
      )}

      {openIdx !== null && (
        <div className={styles.overlay} onClick={handleClose}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalEmoji}>🃏</div>
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
