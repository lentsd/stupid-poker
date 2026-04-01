import { useState } from 'react';
import styles from './RandomPickWidget.module.css';

interface RandomPickWidgetProps {
  items: string[];
  label?: string;
  buttonLabel?: string;
  emoji?: string;
  /** Each click gives a unique item until all are used, then resets */
  perPlayer?: boolean;
  /** Hide result after viewing (for secret assignments) */
  hideAfterPick?: boolean;
  /** If true, show a player count selector before picking */
  needsPlayerCount?: boolean;
}

export function RandomPickWidget({
  items,
  label = 'Случайный выбор',
  buttonLabel = 'Выбрать',
  emoji = '🎲',
  perPlayer = false,
  hideAfterPick = false,
  needsPlayerCount = false,
}: RandomPickWidgetProps) {
  const [result, setResult] = useState<string | null>(null);
  const [hidden, setHidden] = useState(false);
  const [used, setUsed] = useState<string[]>([]);
  const [spinning, setSpinning] = useState(false);
  const [playerCount, setPlayerCount] = useState<number>(4);
  const [countSet, setCountSet] = useState(!needsPlayerCount);

  // When needsPlayerCount, limit the available items to playerCount
  const effectiveItems = needsPlayerCount ? items.slice(0, playerCount) : items;

  const handleSetPlayerCount = (n: number) => {
    setPlayerCount(n);
    // Reset state when player count changes
    setUsed([]);
    setResult(null);
    setHidden(false);
  };

  const pick = () => {
    if (spinning) return;
    setHidden(false);
    setSpinning(true);

    let pool = perPlayer ? effectiveItems.filter((i) => !used.includes(i)) : effectiveItems;

    if (pool.length === 0) {
      pool = effectiveItems;
      setUsed([]);
    }

    // Animation: 3 seconds total, 30 ticks at ~100ms each
    const totalDuration = 3000;
    const tickInterval = 100;
    const maxTicks = Math.floor(totalDuration / tickInterval);
    let ticks = 0;
    // Pick the final result upfront so we never show it during animation
    const finalResult = pool[Math.floor(Math.random() * pool.length)];

    const interval = setInterval(() => {
      ticks++;
      if (ticks >= maxTicks) {
        clearInterval(interval);
        setResult(finalResult);
        if (perPlayer) setUsed((prev) => [...prev, finalResult]);
        setSpinning(false);
      }
      // Don't update result during spinning — show spinner in UI instead
    }, tickInterval);
  };

  const reset = () => {
    setResult(null);
    setUsed([]);
    setHidden(false);
  };

  if (!countSet) {
    return (
      <div className={styles.wrapper}>
        <p className={styles.label}>Сколько игроков?</p>
        <div className={styles.playerCountRow}>
          {[2, 3, 4, 5, 6, 7, 8].map((n) => (
            <button
              key={n}
              className={`${styles.countBtn} ${playerCount === n ? styles.countBtnActive : ''}`}
              onClick={() => handleSetPlayerCount(n)}
            >
              {n}
            </button>
          ))}
        </div>
        <button className={styles.button} onClick={() => setCountSet(true)}>
          Готово
        </button>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <p className={styles.label}>
        {label}
        {perPlayer ? ` (${used.length}/${needsPlayerCount ? playerCount : items.length})` : ''}
      </p>

      {/* Result box */}
      {!hidden && (
        <div
          className={`${styles.resultBox} ${spinning ? styles.spinning : ''} ${result && !spinning ? styles.hasResult : ''}`}
        >
          {spinning ? (
            <span className={styles.spinnerDots}>
              <span />
              <span />
              <span />
            </span>
          ) : result ? (
            <span className={styles.resultText}>{result}</span>
          ) : (
            <span className={styles.placeholder}>{emoji}</span>
          )}
        </div>
      )}

      {hidden && (
        <div className={styles.hiddenBox}>
          <span className={styles.hiddenIcon}>🙈</span>
          <span className={styles.hiddenText}>Скрыто</span>
        </div>
      )}

      {/* Actions */}
      <div className={styles.actions}>
        {(!result || spinning) && (
          <button className={styles.button} onClick={pick} disabled={spinning}>
            {spinning ? 'Выбираем...' : buttonLabel}
          </button>
        )}

        {result && !spinning && !hidden && (
          <>
            {hideAfterPick && (
              <button className={styles.hideButton} onClick={() => setHidden(true)}>
                Скрыть
              </button>
            )}
            <button className={styles.button} onClick={pick}>
              {perPlayer ? 'Следующий' : buttonLabel}
            </button>
            <button className={styles.resetButton} onClick={reset} aria-label="Сбросить">
              ↺
            </button>
          </>
        )}

        {hidden && (
          <button className={styles.button} onClick={pick}>
            {perPlayer ? 'Следующий' : buttonLabel}
          </button>
        )}
      </div>

      {perPlayer && used.length > 0 && !spinning && (
        <p className={styles.hint}>
          Получили: {used.length} / {needsPlayerCount ? playerCount : items.length}
        </p>
      )}
    </div>
  );
}
