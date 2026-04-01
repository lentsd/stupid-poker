import type { Deal } from '../../types/deal';
import { deals } from '../../config/deals';
import styles from './CatalogScreen.module.css';

interface CatalogScreenProps {
  onSelect: (deal: Deal) => void;
  onClose: () => void;
}

export function CatalogScreen({ onSelect, onClose }: CatalogScreenProps) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Все раздачи</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Закрыть">
            ✕
          </button>
        </div>
        <div className={styles.list}>
          {deals.map((deal) => (
            <button key={deal.id} className={styles.item} onClick={() => onSelect(deal)}>
              <span className={styles.itemTitle}>{deal.title}</span>
              {deal.widgets && deal.widgets.length > 0 && <span className={styles.badge}>🎲</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
