import styles from './HomeScreen.module.css';

interface HomeScreenProps {
  onStart: () => void;
  onCatalog: () => void;
}

export function HomeScreen({ onStart, onCatalog }: HomeScreenProps) {
  return (
    <div className={styles.screen}>
      <div className={styles.content}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>🃏</span>
        </div>
        <h1 className={styles.title}>
          Дурацкий
          <br />
          <span className={styles.titleAccent}>Покер</span>
        </h1>
        <p className={styles.subtitle}>Настольная игра с правилами раздач</p>
        <div className={styles.buttons}>
          <button className={styles.startButton} onClick={onStart}>
            <span className={styles.buttonIcon}>🎲</span>
            Случайная раздача
          </button>
          <button className={styles.catalogButton} onClick={onCatalog}>
            <span className={styles.buttonIcon}>📋</span>
            Все раздачи
          </button>
        </div>
      </div>
      <div className={styles.decoration}>
        <span className={styles.card}>♠</span>
        <span className={styles.card}>♥</span>
        <span className={styles.card}>♦</span>
        <span className={styles.card}>♣</span>
      </div>
    </div>
  );
}
