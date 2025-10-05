export type TActiveActions = 'add' | 'del';

export type TStatus = 'Active' | 'Expiring';

export interface IActive {
  author: string;
  type: string;
  name: string;
  ends: string;
  status: TStatus;
  price: string;
  actions: TActiveActions[];
}
