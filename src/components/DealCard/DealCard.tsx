import type { Deal } from '../../types/deal';
import { widgetRegistry } from '../widgets';
import styles from './DealCard.module.css';

interface DealCardProps {
  deal: Deal;
}

export function DealCard({ deal }: DealCardProps) {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>{deal.title}</h2>
      <p className={styles.description}>{deal.description}</p>
      {deal.widgets && deal.widgets.length > 0 && (
        <div className={styles.widgets}>
          {deal.widgets.map((widget, i) => {
            const WidgetComponent = widgetRegistry[widget.type];
            if (!WidgetComponent) return null;
            return (
              <div key={i} className={styles.widgetWrapper}>
                <WidgetComponent {...(widget.props ?? {})} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
