import { useState } from 'react';
import { HomeScreen } from './components/HomeScreen/HomeScreen';
import { DealScreen } from './components/DealScreen/DealScreen';
import { CatalogScreen } from './components/CatalogScreen/CatalogScreen';
import { useRandomDeal } from './hooks/useRandomDeal';
import { deals } from './config/deals';
import type { Deal } from './types/deal';
import styles from './App.module.css';

type Screen = 'home' | 'deal';

function getDealFromUrl(): Deal | null {
  const params = new URLSearchParams(window.location.search);
  const gameId = params.get('game');
  if (!gameId) return null;
  return deals.find((d) => d.id === gameId) ?? null;
}

function setGameParam(id: string | null) {
  const url = new URL(window.location.href);
  if (id) {
    url.searchParams.set('game', id);
  } else {
    url.searchParams.delete('game');
  }
  window.history.replaceState(null, '', url.toString());
}

function App() {
  const [initialDeal] = useState<Deal | null>(getDealFromUrl);
  const [screen, setScreen] = useState<Screen>(() => (getDealFromUrl() ? 'deal' : 'home'));
  const [catalogOpen, setCatalogOpen] = useState(false);
  const { currentDeal, pickRandom, setDeal } = useRandomDeal(initialDeal);

  const handleStart = () => {
    const deal = pickRandom();
    if (deal) setGameParam(deal.id);
    setScreen('deal');
  };

  const handleNext = () => {
    const deal = pickRandom();
    if (deal) setGameParam(deal.id);
  };

  const handleHome = () => {
    setScreen('home');
    setCatalogOpen(false);
    setGameParam(null);
  };

  const handleSelectFromCatalog = (deal: Deal) => {
    setDeal(deal);
    setCatalogOpen(false);
    setScreen('deal');
    setGameParam(deal.id);
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
