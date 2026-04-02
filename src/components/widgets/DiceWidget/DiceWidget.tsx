import { useState } from 'react';
import styles from './DiceWidget.module.css';

interface DiceWidgetProps {
  sides?: number;
  min?: number;
  label?: string;
}

const diceDots: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [
    [25, 25],
    [75, 75],
  ],
  3: [
    [25, 25],
    [50, 50],
    [75, 75],
  ],
  4: [
    [25, 25],
    [75, 25],
    [25, 75],
    [75, 75],
  ],
  5: [
    [25, 25],
    [75, 25],
    [50, 50],
    [25, 75],
    [75, 75],
  ],
  6: [
    [25, 25],
    [75, 25],
    [25, 50],
    [75, 50],
    [25, 75],
    [75, 75],
  ],
};

export function DiceWidget({ sides = 6, min = 1, label = 'Бросок кубика' }: DiceWidgetProps) {
  const [value, setValue] = useState<number | null>(null);
  const [rolling, setRolling] = useState(false);

  const roll = () => {
    if (rolling) return;
    setRolling(true);

    let ticks = 0;
    const maxTicks = 12;
    const interval = setInterval(() => {
      const rand = Math.floor(Math.random() * (sides - min + 1)) + min;
      setValue(rand);
      ticks++;
      if (ticks >= maxTicks) {
        clearInterval(interval);
        setRolling(false);
      }
    }, 60);
  };

  const displayValue = value !== null ? value : null;
  const dotsKey = displayValue !== null && displayValue <= 6 ? displayValue : null;

  return (
    <div className={styles.wrapper}>
      <p className={styles.label}>{label}</p>
      <button
        className={`${styles.dice} ${rolling ? styles.rolling : ''} ${value !== null ? styles.hasValue : ''}`}
        onClick={roll}
        aria-label="Бросить кубик"
      >
        {dotsKey !== null ? (
          <svg viewBox="0 0 100 100" className={styles.svg}>
            {diceDots[dotsKey].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r={8} fill="currentColor" />
            ))}
          </svg>
        ) : displayValue !== null ? (
          <span className={styles.bigNumber}>{displayValue}</span>
        ) : (
          <svg viewBox="0 0 100 100" className={styles.svg}>
            <circle cx={50} cy={50} r={8} fill="currentColor" opacity={0.3} />
          </svg>
        )}
      </button>
      <p className={styles.hint}>{value === null ? 'Нажми, чтобы бросить' : ''}</p>
    </div>
  );
}
