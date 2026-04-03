import { useState, useCallback } from 'react';
import type { Deal } from '../types/deal';
import { deals } from '../config/deals';

export function useRandomDeal(initialDeal: Deal | null = null) {
  const [currentDeal, setCurrentDeal] = useState<Deal | null>(initialDeal);
  const [usedIds, setUsedIds] = useState<Set<string>>(
    initialDeal ? new Set([initialDeal.id]) : new Set(),
  );

  const pickRandom = useCallback(() => {
    let available = deals.filter((d) => !usedIds.has(d.id));

    // Reset if all deals have been shown
    if (available.length === 0) {
      available = deals;
      setUsedIds(new Set());
    }

    // Exclude current deal from available if possible
    const pool =
      currentDeal && available.length > 1
        ? available.filter((d) => d.id !== currentDeal.id)
        : available;

    const picked = pool[Math.floor(Math.random() * pool.length)];
    setCurrentDeal(picked);
    setUsedIds((prev) => new Set([...prev, picked.id]));
    return picked;
  }, [currentDeal, usedIds]);

  const setDeal = useCallback((deal: Deal) => {
    setCurrentDeal(deal);
    setUsedIds((prev) => new Set([...prev, deal.id]));
  }, []);

  return { currentDeal, pickRandom, setDeal };
}
