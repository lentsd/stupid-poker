import type { Deal } from '../../types/deal';
import { DealCard } from '../DealCard/DealCard';
import styles from './DealScreen.module.css';

interface DealScreenProps {
  deal: Deal;
  onNext: () => void;
  onHome: () => void;
}

export function DealScreen({ deal, onNext, onHome }: DealScreenProps) {
  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <button className={styles.homeButton} onClick={onHome} aria-label="На главную">
          ← Главная
        </button>
        <span className={styles.headerLabel}>Раздача</span>
      </header>

      <main className={styles.main}>
        {/* key={deal.id} forces full remount on new deal — resets all widget state */}
        <DealCard key={deal.id} deal={deal} />
      </main>

      <footer className={styles.footer}>
        <button className={styles.nextButton} onClick={onNext}>
          <span>🎲</span>
          Ещё раздача
        </button>
      </footer>
    </div>
  );
}
