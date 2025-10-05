export type TMaterialActionsAdd = 'copy' | 'del' | 'edit';
export type TPublishStatus = 'Published' | 'Draft' | 'Archived';

export interface MaterialAdd {
  type: string;
  name: string;
  publishStatus: TPublishStatus;
  publishDate: string;
  views: string;
  actions: TMaterialActionsAdd[];
}
