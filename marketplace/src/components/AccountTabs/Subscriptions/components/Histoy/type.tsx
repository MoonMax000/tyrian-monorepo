export type THistoyActions = 'reload';

export type TStatus = 'Expired' | 'Canceled' | 'Failed';

export interface IHistoy {
  author: string;
  type: string;
  name: string;
  ends: string;
  status: TStatus;
  actions: THistoyActions[];
}
