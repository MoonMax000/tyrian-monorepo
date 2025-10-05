export type TPurchasedActions = 'favorite' | 'del';

export interface IPurchased {
  type: string;
  name: string;
  purchased: string;
  actions: TPurchasedActions[];
}
