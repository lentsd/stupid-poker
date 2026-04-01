import { useState } from 'react';
import { HomeScreen } from './components/HomeScreen/HomeScreen';
import { DealScreen } from './components/DealScreen/DealScreen';
import { CatalogScreen } from './components/CatalogScreen/CatalogScreen';
import { useRandomDeal } from './hooks/useRandomDeal';
import type { Deal } from './types/deal';
import styles from './App.module.css';

type Screen = 'home' | 'deal';

function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [catalogOpen, setCatalogOpen] = useState(false);
  const { currentDeal, pickRandom, setDeal } = useRandomDeal();

  const handleStart = () => {
    pickRandom();
    setScreen('deal');
  };

  const handleNext = () => {
    pickRandom();
  };

  const handleHome = () => {
    setScreen('home');
    setCatalogOpen(false);
  };

  const handleSelectFromCatalog = (deal: Deal) => {
    setDeal(deal);
    setCatalogOpen(false);
    setScreen('deal');
  };

  return (
    <div className={styles.app}>
      {screen === 'home' && (
        <HomeScreen onStart={handleStart} onCatalog={() => setCatalogOpen(true)} />
      )}
      {screen === 'deal' && currentDeal && (
        <DealScreen deal={currentDeal} onNext={handleNext} onHome={handleHome} />
      )}
      {catalogOpen && (
        <CatalogScreen onSelect={handleSelectFromCatalog} onClose={() => setCatalogOpen(false)} />
      )}
    </div>
  );
}

export default App;
