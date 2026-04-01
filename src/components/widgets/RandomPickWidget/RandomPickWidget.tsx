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

  const pick = () => {
    if (spinning) return;
    setHidden(false);
    setSpinning(true);

    let pool = perPlayer ? items.filter((i) => !used.includes(i)) : items;

    if (pool.length === 0) {
      pool = items;
      setUsed([]);
    }

    let ticks = 0;
    const maxTicks = 10;
    let lastPicked = pool[Math.floor(Math.random() * pool.length)];

    const interval = setInterval(() => {
      lastPicked = pool[Math.floor(Math.random() * pool.length)];
      setResult(lastPicked);
      ticks++;
      if (ticks >= maxTicks) {
        clearInterval(interval);
        setResult(lastPicked);
        if (perPlayer) setUsed((prev) => [...prev, lastPicked]);
        setSpinning(false);
      }
    }, 80);
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
              onClick={() => setPlayerCount(n)}
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
        {perPlayer ? ` (${used.length}/${items.length})` : ''}
      </p>

      {/* Result box */}
      {!hidden && (
        <div
          className={`${styles.resultBox} ${spinning ? styles.spinning : ''} ${result ? styles.hasResult : ''}`}
        >
          {result ? (
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
            {spinning ? '...' : buttonLabel}
          </button>
        )}

        {result && !spinning && !hidden && (
          <>
            {hideAfterPick && (
              <button className={styles.hideButton} onClick={() => setHidden(true)}>
                Скрыть
              </button>
            )}
            {hidden === false && (
              <button className={styles.button} onClick={pick}>
                {perPlayer ? 'Следующий' : buttonLabel}
              </button>
            )}
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
          Получили: {used.length} / {items.length}
        </p>
      )}
    </div>
  );
}
