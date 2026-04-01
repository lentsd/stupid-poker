import type { ComponentType } from 'react';
import { DiceWidget } from './DiceWidget/DiceWidget';
import { RandomPickWidget } from './RandomPickWidget/RandomPickWidget';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const widgetRegistry: Record<string, ComponentType<any>> = {
  dice: DiceWidget,
  randomPick: RandomPickWidget,
};
