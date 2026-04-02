import type { ComponentType } from 'react';
import { DiceWidget } from './DiceWidget/DiceWidget';
import { RandomPickWidget } from './RandomPickWidget/RandomPickWidget';
import { RandomPickCardsWidget } from './RandomPickCardsWidget/RandomPickCardsWidget';
import { MafiaWidget } from './MafiaWidget/MafiaWidget';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const widgetRegistry: Record<string, ComponentType<any>> = {
  dice: DiceWidget,
  randomPick: RandomPickWidget,
  randomPickCards: RandomPickCardsWidget,
  mafia: MafiaWidget,
};
