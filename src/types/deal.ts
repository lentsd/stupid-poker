export type WidgetType = 'dice' | 'timer' | string;

export interface DealWidget {
  type: WidgetType;
  props?: Record<string, unknown>;
}

export interface Deal {
  id: string;
  title: string;
  description: string;
  widgets?: DealWidget[];
}
